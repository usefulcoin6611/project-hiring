"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: BottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // let browser paint komponen dulu sebelum animasi jalan
      const frame = requestAnimationFrame(() => {
        setAnimate(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // samain ama durasi tailwind (300ms)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // lock scroll pas sheet lagi kebuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      {/* backdrop latar belakang */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out",
          animate ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* sheet panel */}
      <div
        className={cn(
          "relative w-full max-h-[90vh] bg-zinc-900 text-fg-strong rounded-t-3xl border-t border-zinc-800/85 p-6 pb-4 flex flex-col transition-transform duration-300 ease-out transform translate-3d",
          animate ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.6)",
          willChange: "transform",
        }}
      >
        {/* iOS drag handle */}
        <div 
          className="mx-auto w-12 h-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition mb-5 shrink-0" 
          onClick={onClose} 
        />

        {/* header */}
        <div className="flex justify-between items-start mb-4 shrink-0">
          <div className="pr-4">
            <h2 className="text-xl font-bold tracking-tight text-fg-strong leading-tight">{title}</h2>
            {description && (
              <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        {/* content wrapper */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          {/* content container (scrollable) */}
          <div className="flex-1 overflow-y-auto pr-0.5 pb-8">
            {children}
          </div>

          {/* premium fade overlay */}
          {footer && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-10" />
          )}
        </div>

        {/* footer container */}
        {footer && (
          <div className="mt-1 pt-2.5 border-t border-zinc-800/80 shrink-0 bg-zinc-900 relative z-20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
