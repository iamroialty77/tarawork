import { NextRequest, NextResponse } from "next/server";
import type { UserProfile } from "@/types";

interface CareerRoadmapPayload {
  profile?: UserProfile;
  userId?: string;
  marketContext?: {
    topDemandSkills?: string[];
    missingSkills?: string[];
  };
}

interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface CareerRoadmapResponse {
  roadmapId: string;
  status: "Unlocked";
  nextMilestone: string;
  summary: string;
  insights: string[];
  confidenceScore: number;
  modules: RoadmapModule[];
  provider: "gemini" | "fallback";
  fallback?: boolean;
  error?: string;
  errorCode?: string;
}

const cleanJsonBlock = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
};

const safeLevel = (value: unknown): RoadmapModule["level"] => {
  if (value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Expert") {
    return value;
  }
  return "Intermediate";
};

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

const generateFallbackRoadmap = (
  profile: UserProfile,
  marketContext?: CareerRoadmapPayload["marketContext"],
  fallbackReason?: { message: string; code: string }
): CareerRoadmapResponse => {
  const category = profile.category || "General";
  const profileSkills = (profile.skills || []).filter(Boolean);
  const missingSkills = (marketContext?.missingSkills || []).slice(0, 4);
  const focusSkills = [...missingSkills, ...profileSkills].filter(Boolean).slice(0, 6);

  const modules: RoadmapModule[] = [
    {
      id: "module-1",
      title: "Career Positioning and Goal Alignment",
      description: `Define a focused ${category} trajectory, set role targets, and align current experience with market expectations.`,
      duration: "1-2 weeks",
      level: "Beginner"
    },
    {
      id: "module-2",
      title: "Core Skill Strengthening",
      description: `Build depth in critical competencies: ${focusSkills.slice(0, 3).join(", ") || "category-specific core skills"}.`,
      duration: "3-4 weeks",
      level: "Intermediate"
    },
    {
      id: "module-3",
      title: "Portfolio and Proof of Work Upgrade",
      description: "Create high-impact case studies with measurable outcomes tailored to your target client segment.",
      duration: "2-3 weeks",
      level: "Advanced"
    },
    {
      id: "module-4",
      title: "Advanced Delivery and Client Communication",
      description: "Improve discovery, scoping, and stakeholder communication to increase conversion and retention.",
      duration: "2 weeks",
      level: "Advanced"
    },
    {
      id: "module-5",
      title: "Specialization and Market Positioning",
      description: "Package your expertise into focused service offers and prepare for higher-value engagements.",
      duration: "2-4 weeks",
      level: "Expert"
    }
  ];

  return {
    roadmapId: `RD-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    status: "Unlocked",
    nextMilestone: modules[0].title,
    summary: `Professional roadmap prepared for ${category}. The sequence prioritizes skill depth, stronger portfolio evidence, and clear market positioning.`,
    insights: [
      `Current skills baseline: ${profileSkills.length} listed competencies.`,
      `Priority gaps identified: ${missingSkills.length > 0 ? missingSkills.join(", ") : "No critical gaps detected from current market sample"}.`,
      "Roadmap design balances upskilling, portfolio execution, and client-facing capability.",
      "Completion can improve readiness for higher-value roles within the same career track."
    ],
    confidenceScore: 86,
    modules,
    provider: "fallback",
    fallback: true,
    error: fallbackReason?.message,
    errorCode: fallbackReason?.code
  };
};

const normalizeRoadmap = (
  raw: unknown,
  fallback: CareerRoadmapResponse
): CareerRoadmapResponse => {
  if (!raw || typeof raw !== "object") return fallback;
  const input = raw as Record<string, unknown>;

  const modules = Array.isArray(input.modules)
    ? input.modules
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;
          const moduleData = item as Record<string, unknown>;
          const title = typeof moduleData.title === "string" ? moduleData.title.trim() : "";
          const description = typeof moduleData.description === "string" ? moduleData.description.trim() : "";
          const duration = typeof moduleData.duration === "string" ? moduleData.duration.trim() : "";
          if (!title || !description || !duration) return null;

          return {
            id: typeof moduleData.id === "string" && moduleData.id.trim() ? moduleData.id.trim() : `module-${index + 1}`,
            title,
            description,
            duration,
            level: safeLevel(moduleData.level)
          } satisfies RoadmapModule;
        })
        .filter((module): module is RoadmapModule => module !== null)
    : [];

  if (modules.length === 0) return fallback;

  const insights = Array.isArray(input.insights)
    ? input.insights.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 6)
    : fallback.insights;

  const confidenceScore = typeof input.confidenceScore === "number"
    ? Math.max(60, Math.min(99, Math.round(input.confidenceScore)))
    : fallback.confidenceScore;

  return {
    roadmapId: typeof input.roadmapId === "string" && input.roadmapId.trim()
      ? input.roadmapId.trim()
      : fallback.roadmapId,
    status: "Unlocked",
    nextMilestone: typeof input.nextMilestone === "string" && input.nextMilestone.trim()
      ? input.nextMilestone.trim()
      : modules[0].title,
    summary: typeof input.summary === "string" && input.summary.trim()
      ? input.summary.trim()
      : fallback.summary,
    insights: insights.length > 0 ? insights : fallback.insights,
    confidenceScore,
    modules,
    provider: "gemini",
    fallback: false
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CareerRoadmapPayload;
    const profile = body?.profile;
    if (!profile) {
      return NextResponse.json({ error: "Invalid payload: profile is required." }, { status: 400 });
    }
    const fallback = generateFallbackRoadmap(profile, body.marketContext);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        ...fallback,
        error: "GEMINI_API_KEY is missing",
        errorCode: "missing_key",
      });
    }

    const compactProfile = {
      name: profile.name,
      category: profile.category,
      bio: String(profile.bio || "").slice(0, 700),
      skills: (profile.skills || []).slice(0, 20),
      verifiedSkills: (profile.verifiedSkills || []).map((skill) => ({
        name: skill.name,
        score: skill.score
      })).slice(0, 12),
      portfolioCount: Array.isArray(profile.portfolio) ? profile.portfolio.length : 0,
      hourlyRate: profile.hourlyRate
    };

    const prompt = [
      "You are a senior career strategist.",
      "Create a professional, practical AI career roadmap for this freelancer.",
      "Respond with ONLY valid JSON using this exact schema:",
      "{",
      '  "roadmapId": "RD-XXXXX",',
      '  "summary": "string",',
      '  "insights": ["string", "string", "string", "string"],',
      '  "confidenceScore": 0,',
      '  "nextMilestone": "string",',
      '  "modules": [',
      "    {",
      '      "id": "module-1",',
      '      "title": "string",',
      '      "description": "string",',
      '      "duration": "string",',
      '      "level": "Beginner|Intermediate|Advanced|Expert"',
      "    }",
      "  ]",
      "}",
      "Rules:",
      "- Keep tone concise, executive, and realistic.",
      "- Create 5 to 7 modules in progression order.",
      "- Use specific skill and career context from the profile.",
      "- Avoid buzzwords and inflated claims.",
      "- confidenceScore must be between 60 and 99.",
      "",
      `Profile: ${JSON.stringify(compactProfile)}`,
      `Market context: ${JSON.stringify(body.marketContext || {})}`
    ].join("\n");

    const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            topP: 0.9,
            maxOutputTokens: 3000,
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
      return NextResponse.json({
        ...generateFallbackRoadmap(profile, body.marketContext, mappedError),
      });
    }

    const geminiData = await geminiRes.json();
    const modelText = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part?.text)
      .filter(Boolean)
      .join("\n");

    if (!modelText || typeof modelText !== "string") {
      return NextResponse.json({
        ...generateFallbackRoadmap(profile, body.marketContext, {
          message: "Gemini returned empty response",
          code: "empty_response"
        }),
      });
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(cleanJsonBlock(modelText));
    } catch {
      parsed = null;
    }

    const roadmap = normalizeRoadmap(parsed, fallback);
    return NextResponse.json(roadmap);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to generate roadmap";
    return NextResponse.json(
      {
        error: message
      },
      { status: 500 }
    );
  }
}
