"use client";

import React from "react";
import { LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function Header({ userName, onLogout, isLoggingOut }: HeaderProps) {
  return (
    <header className="bg-zinc-900/50 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-brand" />
          <span className="text-title-lg font-bold tracking-tight text-brand">Kasbon.id</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-body-md text-fg-muted hidden sm:inline">
            Hai, <strong className="text-fg capitalize">{userName}</strong>!
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-fg-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
            loading={isLoggingOut}
            loadingText="Keluar..."
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
