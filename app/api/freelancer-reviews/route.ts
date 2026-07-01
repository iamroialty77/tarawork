import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { getAuthenticatedUser } from "@/lib/supabase_server";

type ReviewBody = {
  freelancerId?: string;
  invitationId?: string;
  rating?: number;
  comment?: string;
  projectTitle?: string;
};

const isCompletedInvitation = (invitation: Record<string, unknown>) =>
  invitation.work_status === "completed" || Boolean(invitation.completed_at);

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = (await req.json()) as ReviewBody;
    const freelancerId = (body.freelancerId || "").trim();
    const invitationId = (body.invitationId || "").trim();
    const rating = Number(body.rating);
    const comment = (body.comment || "").trim();
    const projectTitle = (body.projectTitle || "").trim() || "Completed TaraWork engagement";

    if (!freelancerId || !invitationId) {
      return NextResponse.json({ error: "Missing freelancer or invitation id." }, { status: 400 });
    }
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }
    if (comment.length < 10) {
      return NextResponse.json({ error: "Please add a short professional comment." }, { status: 400 });
    }

    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from("talent_invitations")
      .select("id, employer_id, freelancer_id, status, work_status, completed_at")
      .eq("id", invitationId)
      .maybeSingle();

    if (invitationError) throw invitationError;
    if (!invitation) return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    if (invitation.employer_id !== user.id || invitation.freelancer_id !== freelancerId) {
      return NextResponse.json({ error: "Only the employer for this completed engagement can leave feedback." }, { status: 403 });
    }
    if (invitation.status !== "accepted") {
      return NextResponse.json({ error: "The freelancer must accept the invitation before feedback is allowed." }, { status: 403 });
    }
    if (!isCompletedInvitation(invitation)) {
      return NextResponse.json({ error: "Mark the accepted engagement as completed before leaving feedback." }, { status: 403 });
    }

    const [{ data: employer }, { data: freelancer, error: freelancerError }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, name, companyName")
        .eq("id", user.id)
        .maybeSingle(),
      supabaseAdmin
        .from("profiles")
        .select("id, aiInsights")
        .eq("id", freelancerId)
        .maybeSingle(),
    ]);

    if (freelancerError) throw freelancerError;
    if (!freelancer) return NextResponse.json({ error: "Freelancer profile not found." }, { status: 404 });

    const aiInsights =
      freelancer.aiInsights && typeof freelancer.aiInsights === "object"
        ? (freelancer.aiInsights as Record<string, unknown>)
        : {};
    const clientReviews = Array.isArray(aiInsights.clientReviews) ? aiInsights.clientReviews : [];
    const alreadyReviewed = clientReviews.some((review: any) => {
      return review?.invitationId === invitationId || review?.employerId === user.id;
    });

    if (alreadyReviewed) {
      return NextResponse.json({ error: "Feedback was already submitted for this engagement." }, { status: 409 });
    }

    const review = {
      id: `review-${invitationId}`,
      invitationId,
      employerId: user.id,
      clientName: employer?.companyName?.trim() || employer?.name?.trim() || "TaraWork Employer",
      projectTitle,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    };

    const nextAiInsights = {
      ...aiInsights,
      clientReviews: [review, ...clientReviews],
    };

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ aiInsights: nextAiInsights })
      .eq("id", freelancerId);

    if (updateError) throw updateError;

    await supabaseAdmin.from("notifications").insert([
      {
        user_id: freelancerId,
        title: "New Client Feedback",
        message: "An employer left feedback for a completed engagement.",
        type: "success",
        link: "/",
      },
    ]);

    return NextResponse.json({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit freelancer feedback.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
