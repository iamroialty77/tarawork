import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { transcript, projectId, participants } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const { text: summary } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Summarize the following interview transcript professionally. Focus on key decisions, budget agreements, and next steps:\n\n${transcript}`,
    });

    // Save to admin_audit_logs for dispute resolution
    const { error: logError } = await supabase
      .from('admin_audit_logs')
      .insert({
        action: 'INTERVIEW_SUMMARY_GENERATED',
        details: {
          summary,
          projectId,
          participants,
          timestamp: new Date().toISOString()
        }
      });

    if (logError) console.error('Error logging to audit logs:', logError);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error summarizing interview:', error);
    return NextResponse.json({ error: error.message || 'Failed to summarize' }, { status: 500 });
  }
}
