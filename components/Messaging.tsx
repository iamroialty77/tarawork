"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, Message, UserProfile } from "../types";
import { Send, Search, MoreVertical, Phone, Video, Check, CheckCheck, User as UserIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface MessagingProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  onSendMessage: (conversationId: string, content: string) => void;
  onSelectConversation: (id: string) => void;
  selectedConversationId?: string;
  messages: Message[];
}

export default function Messaging({
  conversations,
  currentUser,
  onSendMessage,
  onSelectConversation,
  selectedConversationId,
  messages
}: MessagingProps) {
  const [messageInput, setMessageInput] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedConversationId]);

  const handleSend = () => {
    if (messageInput.trim() && selectedConversationId) {
      onSendMessage(selectedConversationId, messageInput.trim());
      setMessageInput("");
    }
  };

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    setShowMobileList(false);
  };

  return (
    <div className="flex h-[600px] bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50">
      {/* Sidebar - Conversation List */}
      <div className={`${showMobileList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-slate-100`}>
        <div className="p-5 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelect(conv.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                selectedConversationId === conv.id 
                  ? "bg-indigo-50" 
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                  {conv.other_participant?.avatar_url ? (
                    <img src={conv.other_participant.avatar_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <UserIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-slate-900 truncate text-sm">
                    {conv.other_participant?.name || "Unknown User"}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    {conv.last_message ? format(new Date(conv.last_message.created_at), 'h:mm a') : ""}
                  </span>
                </div>
                <p className={`text-xs truncate ${conv.last_message?.is_read === false && conv.last_message.sender_id !== currentUser.id ? "font-black text-indigo-600" : "text-slate-500"}`}>
                  {conv.last_message?.sender_id === currentUser.id ? "Ikaw: " : ""}
                  {conv.last_message?.content || "No messages yet"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${!showMobileList ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-slate-50/50`}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 -ml-2 text-slate-500">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  {selectedConversation.other_participant?.avatar_url ? (
                    <img src={selectedConversation.other_participant.avatar_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    {selectedConversation.other_participant?.name}
                  </h3>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Active Now</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Video className="w-5 h-5" /></button>
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-lg flex items-center justify-center mb-3">
                   <UserIcon className="w-8 h-8 text-slate-200" />
                </div>
                <h4 className="font-bold text-slate-900">{selectedConversation.other_participant?.name}</h4>
                <p className="text-xs text-slate-500 mt-1">You're connected on Tara Marketplace</p>
              </div>

              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMe 
                        ? "bg-indigo-600 text-white rounded-br-none" 
                        : "bg-white text-slate-900 rounded-bl-none shadow-sm border border-slate-100"
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className={`text-[9px] ${isMe ? "text-indigo-200" : "text-slate-400"}`}>
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </span>
                        {isMe && (
                          msg.is_read ? <CheckCheck className="w-3 h-3 text-indigo-200" /> : <Check className="w-3 h-3 text-indigo-200" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Aa"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-slate-100 border-none rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900"
                />
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim()}
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Send className="w-10 h-10 text-indigo-200 -rotate-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your Messages</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              Select a conversation to start chatting with your client or freelancer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
