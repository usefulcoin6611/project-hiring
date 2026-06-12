"use client";

import React from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { DebtFormContent } from "./DebtFormContent";
import { Debt } from "@/types/debt";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DebtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  editingDebt: Debt | null;
  formError: string;
  formType: "owed_to_me" | "i_owe";
  setFormType: (type: "owed_to_me" | "i_owe") => void;
  formName: string;
  setFormName: (val: string) => void;
  formAmount: string;
  setFormAmount: (val: string) => void;
  formDueDate: string;
  setFormDueDate: (val: string) => void;
  formNote: string;
  setFormNote: (val: string) => void;
  formLoading: boolean;
  formSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function DebtFormModal({
  isOpen,
  onClose,
  isMobile,
  editingDebt,
  formError,
  formType,
  setFormType,
  formName,
  setFormName,
  formAmount,
  setFormAmount,
  formDueDate,
  setFormDueDate,
  formNote,
  setFormNote,
  formLoading,
  formSuccess,
  onSubmit,
}: DebtFormModalProps) {
  const title = editingDebt ? "Ubah Catatan Kasbon" : "Catat Kasbon Baru";
  const description = "Simpan rincian transaksi utang piutang kamu di sini.";

  const content = (
    <DebtFormContent
      formError={formError}
      formType={formType}
      setFormType={setFormType}
      formName={formName}
      setFormName={setFormName}
      formAmount={formAmount}
      setFormAmount={setFormAmount}
      formDueDate={formDueDate}
      setFormDueDate={setFormDueDate}
      formNote={formNote}
      setFormNote={setFormNote}
      formLoading={formLoading}
      onSubmit={onSubmit}
      onCancel={onClose}
      hideFooter={true}
    />
  );

  const successContent = (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1
        }}
        className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/5"
      >
        <Check className="h-8 w-8 stroke-[3]" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-title-lg font-bold text-fg-strong"
      >
        Berhasil Disimpan!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-body-md text-fg-muted mt-2"
      >
        {editingDebt ? "Perubahan catatan kasbon berhasil disimpan." : "Catatan kasbon baru berhasil ditambahkan."}
      </motion.p>
    </div>
  );

  const footerContent = (
    <div className="flex flex-row gap-2 w-full *:flex-1">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="text-fg-muted hover:text-fg"
      >
        Batal
      </Button>
      <Button
        type="submit"
        form="debt-form"
        className="bg-brand hover:bg-brand-hover text-brand-foreground font-bold"
        loading={formLoading}
        loadingText="Menyimpan..."
      >
        Simpan Catatan
      </Button>
    </div>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      title={formSuccess ? "" : title}
      description={formSuccess ? "" : description}
      footer={formSuccess ? null : footerContent}
      size="md"
    >
      {formSuccess ? successContent : content}
    </ResponsiveModal>
  );
}
