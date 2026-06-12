"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "auth" | "page";
}

export function Container({ children, className, variant = "default", ...props }: ContainerProps) {
  if (variant === "page") {
    return (
      <div
        className={cn(
          "min-h-screen pb-12 relative overflow-hidden bg-[#020202] text-fg-strong",
          className
        )}
        {...props}
      >
        {/* glow blobs di berbagai corner - dramatic rich mesh gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand/12 blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-[20%] right-[-20%] w-[55vw] h-[55vw] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-rose-500/8 blur-[140px] pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand/8 blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div
        className={cn(
          "min-h-screen relative overflow-hidden bg-[#020202] text-fg-strong flex items-center justify-center px-4",
          className
        )}
        {...props}
      >
        {/* glow blobs buat auth pages */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand/12 blur-[90px] pointer-events-none z-0 md:hidden" />
        <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-brand/10 blur-[110px] pointer-events-none z-0" />
        <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-brand/8 blur-[110px] pointer-events-none z-0" />
        <div className="hidden md:block absolute top-[35%] right-[-15%] w-[35%] h-[35%] rounded-full bg-brand/4 blur-[90px] pointer-events-none z-0" />

        <div className="relative z-10 w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  // default container utama
  return (
    <main
      className={cn(
        "max-w-6xl mx-auto px-4 mt-4 sm:mt-6 space-y-2 sm:space-y-4 pb-36 md:pb-12",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
