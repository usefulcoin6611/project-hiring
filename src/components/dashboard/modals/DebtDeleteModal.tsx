"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { Debt } from "@/types/debt";

interface DebtDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  deletingDebt: Debt | null;
  deleteLoading: boolean;
  onDelete: () => void;
}

export function DebtDeleteModal({
  isOpen,
  onClose,
  isMobile,
  deletingDebt,
  deleteLoading,
  onDelete,
}: DebtDeleteModalProps) {
  const amountFormatted = deletingDebt ? formatRupiah(deletingDebt.amount) : "";
  const description = `Apakah kamu yakin mau menghapus catatan kasbon milik ${deletingDebt?.counterpart_name || ""} sebesar ${amountFormatted}? Tindakan ini tidak bisa dibatalkan.`;

  const footerActions = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={deleteLoading}
      >
        Batal
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={onDelete}
        loading={deleteLoading}
        loadingText="Menghapus..."
      >
        Ya, Hapus
      </Button>
    </>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      title={isMobile ? "Hapus Catatan?" : (
        <span className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <span>Hapus Catatan?</span>
        </span>
      )}
      description={isMobile ? description : undefined}
      footer={isMobile ? null : footerActions}
      size="sm"
    >
      {isMobile ? (
        <div className="pt-2 flex flex-col gap-3">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="w-full h-11"
            loading={deleteLoading}
            loadingText="Menghapus..."
          >
            Ya, Hapus
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full h-11"
            disabled={deleteLoading}
          >
            Batal
          </Button>
        </div>
      ) : (
        <span className="text-fg-muted text-body-md block">
          Apakah kamu yakin mau menghapus catatan kasbon milik{" "}
          <strong className="text-fg capitalize">
            {deletingDebt?.counterpart_name}
          </strong>{" "}
          sebesar <strong className="text-fg">{amountFormatted}</strong>? Tindakan ini tidak bisa dibatalkan.
        </span>
      )}
    </ResponsiveModal>
  );
}
