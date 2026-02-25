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

    console.log(`AI Resume Parser: Processing ${file.name} (${file.size} bytes)`);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    console.log('AI Resume Parser: Extracting text from PDF...');
    let text = '';
    try {
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
      return NextResponse.json({ error: 'Could not extract text from PDF. Please ensure it is not a scanned image.' }, { status: 400, headers });
    }

    console.log(`AI Resume Parser: Extracted ${text.length} characters. Calling AI...`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('AI Resume Parser: OPENAI_API_KEY is missing');
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
