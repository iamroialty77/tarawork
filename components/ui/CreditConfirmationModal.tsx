"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CreditConfirmationModalProps {
  isOpen: boolean;
  creditsRequired: number;
  remainingBalance: number | null;
  isBalanceLoading?: boolean;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CreditConfirmationModal({
  isOpen,
  creditsRequired,
  remainingBalance,
  isBalanceLoading = false,
  isConfirming = false,
  onCancel,
  onConfirm,
}: CreditConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-black text-slate-900">Confirm Credit Usage</h3>
            <p className="mt-3 text-sm font-medium text-slate-700">
              This will use {creditsRequired} energy credits. Your remaining balance:{" "}
              {isBalanceLoading ? "..." : remainingBalance ?? 0}. Continue?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isConfirming}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isConfirming || isBalanceLoading}
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
              >
                {isConfirming ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
