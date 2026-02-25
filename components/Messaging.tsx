"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, Message, UserProfile } from "../types";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Check, 
  CheckCheck, 
  User as UserIcon, 
  ArrowLeft,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Briefcase,
  Download,
  ExternalLink,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../lib/supabase";
import { Job } from "../types";

interface MessagingProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  onSendMessage: (
    conversationId: string, 
    content: string, 
    attachment?: { url: string; name: string; type: string },
    offer_data?: any
  ) => void;
  onSelectConversation: (id: string) => void;
  selectedConversationId?: string;
  messages: Message[];
  hirerJobs?: Job[];
}

export default function Messaging({
  conversations,
  currentUser,
  onSendMessage,
  onSelectConversation,
  selectedConversationId,
  messages,
  hirerJobs = []
}: MessagingProps) {
  const [messageInput, setMessageInput] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedConversationId]);

  const handleSend = async () => {
    if ((messageInput.trim() || selectedFile) && selectedConversationId) {
      let attachment;

      if (selectedFile) {
        setIsUploading(true);
        try {
          // Create a unique file name to avoid collisions
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${currentUser.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);

          if (!data?.publicUrl) throw new Error("Could not get public URL");

          attachment = {
            url: data.publicUrl,
            name: selectedFile.name,
            type: selectedFile.type
          };
        } catch (error: any) {
          alert("Error uploading file: " + error.message);
          setIsUploading(false);
          return;
        }
      }

      onSendMessage(selectedConversationId, messageInput.trim(), attachment);
      setMessageInput("");
      setSelectedFile(null);
      setIsUploading(false);
    }
  };

  const handleAttachOffer = (job: Job) => {
    if (selectedConversationId) {
      onSendMessage(
        selectedConversationId, 
        `I'd like to offer you a project: ${job.title}`, 
        undefined, 
        job
      );
      setShowOfferModal(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit.");
        return;
      }
      setSelectedFile(file);
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
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Active Now</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {selectedConversation.other_participant?.role === 'hirer' ? 'Client' : 'Freelancer'}
                    </p>
                  </div>
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
                      {msg.offer_data && (
                        <div className={`mb-3 p-3 rounded-xl border ${isMe ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className={`w-4 h-4 ${isMe ? "text-indigo-200" : "text-indigo-600"}`} />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Project Offer</span>
                          </div>
                          <h5 className="font-bold mb-1">{msg.offer_data.title}</h5>
                          <p className={`text-[11px] line-clamp-2 mb-3 ${isMe ? "text-indigo-100" : "text-slate-500"}`}>
                            {msg.offer_data.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-xs">{msg.offer_data.rate}</span>
                            <button className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              isMe ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}>
                              View Details
                            </button>
                          </div>
                        </div>
                      )}

                      {msg.attachment_url && (
                        <div className={`mb-2 p-2 rounded-xl border ${isMe ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"}`}>
                          {msg.attachment_type?.startsWith('image/') ? (
                            <img 
                              src={msg.attachment_url} 
                              alt={msg.attachment_name} 
                              className="max-w-full rounded-lg h-auto max-h-48 object-cover cursor-pointer"
                              onClick={() => window.open(msg.attachment_url, '_blank')}
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isMe ? "bg-white/20" : "bg-white border border-slate-200"}`}>
                                <FileText className="w-5 h-5 text-indigo-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold truncate">{msg.attachment_name}</p>
                                <p className="text-[9px] opacity-60">PDF/Document</p>
                              </div>
                              <button 
                                onClick={() => window.open(msg.attachment_url, '_blank')}
                                className={`p-1.5 rounded-lg transition-all ${isMe ? "hover:bg-white/20" : "hover:bg-slate-100"}`}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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
              {/* Quick Reply Suggestions */}
              {!selectedFile && !messageInput && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                  {[
                    "Hello! Available po ba kayo?",
                    "Kailan po ang deadline nito?",
                    "Maaari ko po bang makita ang details?",
                    "Interesado po ako sa project na ito.",
                    "Salamat po!"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setMessageInput(suggestion)}
                      className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {selectedFile && (
                <div className="mb-3 p-2 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                      {selectedFile.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-indigo-500" /> : <FileText className="w-4 h-4 text-indigo-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={onFileChange}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                {currentUser.role === 'hirer' && (
                  <button 
                    onClick={() => setShowOfferModal(true)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    title="Send Project Offer"
                  >
                    <Briefcase className="w-5 h-5" />
                  </button>
                )}

                <input
                  type="text"
                  placeholder="Sumulat ng mensahe..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !isUploading && handleSend()}
                  className="flex-1 bg-slate-100 border-none rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900"
                />
                <button
                  onClick={handleSend}
                  disabled={(!messageInput.trim() && !selectedFile) || isUploading}
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center min-w-[40px]"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Offer Modal */}
            {showOfferModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900">Select Job to Offer</h3>
                    <button onClick={() => setShowOfferModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                    {hirerJobs.length > 0 ? (
                      hirerJobs.map((job) => (
                        <button 
                          key={job.id}
                          onClick={() => handleAttachOffer(job)}
                          className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                        >
                          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>{job.category}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-emerald-600">{job.rate}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-slate-500">Wala ka pang aktibong job postings.</p>
                        <button 
                          onClick={() => { window.location.href = '/'; }}
                          className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
                        >
                          Mag-post ng Trabaho
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
