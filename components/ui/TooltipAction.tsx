"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface TooltipActionProps {
  text: string;
  children: ReactNode;
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
  children,
  delayMs = 300,
  block = false,
}: TooltipActionProps) {
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
      {children}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}
