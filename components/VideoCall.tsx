"use client";

import { useState, useEffect, useCallback } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCallProps {
  roomUrl?: string;
  onLeave: () => void;
  projectId?: string;
}

export default function VideoCall({ roomUrl, onLeave, projectId }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      // Mock transcript for demonstration
      const mockTranscript = "Client: We need the homepage done by Friday. Seeker: I can do that, but I'll need the Figma assets. Client: Okay, I'll send them over today. Let's agree on ₱5,000 for this milestone.";
      
      const response = await fetch('/api/summarize-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: mockTranscript,
          projectId: projectId || 'mock-project-123',
          participants: ['Client', 'Freelancer']
        }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl aspect-video bg-slate-800 rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
        {/* Mock Video Grid */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          <div className="bg-slate-700 rounded-2xl relative flex items-center justify-center overflow-hidden">
            {isVideoOff ? (
              <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-slate-400">
                <VideoOff className="w-10 h-10" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse" />
            )}
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-widest">You (Freelancer)</div>
          </div>
          <div className="bg-slate-700 rounded-2xl relative flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-600 to-slate-800" />
             <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-10 h-10" />
             </div>
             <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-widest">Client (Hirer)</div>
          </div>
        </div>

        {/* AI Summary Sidebar (Overlay) */}
        <AnimatePresence>
          {summary && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-4 top-4 bottom-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 overflow-y-auto border border-white/20 z-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900">AI Call Summary</h4>
              </div>
              <div className="prose prose-sm text-slate-600 leading-relaxed font-medium">
                {summary}
              </div>
              <div className="mt-6 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Saved to Audit Logs</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button 
            onClick={handleSummarize}
            disabled={isSummarizing || summary !== null}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {isSummarizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI Summary
              </>
            )}
          </button>
          <button 
            onClick={onLeave}
            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg shadow-red-500/20"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <p className="mt-6 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
        <Shield className="w-3 h-3" />
        Encrypted P2P Connection • Powered by Daily.co
      </p>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
