import { NextResponse } from 'next/server';
import { financialService } from '../../../../lib/services/financialService';

/**
 * Event-Driven Hook: GitHub Webhook Handler
 * This route listens for merge events to automate payment release.
 * In production, use a Message Queue (RabbitMQ/Redis) to process heavy loads.
 */

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // 1. Identify Event Type
    const isMergeEvent = payload.action === 'closed' && payload.pull_request?.merged;
    
    if (isMergeEvent) {
      const milestoneId = payload.pull_request.head.ref; // Assume branch name is milestone ID
      console.log(`[Webhook] Merge detected for milestone: ${milestoneId}`);
      
      // 2. Trigger Payment Release via Financial Service
      const success = await financialService.releaseEscrow(milestoneId);
      
      return NextResponse.json({ 
        message: 'Milestone payment released automatically',
        milestoneId,
        status: success ? 'success' : 'failed' 
      });
    }

    return NextResponse.json({ message: 'Event ignored' });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
