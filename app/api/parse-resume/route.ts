import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { PDFParse } from 'pdf-parse';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  console.log('AI Resume Parser: Request received');
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('AI Resume Parser: No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log(`AI Resume Parser: Processing ${file.name} (${file.size} bytes)`);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    console.log('AI Resume Parser: Extracting text from PDF...');
    let text = '';
    try {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      text = data.text;
    } catch (parseError: any) {
      console.error('AI Resume Parser: PDF Parse Error:', parseError);
      return NextResponse.json({ error: `Failed to read PDF file: ${parseError.message}` }, { status: 400 });
    }

    if (!text || text.trim().length === 0) {
      console.error('AI Resume Parser: No text extracted');
      return NextResponse.json({ error: 'Could not extract text from PDF. Please ensure it is not a scanned image.' }, { status: 400 });
    }

    console.log(`AI Resume Parser: Extracted ${text.length} characters. Calling AI...`);
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
    return NextResponse.json(object);
  } catch (error: any) {
    console.error('AI Resume Parser: Unhandled Error:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred during resume parsing'
    }, { status: 500 });
  }
}
