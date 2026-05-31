"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { CircleHelp } from "lucide-react";

interface TooltipActionProps {
  text?: string;
  tooltip?: string;
  label?: string;
  children?: ReactNode;
  delayMs?: number;
  block?: boolean;
}

const TAP_TOOLTIP_MS = 1600;

const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0
  );
};

export default function TooltipAction({
  text,
  tooltip,
  label,
  children,
  delayMs = 300,
  block = false,
}: TooltipActionProps) {
  const tooltipText = text || tooltip || "";
  const ariaLabel = label || "More information";
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    showTimerRef.current = null;
    hideTimerRef.current = null;
  };

  const showWithDelay = () => {
    clearTimers();
    showTimerRef.current = setTimeout(() => setVisible(true), delayMs);
  };

  const showOnTap = () => {
    clearTimers();
    setVisible(true);
    hideTimerRef.current = setTimeout(() => setVisible(false), TAP_TOOLTIP_MS);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return (
    <span
      className={block ? "relative flex w-full" : "relative inline-flex max-w-full"}
      onMouseEnter={() => {
        if (isTouchDevice()) return;
        showWithDelay();
      }}
      onMouseLeave={() => {
        clearTimers();
        setVisible(false);
      }}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onTouchStart={() => {
        if (!isTouchDevice()) return;
        showOnTap();
      }}
    >
      {children || (
        <button
          type="button"
          aria-label={ariaLabel}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-700"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
      )}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg"
        >
          {tooltipText}
        </span>
      )}
    </span>
  );
}
