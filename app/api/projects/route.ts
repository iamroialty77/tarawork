import { NextResponse } from 'next/server';

// Placeholder for Phase 2 API integration
// This will eventually connect to a database and project payment system
export async function GET() {
  return NextResponse.json({
    message: "Project Management & Time Tracking API Placeholder",
    status: "ready_for_phase_2",
    features: [
      "Project Payment Integration",
      "Time Logging",
      "Milestone Tracking"
    ]
  });
}

export async function POST() {
  return NextResponse.json({
    error: "Project mutations are not implemented.",
  }, {
    status: 501,
    headers: { "Cache-Control": "no-store" },
  });
}
