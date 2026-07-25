"use client";

import { useState, useEffect, Suspense } from "react";
import Messaging from "../../components/Messaging";
import { Conversation, Message, UserProfile, Job } from "../../types";
import { ArrowLeft, LayoutDashboard, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

const normalizeMessagingRole = (role: unknown) => {
  if (typeof role !== "string") return "";
  const normalized = role.trim().toLowerCase();
  if (normalized === "employer" || normalized === "client" || normalized === "hirer") {
    return "employer";
  }
  if (normalized === "freelancer" || normalized === "talent" || normalized === "va") {
    return "freelancer";
  }
  return normalized;
};

function MessagesContent() {
  const searchParams = useSearchParams();
  const withUserId = searchParams.get('with');
  const isOfficialOutreach = searchParams.get('official') === '1';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [employerJobs, setemployerJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [restrictionError, setRestrictionError] = useState<string | null>(null);

  // 1. Fetch current user session
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setCurrentUser(profile);
          if (profile.role === 'employer') {
            const { data: jobs } = await supabase
              .from('jobs')
              .select('*')
              .eq('employer_id', session.user.id);
            if (jobs) setemployerJobs(jobs);
          }
        }
      }
    }
    getUser();
  }, []);

  // 2. Fetch conversations
  const fetchConversations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant_1_profile:profiles!participant_1(*),
          participant_2_profile:profiles!participant_2(*)
        `)
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedConversations: Conversation[] = await Promise.all((data || []).map(async (conv) => {
        const otherParticipant = conv.participant_1 === userId 
          ? conv.participant_2_profile 
          : conv.participant_1_profile;

        // Fetch last message
        const { data: lastMsg } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...conv,
          other_participant: otherParticipant,
          last_message: lastMsg || undefined
        };
      }));

      setConversations(formattedConversations);

      // 3. Handle 'with' parameter if provided
      if (withUserId && withUserId !== userId) {
        // Check if conversation already exists
        const existingConv = formattedConversations.find(c =>
          c.participant_1 === withUserId || c.participant_2 === withUserId
        );

        if (existingConv) {
          setSelectedId(existingConv.id);
        } else {
          // CHECK RESTRICTION: Mutual follow for hirer -> VA outreach
          const { data: targetProfile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', withUserId)
            .maybeSingle();

          const [{ data: follow1 }, { data: follow2 }] = await Promise.all([
            supabase
              .from('follows')
              .select('follower_id')
              .eq('follower_id', userId)
              .eq('following_id', withUserId)
              .maybeSingle(),
            supabase
              .from('follows')
              .select('follower_id')
              .eq('follower_id', withUserId)
              .eq('following_id', userId)
              .maybeSingle(),
          ]);
          
          const isMutualFollow = Boolean(follow1 && follow2);
          const currentRole = normalizeMessagingRole(currentUser?.role);
          const targetRole = normalizeMessagingRole(targetProfile?.role);

          const isEmployerToFreelancer =
            currentRole === 'employer' &&
            targetRole === 'freelancer';

          const isFreelancerToEmployer =
            currentRole === 'freelancer' &&
            targetRole === 'employer';

          let hasHiringRelationship = false;
          if (isEmployerToFreelancer || isFreelancerToEmployer) {
            const freelancerId = isEmployerToFreelancer ? withUserId : userId;
            const employerId = isEmployerToFreelancer ? userId : withUserId;
            const { data: application } = await supabase
              .from('applications')
              .select('job_id, jobs!inner(employer_id)')
              .eq('freelancer_id', freelancerId)
              .eq('jobs.employer_id', employerId)
              .limit(1)
              .maybeSingle();

            hasHiringRelationship = Boolean(application);
          }

          // Employers may contact talent they follow. Applicants and their
          // employer may also communicate without requiring a mutual follow.
          const allowEmployerFollow = isEmployerToFreelancer && Boolean(follow1);
          const allowVerifiedOutreach =
            isOfficialOutreach &&
            hasHiringRelationship &&
            (isEmployerToFreelancer || isFreelancerToEmployer);

          if (!isMutualFollow && !allowEmployerFollow && !allowVerifiedOutreach) {
            setRestrictionError(
              isEmployerToFreelancer
                ? "Follow this freelancer first, or message them from an application to one of your jobs."
                : "You can only message users you mutually follow."
            );
            return;
          }

          // Create new conversation
          const p1 = userId < withUserId ? userId : withUserId;
          const p2 = userId < withUserId ? withUserId : userId;

          const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .upsert({ 
              participant_1: p1, 
              participant_2: p2,
              updated_at: new Date().toISOString()
            }, { onConflict: 'participant_1,participant_2' })
            .select()
            .single();

          if (!createError && newConv) {
            // Fetch the other participant's profile
            const { data: otherProf } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', withUserId)
              .single();

            const fullNewConv: Conversation = {
              ...newConv,
              other_participant: otherProf,
              last_message: undefined
            };

            setConversations(prev => [fullNewConv, ...prev]);
            setSelectedId(newConv.id);
          }
        }
      } else if (formattedConversations.length > 0 && !selectedId) {
        setSelectedId(formattedConversations[0].id);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = currentUser?.id;
    if (userId) {
      fetchConversations(userId);

      // Subscribe to global message changes to update conversation list
      const channel = supabase
        .channel('global-messages')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'messages' 
        }, () => {
          fetchConversations(userId);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser, withUserId]);

  // 4. Fetch messages when conversation selected
  useEffect(() => {
    if (selectedId) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', selectedId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          setMessages(data);
          
          // Mark as read
          if (currentUser?.id) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('conversation_id', selectedId)
              .neq('sender_id', currentUser.id);
          }
        }
      };

      fetchMessages();

      // Subscribe to real-time messages
      const channel = supabase
        .channel(`messages:${selectedId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${selectedId}`
        }, async payload => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            // Avoid duplicate messages if already added locally
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          
          // Automatically mark as read if the user is in an active conversation and is not the sender
          if (currentUser?.id && newMessage.sender_id !== currentUser.id) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedId, currentUser?.id]);

  const handleSend = async (
    convId: string, 
    content: string, 
    attachment?: { url: string; name: string; type: string },
    offer_data?: any
  ) => {
    if (!currentUser?.id) return;

    const newMessage: any = {
      conversation_id: convId,
      sender_id: currentUser.id,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if (attachment) {
      newMessage.attachment_url = attachment.url;
      newMessage.attachment_name = attachment.name;
      newMessage.attachment_type = attachment.type;
    }

    if (offer_data) {
      newMessage.offer_data = offer_data;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) throw error;

      // Local update for instant feedback
      setMessages(prev => {
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });

      // Update conversation timestamp in the database
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', convId);

      // Update the conversation list locally to move it to the top and update the last message
      setConversations(prev => {
        const otherConvs = prev.filter(c => c.id !== convId);
        const targetConv = prev.find(c => c.id === convId);
        if (targetConv) {
          const updatedConv = { ...targetConv, last_message: data, updated_at: new Date().toISOString() };
          return [updatedConv, ...otherConvs];
        }
        return prev;
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (restrictionError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Messaging Restricted</h2>
        <p className="text-slate-400 max-w-md mb-6">{restrictionError}</p>
        <Link href="/" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Inbox...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">Please make sure you are logged in to view your inbox.</p>
          <Link href="/auth" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
          <h1 className="text-2xl font-black text-slate-900 hidden md:block">Inbox</h1>
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </div>

        <Messaging
          conversations={conversations}
          currentUser={currentUser}
          messages={messages}
          selectedConversationId={selectedId}
          onSelectConversation={setSelectedId}
          onSendMessage={handleSend}
          employerJobs={employerJobs}
        />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Inbox...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
