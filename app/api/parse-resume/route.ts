import { NextRequest, NextResponse } from "next/server";
import type { FreelancerCategory } from "@/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

type ResumePortfolioItem = {
  title: string;
  description: string;
  project_url?: string;
  technologies: string[];
};

type ResumeParseResponse = {
  name: string;
  bio: string;
  skills: string[];
  category: FreelancerCategory;
  portfolio: ResumePortfolioItem[];
  provider: "gemini" | "fallback";
  fallback?: boolean;
  error?: string;
};

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_CATEGORIES: Set<FreelancerCategory> = new Set([
  "General",
  "Developer",
  "Designer",
  "Graphic Design",
  "Writer",
  "Marketing Specialist",
  "Marketing",
  "Virtual Assistant",
  "Admin/VA",
  "Customer Support",
  "Sales",
  "Project Management",
  "QA/Testing",
  "Data Entry",
  "Finance/Accounting",
  "IT & Networking",
  "Writing & Content",
  "Data & Automation",
  "Other",
]);

const cleanJsonBlock = (text: string) => {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  return text.trim();
};

const normalizeCategory = (value: unknown): FreelancerCategory => {
  if (typeof value === "string" && ALLOWED_CATEGORIES.has(value as FreelancerCategory)) {
    return value as FreelancerCategory;
  }
  return "General";
};

const normalizeResumeResponse = (raw: unknown, fallback: ResumeParseResponse): ResumeParseResponse => {
  if (!raw || typeof raw !== "object") return fallback;
  const input = raw as Record<string, unknown>;

  const name = typeof input.name === "string" && input.name.trim() ? input.name.trim() : fallback.name;
  const bio = typeof input.bio === "string" && input.bio.trim() ? input.bio.trim() : fallback.bio;
  const category = normalizeCategory(input.category);

  const skills = Array.isArray(input.skills)
    ? Array.from(
        new Set(
          input.skills
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      ).slice(0, 25)
    : fallback.skills;

  const portfolio = Array.isArray(input.portfolio)
    ? input.portfolio
        .reduce<ResumePortfolioItem[]>((acc, item) => {
          if (!item || typeof item !== "object") return acc;
          const itemData = item as Record<string, unknown>;
          const title = typeof itemData.title === "string" ? itemData.title.trim() : "";
          const description = typeof itemData.description === "string" ? itemData.description.trim() : "";
          if (!title || !description) return acc;

          const technologies = Array.isArray(itemData.technologies)
            ? Array.from(
                new Set(
                  itemData.technologies
                    .filter((tech): tech is string => typeof tech === "string")
                    .map((tech) => tech.trim())
                    .filter(Boolean),
                ),
              ).slice(0, 12)
            : [];

          const normalizedItem: ResumePortfolioItem = {
            title,
            description,
            technologies,
          };

          if (typeof itemData.project_url === "string" && itemData.project_url.trim()) {
            normalizedItem.project_url = itemData.project_url.trim();
          }

          acc.push(normalizedItem);
          return acc;
        }, [])
        .slice(0, 8)
    : fallback.portfolio;

  return {
    name,
    bio,
    skills,
    category,
    portfolio: portfolio.length > 0 ? portfolio : fallback.portfolio,
    provider: "gemini",
    fallback: false,
  };
};

const buildFallbackResponse = (fileName: string, textLength: number, reason?: string): ResumeParseResponse => ({
  name: fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim() || "Freelancer",
  bio: `Resume text extracted (${textLength} chars). Please review and complete details manually.`,
  skills: [],
  category: "General",
  portfolio: [],
  provider: "fallback",
  fallback: true,
  error: reason,
});

type PointLike = {
  x?: number;
  y?: number;
  z?: number;
  w?: number;
};

type RectLike = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected multipart/form-data." },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400, headers: RESPONSE_HEADERS });
    }

    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400, headers: RESPONSE_HEADERS });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    try {
      const globalPolyfills = globalThis as unknown as Record<string, unknown>;

      if (!globalPolyfills.DOMMatrix) {
        globalPolyfills.DOMMatrix = class DOMMatrix {
          matrix: unknown;
          constructor(init: unknown) {
            this.matrix = init;
          }
          static fromFloat32Array(array: unknown) {
            return new DOMMatrix(array);
          }
          static fromFloat64Array(array: unknown) {
            return new DOMMatrix(array);
          }
        };
      }
      if (!globalPolyfills.Path2D) {
        globalPolyfills.Path2D = class Path2D {
          addPath() {}
          closePath() {}
          moveTo() {}
          lineTo() {}
          bezierCurveTo() {}
          quadraticCurveTo() {}
          arc() {}
          arcTo() {}
          ellipse() {}
          rect() {}
        };
      }
      if (!globalPolyfills.DOMPoint) {
        globalPolyfills.DOMPoint = class DOMPoint {
          x: number;
          y: number;
          z: number;
          w: number;
          constructor(x = 0, y = 0, z = 0, w = 1) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
          }
          static fromPoint(other: PointLike) {
            return new DOMPoint(other.x || 0, other.y || 0, other.z || 0, other.w || 1);
          }
        };
      }
      if (!globalPolyfills.DOMRect) {
        globalPolyfills.DOMRect = class DOMRect {
          x: number;
          y: number;
          width: number;
          height: number;
          top: number;
          right: number;
          bottom: number;
          left: number;
          constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.top = y;
            this.left = x;
            this.right = x + width;
            this.bottom = y + height;
          }
          static fromRect(other: RectLike) {
            return new DOMRect(other.x || 0, other.y || 0, other.width || 0, other.height || 0);
          }
        };
      }

      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer, verbosity: 0 });
      const data = await parser.getText({
        lineEnforce: true,
        lineThreshold: 4.0,
      });
      text = data.text || "";
    } catch (parseError: unknown) {
      const parseMessage = parseError instanceof Error ? parseError.message : "Parse error";
      return NextResponse.json(
        { error: `Failed to read PDF file: ${parseMessage}` },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from PDF. Please ensure the PDF is not just a scanned image or try a different file.",
        },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const fallback = buildFallbackResponse(file.name, text.length, "Gemini unavailable");
    if (!apiKey) {
      return NextResponse.json(
        { ...fallback, error: "GEMINI_API_KEY is missing" },
        { headers: RESPONSE_HEADERS },
      );
    }

    const prompt = [
      "You extract profile data from resume text.",
      "Return ONLY valid JSON with this exact schema:",
      "{",
      '  "name": "string",',
      '  "bio": "string",',
      '  "skills": ["string"],',
      '  "category": "General|Developer|Designer|Graphic Design|Writer|Marketing Specialist|Marketing|Virtual Assistant|Admin/VA|Customer Support|Sales|Project Management|QA/Testing|Data Entry|Finance/Accounting|IT & Networking|Writing & Content|Data & Automation|Other",',
      '  "portfolio": [',
      "    {",
      '      "title": "string",',
      '      "description": "string",',
      '      "project_url": "string (optional)",',
      '      "technologies": ["string"]',
      "    }",
      "  ]",
      "}",
      "Rules:",
      "- Use concise, professional language.",
      "- Extract up to 25 skills.",
      "- Create 2 to 6 portfolio project entries when enough evidence exists; otherwise return fewer entries.",
      "- Do not invent employer-confidential details.",
      "- If resume has no clear project URL, omit project_url.",
      "",
      "Resume text starts below:",
      text.slice(0, 20000),
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
            temperature: 0.2,
            topP: 0.9,
            maxOutputTokens: 2500,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      let providerMessage = "Gemini request failed";
      try {
        const errJson = await geminiRes.json();
        providerMessage = String(errJson?.error?.message || providerMessage);
      } catch {}
      return NextResponse.json(
        buildFallbackResponse(file.name, text.length, providerMessage),
        { headers: RESPONSE_HEADERS },
      );
    }

    const geminiData = await geminiRes.json();
    const modelText = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part?.text)
      .filter(Boolean)
      .join("\n");

    if (!modelText || typeof modelText !== "string") {
      return NextResponse.json(
        buildFallbackResponse(file.name, text.length, "Gemini returned empty response"),
        { headers: RESPONSE_HEADERS },
      );
    }

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(cleanJsonBlock(modelText));
    } catch {
      parsed = null;
    }

    return NextResponse.json(normalizeResumeResponse(parsed, fallback), { headers: RESPONSE_HEADERS });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred during resume parsing";
    return NextResponse.json(
      { error: message },
      { status: 500, headers: RESPONSE_HEADERS },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: RESPONSE_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    { message: "AI Resume Parser API is online. Use POST to parse a resume file." },
    { headers: RESPONSE_HEADERS },
  );
}
