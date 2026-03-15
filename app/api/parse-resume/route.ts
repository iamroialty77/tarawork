import { NextRequest, NextResponse } from "next/server";
import type { ExperienceItem, FreelancerCategory } from "@/types";

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
  experience: ExperienceItem[];
  portfolio: ResumePortfolioItem[];
  provider: "gemini" | "fallback";
  fallback?: boolean;
  error?: string;
};

type OcrSpaceResponse = {
  IsErroredOnProcessing?: boolean;
  ErrorMessage?: string[] | string;
  ParsedResults?: Array<{
    ParsedText?: string;
  }>;
};

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const cleanText = (text: string) =>
  text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const dedupePortfolio = (items: ResumePortfolioItem[]): ResumePortfolioItem[] => {
  const seen = new Set<string>();
  const deduped: ResumePortfolioItem[] = [];
  for (const item of items) {
    const key = `${item.title.toLowerCase()}::${item.description.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
};

const STOP_TITLES = new Set([
  "about",
  "summary",
  "profile",
  "education",
  "skills",
  "experience",
  "work experience",
  "projects",
  "portfolio",
  "contact",
  "certifications",
  "achievements",
]);

const KNOWN_SKILLS = [
  "react", "next.js", "typescript", "javascript", "node.js", "express", "python", "django", "flask",
  "java", "spring", "c#", ".net", "php", "laravel", "go", "rust", "kotlin", "swift",
  "sql", "postgresql", "mysql", "mongodb", "redis", "graphql", "rest api",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux", "git", "github",
  "figma", "adobe photoshop", "illustrator", "canva", "ui design", "ux design",
  "seo", "google ads", "facebook ads", "copywriting", "content writing", "email marketing",
  "virtual assistant", "data entry", "customer support", "project management", "qa testing",
];

const extractName = (text: string, fileName: string) => {
  const headingKeywords = [
    "skill",
    "summary",
    "profile",
    "about",
    "experience",
    "education",
    "project",
    "portfolio",
    "contact",
    "certification",
    "achievement",
    "objective",
  ];

  const lines = text
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  for (const line of lines.slice(0, 12)) {
    if (line.length < 3 || line.length > 60) continue;
    if (line.includes("@") || /^https?:\/\//i.test(line)) continue;
    if (/\d{3,}/.test(line)) continue;
    if (STOP_TITLES.has(line.toLowerCase())) continue;
    if (headingKeywords.some((keyword) => line.toLowerCase().includes(keyword))) continue;
    const words = line.split(" ");
    if (words.length < 2 || words.length > 4) continue;

    const looksLikePersonName = words.every((word) => /^[A-Za-z.'-]+$/.test(word));
    if (!looksLikePersonName) continue;

    return line;
  }

  return fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim() || "Freelancer";
};

const extractBio = (text: string) => {
  const normalized = cleanText(text);
  const summaryMatch = normalized.match(/(?:professional summary|summary|profile|about me)\s*[:\n]+([\s\S]{50,700})/i);
  if (summaryMatch?.[1]) {
    return normalizeWhitespace(summaryMatch[1]).slice(0, 420);
  }

  const firstParagraph = normalized.split(/\n\n+/).find((p) => p.length > 50) || normalized;
  return normalizeWhitespace(firstParagraph).slice(0, 420);
};

const extractSkills = (text: string) => {
  const lowered = text.toLowerCase();
  const foundFromDictionary = KNOWN_SKILLS.filter((skill) => lowered.includes(skill));

  const skillsSectionMatch = text.match(/skills?\s*[:\n]+([\s\S]{20,500})/i);
  const sectionSkills = skillsSectionMatch?.[1]
    ? skillsSectionMatch[1]
        .split(/[\n,|•·]/)
        .map((skill) => normalizeWhitespace(skill))
        .filter((skill) => skill.length >= 2 && skill.length <= 40)
    : [];

  return Array.from(new Set([...foundFromDictionary, ...sectionSkills]))
    .map((skill) => skill.replace(/\.$/, ""))
    .filter(Boolean)
    .slice(0, 25);
};

const inferCategory = (skills: string[], text: string): FreelancerCategory => {
  const loweredSkills = skills.map((skill) => skill.toLowerCase());
  const haystack = `${text.toLowerCase()} ${loweredSkills.join(" ")}`;

  if (/(react|node|typescript|python|java|api|full[- ]?stack|frontend|backend)/i.test(haystack)) return "Developer";
  if (/(figma|photoshop|illustrator|ui|ux|graphic|brand design)/i.test(haystack)) return "Designer";
  if (/(seo|google ads|facebook ads|marketing|campaign)/i.test(haystack)) return "Marketing Specialist";
  if (/(virtual assistant|admin|calendar|email management|data entry)/i.test(haystack)) return "Virtual Assistant";
  if (/(writer|copywriting|content writing|blog|article)/i.test(haystack)) return "Writer";
  if (/(customer support|chat support|zendesk)/i.test(haystack)) return "Customer Support";
  return "General";
};

const looksLikeProjectTitle = (line: string) => {
  const clean = normalizeWhitespace(line.replace(/^[-•*]\s*/, ""));
  if (clean.length < 4 || clean.length > 90) return false;
  if (clean.includes("@") || /^https?:\/\//i.test(clean)) return false;
  if (STOP_TITLES.has(clean.toLowerCase())) return false;
  if (clean.endsWith(".")) return false;
  return /[a-zA-Z]/.test(clean);
};

const extractProjectUrl = (block: string) => {
  const urlMatch = block.match(/https?:\/\/[^\s)]+/i);
  return urlMatch?.[0];
};

const guessTechFromText = (block: string, skills: string[]) => {
  const lowered = block.toLowerCase();
  return skills.filter((skill) => lowered.includes(skill.toLowerCase())).slice(0, 8);
};

const extractExperienceFromText = (text: string): ExperienceItem[] => {
  const lines = text
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  const experiences: ExperienceItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const marker = lines[i];
    const inExperienceZone = /(work experience|professional experience|experience)/i.test(marker);
    if (!inExperienceZone) continue;

    for (let j = i + 1; j < Math.min(lines.length, i + 80); j++) {
      const current = lines[j];
      if (STOP_TITLES.has(current.toLowerCase()) && j > i + 2) break;

      const looksLikeHeader =
        / at /i.test(current) ||
        /\|/.test(current) ||
        /[-–]\s*(present|20\d{2}|19\d{2})/i.test(current);
      if (!looksLikeHeader) continue;

      const durationMatch = current.match(
        /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)?\.?\s*\d{4}\s*[-–]\s*(?:present|current|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)?\.?\s*\d{4}))/i,
      );
      const duration = durationMatch?.[1] || "";

      let role = "";
      let company = "";
      if (current.includes(" at ")) {
        const parts = current.split(/\s+at\s+/i);
        role = parts[0]?.replace(duration, "").trim() || "";
        company = parts[1]?.replace(duration, "").trim() || "";
      } else if (current.includes("|")) {
        const parts = current.split("|").map((part) => part.trim());
        role = parts[0] || "";
        company = parts[1] || "";
      } else {
        role = current.replace(duration, "").trim();
      }

      const descLines: string[] = [];
      for (let k = j + 1; k < Math.min(lines.length, j + 6); k++) {
        if (STOP_TITLES.has(lines[k].toLowerCase())) break;
        if (looksLikeProjectTitle(lines[k]) && descLines.length > 1) break;
        if (/^(?:[-•*]\s*)?/.test(lines[k])) {
          descLines.push(lines[k].replace(/^[-•*]\s*/, ""));
        } else {
          descLines.push(lines[k]);
        }
      }

      const description = normalizeWhitespace(descLines.join(" ")).slice(0, 420);
      if (!role || !description) continue;

      experiences.push({
        id: `exp-${experiences.length + 1}-${Math.random().toString(36).slice(2, 7)}`,
        company: company || "Company",
        role,
        duration: duration || "Not specified",
        description,
      });

      if (experiences.length >= 8) break;
    }

    if (experiences.length >= 8) break;
  }

  if (experiences.length === 0) {
    const paragraphs = text
      .split(/\n{2,}/)
      .map((paragraph) => normalizeWhitespace(paragraph))
      .filter(Boolean);

    for (const paragraph of paragraphs) {
      if (experiences.length >= 6) break;
      if (paragraph.length < 50 || paragraph.length > 520) continue;
      if (!/(worked|managed|led|developed|designed|delivered|responsible)/i.test(paragraph)) continue;

      const header = paragraph.split(/[.:-]/)[0];
      const roleGuess = normalizeWhitespace(header).slice(0, 80);
      if (roleGuess.length < 4) continue;

      experiences.push({
        id: `exp-${experiences.length + 1}-${Math.random().toString(36).slice(2, 7)}`,
        company: "Company",
        role: roleGuess,
        duration: "Not specified",
        description: paragraph.slice(0, 420),
      });
    }
  }

  return experiences;
};

const extractPortfolioFromText = (text: string, skills: string[]): ResumePortfolioItem[] => {
  const lines = text
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);

  const items: ResumePortfolioItem[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isProjectSection = /(projects?|portfolio|case studies|selected work)/i.test(line);
    if (isProjectSection) {
      for (let j = i + 1; j < Math.min(lines.length, i + 60); j++) {
        if (STOP_TITLES.has(lines[j].toLowerCase()) && j > i + 2) break;
        if (!looksLikeProjectTitle(lines[j])) continue;

        const title = lines[j].replace(/^[-•*]\s*/, "");
        const detailLines: string[] = [];
        for (let k = j + 1; k < Math.min(lines.length, j + 5); k++) {
          if (looksLikeProjectTitle(lines[k]) && detailLines.length > 0) break;
          if (STOP_TITLES.has(lines[k].toLowerCase())) break;
          detailLines.push(lines[k]);
        }

        const block = normalizeWhitespace(detailLines.join(" "));
        if (block.length < 24) continue;

        items.push({
          title,
          description: block.slice(0, 420),
          project_url: extractProjectUrl(block),
          technologies: guessTechFromText(block, skills),
        });
      }
    }
  }

  if (items.length === 0) {
    const paragraphs = text.split(/\n{2,}/).map((p) => normalizeWhitespace(p)).filter(Boolean);
    for (const paragraph of paragraphs) {
      if (items.length >= 6) break;
      if (paragraph.length < 40 || paragraph.length > 520) continue;
      if (!/(built|developed|designed|implemented|launched|created|managed|delivered)/i.test(paragraph)) continue;
      const title = paragraph.split(/[.:,-]/)[0].slice(0, 70);
      if (!looksLikeProjectTitle(title)) continue;
      items.push({
        title,
        description: paragraph.slice(0, 420),
        project_url: extractProjectUrl(paragraph),
        technologies: guessTechFromText(paragraph, skills),
      });
    }
  }

  return dedupePortfolio(
    items
      .filter((item) => item.title && item.description)
      .slice(0, 8),
  );
};


const buildFallbackResponse = (fileName: string, textLength: number, reason?: string): ResumeParseResponse => ({
  name: fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim() || "Freelancer",
  bio: `Resume text extracted (${textLength} chars). Please review and complete details manually.`,
  skills: [],
  category: "General",
  experience: [],
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

const extractTextViaOcrSpace = async (file: File, base64Data: string): Promise<{ text: string; error?: string }> => {
  try {
    const apiKey = process.env.OCR_SPACE_API_KEY || "helloworld";
    const form = new FormData();
    form.append("apikey", apiKey);
    form.append("language", "eng");
    form.append("isOverlayRequired", "false");
    form.append("OCREngine", "2");
    form.append("filetype", "PDF");
    form.append("base64Image", `data:${file.type || "application/pdf"};base64,${base64Data}`);

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      return { text: "", error: `OCR service failed (${response.status})` };
    }

    const payload = (await response.json()) as OcrSpaceResponse;
    const parsedText = (payload.ParsedResults || [])
      .map((item) => item?.ParsedText || "")
      .join("\n")
      .trim();

    if (!parsedText) {
      const serviceError = Array.isArray(payload.ErrorMessage)
        ? payload.ErrorMessage.join(" | ")
        : payload.ErrorMessage;
      return { text: "", error: serviceError || "OCR returned empty text" };
    }

    return { text: parsedText };
  } catch (error: unknown) {
    return {
      text: "",
      error: error instanceof Error ? error.message : "OCR request failed",
    };
  }
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
    const pdfBase64 = buffer.toString("base64");
    let text = "";
    let parseErrorMessage = "";

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
      parseErrorMessage = parseError instanceof Error ? parseError.message : "Parse error";
      text = "";
    }

    let workingText = cleanText(text);
    let parserSource = "pdf-text";
    const notes: string[] = [];
    if (parseErrorMessage) notes.push(`PDF text parse warning: ${parseErrorMessage}`);

    if (!workingText || workingText.length < 160) {
      const ocrResult = await extractTextViaOcrSpace(file, pdfBase64);
      if (ocrResult.text) {
        workingText = cleanText(ocrResult.text);
        parserSource = "ocr-space";
      } else if (ocrResult.error) {
        notes.push(`OCR warning: ${ocrResult.error}`);
      }
    }

    if (!workingText) {
      return NextResponse.json(
        buildFallbackResponse(file.name, 0, notes.join(" | ") || "No extractable text found."),
        { headers: RESPONSE_HEADERS },
      );
    }

    const skills = extractSkills(workingText);
    const category = inferCategory(skills, workingText);
    const experience = extractExperienceFromText(workingText);
    const portfolio = extractPortfolioFromText(workingText, skills);
    const name = extractName(workingText, file.name);
    const bio = extractBio(workingText);

    const response: ResumeParseResponse = {
      name,
      bio,
      skills,
      category,
      experience,
      portfolio,
      provider: "fallback",
      fallback: true,
      error: notes.length > 0 ? `${notes.join(" | ")} | Source: ${parserSource}` : `Source: ${parserSource}`,
    };

    return NextResponse.json(response, { headers: RESPONSE_HEADERS });
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
