"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function AutomationToast({
  message,
  type = "success",
  onDismiss,
  duration = 5000,
}: {
  message: string;
  type?: "success" | "error";
  onDismiss: () => void;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [draining, setDraining] = useState(false);

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => {
      setVisible(true);
      requestAnimationFrame(() => setDraining(true));
    });
    const fadeTimer = window.setTimeout(() => setVisible(false), Math.max(0, duration - 400));
    const dismissTimer = window.setTimeout(onDismiss, duration);
    return () => {
      cancelAnimationFrame(enterFrame);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [duration, message, onDismiss, type]);

  const error = type === "error";
  return <div
    role={error ? "alert" : "status"}
    aria-live={error ? "assertive" : "polite"}
    className={`fixed right-4 top-4 z-[200] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all duration-300 sm:right-6 sm:top-6 ${
      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
    } ${error ? "border-rose-200" : "border-emerald-200"}`}
  >
    <div className="flex items-start gap-3 p-4">
      <div className={`mt-0.5 rounded-xl p-2 ${error ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
        {error ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">{error ? "Action failed" : "Success"}</p>
        <p className="mt-1 text-sm font-bold leading-5 text-slate-800">{message}</p>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className={`h-1 ${error ? "bg-rose-100" : "bg-emerald-100"}`}>
      <div
        className={`h-full transition-[width] ease-linear ${error ? "bg-rose-500" : "bg-emerald-500"} ${draining ? "w-0" : "w-full"}`}
        style={{ transitionDuration: `${Math.max(0, duration - 300)}ms` }}
      />
    </div>
  </div>;
}
