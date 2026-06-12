"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { Debt, DebtGroup } from "@/types/debt";
import { DebtItem } from "./DebtItem";

interface GroupedViewContentProps {
  processedDebts: Debt[];
  groupedDebts: DebtGroup[];
  expandedPerson: string | null;
  setExpandedPerson: (val: string | null) => void;
  toggleSettle: (debt: Debt) => Promise<void> | void;
  openForm: (debt?: Debt) => void;
  confirmDelete: (debt: Debt) => void;
}

export function GroupedViewContent({
  processedDebts,
  groupedDebts,
  expandedPerson,
  setExpandedPerson,
  toggleSettle,
  openForm,
  confirmDelete,
}: GroupedViewContentProps) {
  const activeKey = expandedPerson ?? groupedDebts[0]?.key ?? null;
  const activeGroup = groupedDebts.find((g) => g.key === activeKey);
  const activeDiff = activeGroup ? activeGroup.owed_to_me - activeGroup.i_owe : 0;

  return (
    <div className="pb-16 md:pb-4 flex flex-col gap-3 flex-1 min-h-0 overflow-hidden">
      {/* Tabs nama orang */}
      <div className="flex flex-row items-center gap-1.5 overflow-x-auto scrollbar-none snap-x pb-2 border-b border-zinc-800/40">
        {groupedDebts.map((group) => {
          const isActive = group.key === activeKey;
          return (
            <button
              key={group.key}
              onClick={() => setExpandedPerson(group.key)}
              className={`shrink-0 snap-start px-3 py-1.5 rounded-lg text-body-md font-semibold capitalize transition-colors flex items-center gap-1.5 ${
                isActive
                  ? "bg-brand text-brand-foreground"
                  : "bg-zinc-950 text-fg-muted hover:text-fg hover:bg-zinc-800/60"
              }`}
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[110px]">{group.displayName}</span>
              <span className={`text-body-sm font-semibold px-1.5 py-0.5 rounded-full ${isActive ? "bg-black/20" : "bg-zinc-900"}`}>
                {group.itemsCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel orang terpilih */}
      <AnimatePresence mode="wait">
        {activeGroup && (
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden"
          >
            {/* Ringkasan */}
            <div className="flex flex-row justify-between items-center gap-2 text-body-sm bg-zinc-950/60 px-3 py-2 rounded-lg shrink-0">
              <div>Dihutang: <span className="text-emerald-400 font-medium">{formatRupiah(activeGroup.owed_to_me)}</span></div>
              <div>Hutang: <span className="text-rose-500 font-medium">{formatRupiah(activeGroup.i_owe)}</span></div>
              <div className="font-semibold shrink-0">Selisih: <span className={activeDiff >= 0 ? "text-emerald-400" : "text-rose-500"}>{activeDiff >= 0 ? "+" : ""}{formatRupiah(activeDiff)}</span></div>
            </div>

            {/* Transaksi orang terpilih */}
            <div className="space-y-0.5 overflow-y-auto flex-1 min-h-0 pr-1 custom-scrollbar premium-fade-mask">
              <AnimatePresence initial={false}>
                {processedDebts
                  .filter((d) => d.counterpart_name.trim().toLowerCase() === activeGroup.key)
                  .map((debt, i) => (
                    <DebtItem
                      key={debt.id}
                      debt={debt}
                      viewMode="group"
                      index={i}
                      onToggleSettle={toggleSettle}
                      onEdit={openForm}
                      onDelete={confirmDelete}
                    />
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

