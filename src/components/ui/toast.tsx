"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md shadow-2xl"
      >
        <div className="flex items-center gap-2.5">
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          )}
          <span className="text-body-sm font-medium text-fg-strong">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-fg-faint hover:text-fg-strong transition-colors p-0.5 rounded-lg hover:bg-zinc-800 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </div>
  );
}
