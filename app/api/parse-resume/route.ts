import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
// PDFParse is imported dynamically inside POST handler

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log('AI Resume Parser: Request received');
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Siguraduhin na ang Content-Type ay tama para sa formData
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type. Expected multipart/form-data.' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('AI Resume Parser: No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers });
    }

    // New: Check for PDF MIME type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      console.error('AI Resume Parser: Invalid file type:', file.type);
      return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 400, headers });
    }

    // New: Check for file size (5MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error('AI Resume Parser: File too large:', file.size);
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400, headers });
    }

    console.log(`AI Resume Parser: Processing ${file.name} (${file.size} bytes)`);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    console.log('AI Resume Parser: Extracting text from PDF...');
    let text = '';
    try {
      // Polyfill necessary for pdfjs-dist in Node.js environment
      // We use lightweight shims instead of @napi-rs/canvas to avoid native binding build errors in Turbopack
      console.log('AI Resume Parser: Injecting lightweight polyfills...');
      if (!(globalThis as any).DOMMatrix) {
        (globalThis as any).DOMMatrix = class DOMMatrix {
          matrix: any;
          constructor(init: any) { this.matrix = init; }
          static fromFloat32Array(array: any) { return new DOMMatrix(array); }
          static fromFloat64Array(array: any) { return new DOMMatrix(array); }
        };
      }
      if (!(globalThis as any).Path2D) {
        (globalThis as any).Path2D = class Path2D {
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
      if (!(globalThis as any).DOMPoint) {
        (globalThis as any).DOMPoint = class DOMPoint {
          x: number; y: number; z: number; w: number;
          constructor(x = 0, y = 0, z = 0, w = 1) {
            this.x = x; this.y = y; this.z = z; this.w = w;
          }
          static fromPoint(other: any) { return new DOMPoint(other.x, other.y, other.z, other.w); }
        };
      }
      if (!(globalThis as any).DOMRect) {
        (globalThis as any).DOMRect = class DOMRect {
          x: number; y: number; width: number; height: number;
          top: number; right: number; bottom: number; left: number;
          constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = x; this.y = y; this.width = width; this.height = height;
            this.top = y; this.left = x; this.right = x + width; this.bottom = y + height;
          }
          static fromRect(other: any) { return new DOMRect(other.x, other.y, other.width, other.height); }
        };
      }

      // Dynamic import para maiwasan ang top-level initialization errors sa ilang environments
      const { PDFParse } = await import('pdf-parse');
      
      // I-wrap sa Promise para siguradong asynchronous execution
      const parser = new PDFParse({ 
        data: buffer,
        verbosity: 0 // Iwasan ang masyadong maraming logs mula sa pdfjs
      });
      
      const data = await parser.getText();
      text = data.text;
    } catch (parseError: any) {
      console.error('AI Resume Parser: PDF Parse Error:', parseError);
      return NextResponse.json({ error: `Failed to read PDF file: ${parseError.message}` }, { status: 400, headers });
    }

    if (!text || text.trim().length === 0) {
      console.error('AI Resume Parser: No text extracted');
      return NextResponse.json({ 
        error: 'Could not extract text from PDF. Please ensure the PDF is not just a scanned image or try a different file.' 
      }, { status: 400, headers });
    }

    console.log(`AI Resume Parser: Extracted ${text.length} characters. Calling AI...`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('AI Resume Parser: OPENAI_API_KEY is missing');
      // Return a basic extraction if OpenAI is not available
      return NextResponse.json({
        name: file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
        bio: `Successfully extracted text (${text.length} chars) but AI parsing is currently unavailable. Manual profile completion required.`,
        skills: [],
        category: 'Developer'
      }, { headers });
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        skills: z.array(z.string()).optional(),
        experience: z.array(z.object({
          company: z.string(),
          role: z.string(),
          duration: z.string(),
          description: z.string(),
        })).optional(),
        category: z.enum(['Developer', 'Designer', 'Writer', 'Virtual Assistant', 'Marketing Specialist']).optional(),
      }),
      prompt: `Extract professional information from the following resume text:\n\n${text}\n\nPlease provide a concise bio, a list of technical and soft skills, and a summary of work experience. Also categorize the person into one of the following: Developer, Designer, Writer, Virtual Assistant, Marketing Specialist.`,
    });

    console.log('AI Resume Parser: Successfully parsed');
    return NextResponse.json(object, { headers });
  } catch (error: any) {
    console.error('AI Resume Parser: Unhandled Error:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred during resume parsing'
    }, { status: 500, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }});
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({ message: 'AI Resume Parser API is online. Use POST to parse a resume file.' });
}
