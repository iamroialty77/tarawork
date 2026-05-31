import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Fallback for demo purposes if API key is not set
const DEFAULT_OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const apiKey = process.env.OPENAI_API_KEY || DEFAULT_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(req: Request) {
  try {
    const { type, content, skills, role, details, title, technologies } = await req.json();

    if (!apiKey || apiKey === DEFAULT_OPENAI_API_KEY) {
      // Mock response for testing/demo when no API key is present
      if (type === 'aboutMe') {
        return NextResponse.json({ 
          text: `Professional ${role} with expertise in ${skills?.join(', ') || 'modern technologies'}. I focus on creating minimalist and efficient solutions that drive business value.`,
        });
      }
      return NextResponse.json({ 
        text: `Developed a robust solution for ${title || 'the project'} using ${technologies?.join(', ') || 'cutting-edge tech'}. Improved performance and user experience.`,
      });
    }

    let prompt = '';
    if (type === 'aboutMe') {
      prompt = `Generate a professional, minimalist 'About Me' section for a freelancer portfolio.
        Role: ${role}
        Skills: ${skills?.join(', ')}
        Key background: ${content || details}
        Tone: Professional, modern, minimalist (Korean-inspired aesthetic - clean and punchy). 
        Focus on: Solving client problems and delivering quality.
        Keep it under 3-4 sentences.`;
    } else {
      prompt = `Generate a professional, concise project description for a freelancer portfolio.
        Project Title: ${title || content}
        Technologies used: ${technologies?.join(', ')}
        Key features/tasks: ${details}
        Tone: Minimalist, achievement-oriented.
        Keep it under 2-3 sentences.`;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional portfolio writer with a minimalist, clean aesthetic.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
    });

    const generatedText = response.choices[0].message.content;

    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
