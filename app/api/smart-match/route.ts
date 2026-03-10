import { NextRequest, NextResponse } from "next/server";
import type { Job, SmartMatchResponse, SmartMatchResult, UserProfile } from "@/types";
import { heuristicSmartMatchMany } from "@/lib/smartMatch";

interface SmartMatchPayload {
  profile: UserProfile;
  jobs: Job[];
}

const MAX_JOBS_PER_REQUEST = 40;

const mapGeminiError = (status: number, message: string) => {
  const msg = message.toLowerCase();
  if (status === 401 || status === 403 || msg.includes("api key not valid") || msg.includes("invalid api key")) {
    return { code: "invalid_key", message: "Gemini API key is invalid or unauthorized." };
  }
  if (status === 429 || msg.includes("quota") || msg.includes("rate limit")) {
    return { code: "quota_exceeded", message: "Gemini quota exceeded or rate-limited." };
  }
  if (status >= 500) {
    return { code: "provider_unavailable", message: "Gemini service is temporarily unavailable." };
  }
  return { code: "provider_error", message: `Gemini request failed (${status}).` };
};

const cleanJsonBlock = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
};

const normalizeModelMatches = (
  rawMatches: unknown,
  fallback: SmartMatchResult[]
): SmartMatchResult[] => {
  if (!Array.isArray(rawMatches)) return fallback;

  const fallbackMap = new Map(fallback.map((item) => [item.jobId, item]));
  const normalized = rawMatches
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const x = item as Record<string, unknown>;
      const jobId = typeof x.jobId === "string" ? x.jobId : "";
      if (!jobId) return null;
      const fallbackItem = fallbackMap.get(jobId);
      if (!fallbackItem) return null;

      const modelScore = typeof x.score === "number" ? x.score : fallbackItem.score;
      const matchedSkills = Array.isArray(x.matchedSkills)
        ? x.matchedSkills.filter((s): s is string => typeof s === "string")
        : fallbackItem.matchedSkills;
      const missingSkills = Array.isArray(x.missingSkills)
        ? x.missingSkills.filter((s): s is string => typeof s === "string")
        : fallbackItem.missingSkills;
      const reason = typeof x.reason === "string" ? x.reason : fallbackItem.reason;

      return {
        jobId,
        score: Math.max(0, Math.min(100, Math.round(modelScore))),
        matchedSkills,
        missingSkills,
        reason
      } satisfies SmartMatchResult;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (normalized.length === 0) return fallback;

  const normalizedMap = new Map(normalized.map((item) => [item.jobId, item]));
  return fallback.map((item) => normalizedMap.get(item.jobId) ?? item);
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SmartMatchPayload>;
    if (!body?.profile || !Array.isArray(body.jobs)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const jobs = body.jobs.slice(0, MAX_JOBS_PER_REQUEST);
    const profile = body.profile;
    const fallbackMatches = heuristicSmartMatchMany(jobs, profile);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const response: SmartMatchResponse = {
        matches: fallbackMatches,
        provider: "heuristic",
        fallback: true,
        error: "GEMINI_API_KEY is missing",
        errorCode: "missing_key"
      };
      return NextResponse.json(response);
    }

    const compactJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      category: job.category,
      skills: job.skills,
      energyRequirement: job.energyRequirement || "Balanced",
      description: String(job.description || "").slice(0, 500)
    }));

    const compactProfile = {
      category: profile.category,
      skills: profile.skills || [],
      wellness: profile.wellness
        ? {
            energyRating: profile.wellness.energyRating,
            verifiedSustainable: profile.wellness.verifiedSustainable
          }
        : null
    };

    const prompt = [
      "You are a job matching engine.",
      "Given one freelancer profile and a list of jobs, compute skill-fit scores.",
      "Return ONLY valid JSON object with this exact schema:",
      '{ "matches": [{ "jobId": "string", "score": 0-100, "matchedSkills": ["..."], "missingSkills": ["..."], "reason": "short reason" }] }',
      "Rules:",
      "- Prioritize skills overlap and category fit.",
      "- Consider energy compatibility from wellness.energyRating vs job.energyRequirement.",
      "- Keep reason short (max 20 words).",
      "- Include every jobId exactly once.",
      "",
      `Profile: ${JSON.stringify(compactProfile)}`,
      `Jobs: ${JSON.stringify(compactJobs)}`
    ].join("\n");

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!geminiRes.ok) {
      let providerMessage = "";
      try {
        const errJson = await geminiRes.json();
        providerMessage = String(errJson?.error?.message || "");
      } catch {
        providerMessage = "";
      }
      const mappedError = mapGeminiError(geminiRes.status, providerMessage);

      const response: SmartMatchResponse = {
        matches: fallbackMatches,
        provider: "heuristic",
        fallback: true,
        error: mappedError.message,
        errorCode: mappedError.code
      };
      return NextResponse.json(response);
    }

    const geminiData = await geminiRes.json();
    const modelText = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part?.text)
      .filter(Boolean)
      .join("\n");

    if (!modelText || typeof modelText !== "string") {
      const response: SmartMatchResponse = {
        matches: fallbackMatches,
        provider: "heuristic",
        fallback: true,
        error: "Gemini returned empty response",
        errorCode: "empty_response"
      };
      return NextResponse.json(response);
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(cleanJsonBlock(modelText));
    } catch {
      parsed = null;
    }

    const parsedMatches = parsed && typeof parsed === "object"
      ? (parsed as { matches?: unknown }).matches
      : undefined;
    const matches = normalizeModelMatches(parsedMatches, fallbackMatches);
    const response: SmartMatchResponse = {
      matches,
      provider: "gemini",
      fallback: false
    };
    return NextResponse.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to compute smart match";
    const isAbort = message.toLowerCase().includes("aborted");
    const isNetwork = message.toLowerCase().includes("fetch") || message.toLowerCase().includes("network");
    return NextResponse.json(
      {
        error: message,
        matches: [],
        provider: "heuristic",
        fallback: true,
        errorCode: isAbort ? "aborted" : isNetwork ? "network_error" : "internal_error"
      },
      { status: 500 }
    );
  }
}
