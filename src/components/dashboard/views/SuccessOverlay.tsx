"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface SuccessOverlayProps {
  show: boolean;
  message?: string;
}

export function SuccessOverlay({ show, message = "Berhasil Disimpan!" }: SuccessOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-zinc-950/95 flex items-center justify-center gap-2.5 z-20 px-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.05
            }}
            className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5 shrink-0"
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-body-sm font-bold text-fg-strong"
          >
            {message}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
