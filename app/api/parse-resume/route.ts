import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
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

    return NextResponse.json(object);
  } catch (error: any) {
    console.error('Error parsing resume:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse resume' }, { status: 500 });
  }
}
