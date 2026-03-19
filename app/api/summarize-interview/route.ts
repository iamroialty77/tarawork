import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';
import { consumePremiumCredits, getCreditCost } from '@/lib/credits';

const INTERVIEW_SUMMARY_COST = getCreditCost("interview_summary");

export async function POST(req: NextRequest) {
  try {
    const { transcript, projectId, participants, userId, confirmCreditUse } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId.' }, { status: 400 });
    }
    if (confirmCreditUse !== true) {
      return NextResponse.json(
        {
          error: "Credit confirmation is required before summarization.",
          errorCode: "confirmation_required",
          requiredCredits: INTERVIEW_SUMMARY_COST,
        },
        { status: 400 },
      );
    }

    const creditSpend = await consumePremiumCredits({
      userId,
      action: "interview_summary",
      metadata: { projectId: projectId || null },
    });

    if (!creditSpend.ok) {
      const statusCode =
        creditSpend.code === "not_premium"
          ? 403
          : creditSpend.code === "insufficient_credits"
            ? 402
            : 500;
      return NextResponse.json(
        {
          error: creditSpend.message,
          errorCode: creditSpend.code,
          requiredCredits: creditSpend.cost,
          remainingCredits: creditSpend.balance ?? 0,
        },
        { status: statusCode },
      );
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

    return NextResponse.json({
      summary,
      credits: { spent: creditSpend.cost, remaining: creditSpend.balance },
    });
  } catch (error: unknown) {
    console.error('Error summarizing interview:', error);
    const message = error instanceof Error ? error.message : 'Failed to summarize';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
