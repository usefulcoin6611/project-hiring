"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BottomSheet } from "@/components/ui/bottom-sheet";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "default" | "sm" | "md";
}

export function ResponsiveModal({
  isOpen,
  onClose,
  isMobile,
  title,
  description,
  children,
  footer,
  size = "default",
}: ResponsiveModalProps) {
  if (isMobile) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={title ? String(title) : ""}
        description={description ? String(description) : ""}
        footer={footer}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size={size} className="sm:pb-5">
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle size="lg">{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
        {footer && <DialogFooter className="sm:mt-0 sm:pt-2">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
