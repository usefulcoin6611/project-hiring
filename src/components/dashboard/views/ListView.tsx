"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { Debt } from "@/types/debt";
import { DebtItem } from "./DebtItem";

interface ListViewContentProps {
  processedDebts: Debt[];
  toggleSettle: (debt: Debt) => Promise<void> | void;
  openForm: (debt?: Debt) => void;
  confirmDelete: (debt: Debt) => void;
}

export function ListViewContent({
  processedDebts,
  toggleSettle,
  openForm,
  confirmDelete,
}: ListViewContentProps) {
  return (
    <div className="space-y-1.5 md:space-y-0.5 pb-16 md:pb-4 overflow-y-auto custom-scrollbar premium-fade-mask flex-1 pr-1 max-h-[390px] md:max-h-[295px]">
      {/* Table Header (Desktop Only) */}
      <div className="hidden md:grid sticky top-0 z-10 grid-cols-12 gap-x-1.5 px-3 py-2.5 bg-zinc-900/95 backdrop-blur-md rounded-xl text-xs font-semibold capitalize tracking-wider text-fg-subtle mb-2">
        <div className="col-span-2">Nama</div>
        <div className="col-span-2 lg:col-span-1">Tipe</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2 lg:col-span-3">Catatan & Waktu</div>
        <div className="col-span-2 text-end w-full pr-2">Nominal</div>
        <div className="col-span-3 text-end w-full pr-2">Aksi</div>
      </div>

      <AnimatePresence initial={false}>
        {processedDebts.map((debt, i) => (
          <DebtItem
            key={debt.id}
            debt={debt}
            viewMode="list"
            index={i}
            onToggleSettle={toggleSettle}
            onEdit={openForm}
            onDelete={confirmDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

