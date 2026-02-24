"use client";

import { useState, useEffect } from "react";
import Messaging from "../../components/Messaging";
import { Conversation, Message, UserProfile } from "../../types";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Mock initial data
  useEffect(() => {
    // In a real app, fetch from Supabase
    const mockUser: UserProfile = {
      id: "user-1",
      name: "Juan Dela Cruz",
      role: "hirer",
      category: "Developer",
      skills: ["React", "Next.js"],
      hourlyRate: "$50",
      bio: "Looking for great talent."
    };
    setCurrentUser(mockUser);

    const mockConversations: Conversation[] = [
      {
        id: "conv-1",
        participant_1: "user-1",
        participant_2: "user-2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        other_participant: {
          id: "user-2",
          name: "Maria Santos",
          role: "jobseeker",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
          category: "Designer",
          skills: ["Figma", "UI/UX"],
          hourlyRate: "$40",
          bio: "Creative UI Designer"
        },
        last_message: {
          id: "msg-1",
          conversation_id: "conv-1",
          sender_id: "user-2",
          content: "Kumusta! Handa na ba yung details ng project?",
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        }
      },
      {
        id: "conv-2",
        participant_1: "user-1",
        participant_2: "user-3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        other_participant: {
          id: "user-3",
          name: "Pedro Penduko",
          role: "jobseeker",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
          category: "Developer",
          skills: ["React", "Node.js"],
          hourlyRate: "$45",
          bio: "Fullstack Web Developer"
        },
        last_message: {
          id: "msg-2",
          conversation_id: "conv-2",
          sender_id: "user-1",
          content: "Sige, check ko muna.",
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
      }
    ];
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    if (selectedId) {
      // Fetch messages for selected conversation
      const mockMessages: Message[] = [
        {
          id: "m1",
          conversation_id: selectedId,
          sender_id: "user-2",
          content: "Magandang araw! Nakita ko yung job posting niyo.",
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString()
        },
        {
          id: "m2",
          conversation_id: selectedId,
          sender_id: "user-1",
          content: "Salamat sa pag message! May portfolio ka ba?",
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
        },
        {
          id: "m3",
          conversation_id: selectedId,
          sender_id: "user-2",
          content: "Kumusta! Handa na ba yung details ng project?",
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedId]);

  const handleSend = (convId: string, content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      conversation_id: convId,
      sender_id: currentUser?.id || "",
      content,
      is_read: false,
      created_at: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
    
    // Update last message in conversation list
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, last_message: newMessage } : c
    ));
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Balik sa Marketplace
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
        />
      </div>
    </div>
  );
}
