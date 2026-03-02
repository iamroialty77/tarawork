"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Coffee, 
  Moon,
  Wind
} from "lucide-react";

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: { id: string; title: string; completed: boolean }[];
}

export default function FocusMode({ isOpen, onClose, tasks }: FocusModeProps) {
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification
      if (!isBreak) {
        alert("Time for a 10-minute break!");
        setIsBreak(true);
        setTimeLeft(10 * 60);
      } else {
        alert("Break over! Ready to focus?");
        setIsBreak(false);
        setTimeLeft(50 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col items-center justify-center p-8"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-2xl w-full space-y-12 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4 text-indigo-400">
                {isBreak ? <Coffee className="w-5 h-5" /> : <Wind className="w-5 h-5" />}
                <span className="text-xs font-black uppercase tracking-[0.3em]">
                  {isBreak ? "Rest & Recovery" : "Deep Work Session"}
                </span>
              </div>
              <h1 className="text-8xl font-black tracking-tighter tabular-nums">
                {formatTime(timeLeft)}
              </h1>
            </motion.div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsActive(!isActive)}
                className="w-20 h-20 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button 
                onClick={() => { setIsActive(false); setTimeLeft(50 * 60); setIsBreak(false); }}
                className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-12 border-t border-white/10">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest">Priority Focus</h3>
              <div className="space-y-3">
                {tasks.filter(t => !t.completed).slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-colors" />
                    <span className="text-lg font-medium text-slate-200">{task.title}</span>
                  </div>
                ))}
                {tasks.filter(t => !t.completed).length === 0 && (
                  <div className="text-slate-500 font-medium py-4">No pending tasks for this session.</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 pt-12 text-slate-500">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Do Not Disturb Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Auto-Tracking Time</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
