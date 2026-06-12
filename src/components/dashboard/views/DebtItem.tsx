"use client";

import React from "react";
import { Check, Edit3, Trash2, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatRupiah, getRelativeTime } from "@/lib/format";
import { Debt } from "@/types/debt";
import { getDebtColorClass, getDebtTypeLabel } from "@/lib/debt-utils";
import { cn } from "@/lib/utils";
import { SuccessOverlay } from "./SuccessOverlay";

interface DebtItemProps {
  debt: Debt;
  viewMode: "list" | "group";
  index: number;
  onToggleSettle: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}

export function DebtItem({
  debt,
  viewMode,
  index,
  onToggleSettle,
  onEdit,
  onDelete,
}: DebtItemProps) {
  const isSettled = !!debt.settled_at;
  const isOwedToMe = debt.type === "owed_to_me";

  const prevSettledAt = React.useRef(debt.settled_at);
  const [justToggled, setJustToggled] = React.useState(false);

  React.useEffect(() => {
    if (prevSettledAt.current !== debt.settled_at) {
      setJustToggled(true);
      const timer = setTimeout(() => setJustToggled(false), 1200);
      prevSettledAt.current = debt.settled_at;
      return () => clearTimeout(timer);
    }
  }, [debt.settled_at]);

  // badge biar konsisten
  const TypeBadge = () => (
    <span
      className={`text-caption font-semibold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
        isSettled
          ? "bg-zinc-800/50 text-fg-subtle"
          : isOwedToMe
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
          : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
      }`}
    >
      {getDebtTypeLabel(debt.type)}
    </span>
  );

  const StatusBadge = () => (
    <span
      className={`text-caption font-semibold px-2 py-0.5 rounded-full shrink-0 transition-colors ${
        isSettled
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10"
          : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
      }`}
    >
      {isSettled ? "Lunas" : "Belum Lunas"}
    </span>
  );

  const ActionButtons = ({ size = "default" }: { size?: "default" | "sm" }) => (
    <div className="flex items-center gap-0 shrink-0 flex-nowrap">
      {!isSettled && (
        <Button
          size="none"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSettle(debt);
          }}
          title="Tandai lunas"
          className="h-7 px-1.5 gap-0.5 text-xs text-fg-muted hover:text-emerald-400 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <Check className="h-3.5 w-3.5 shrink-0" />
          {size === "default" && (
            <span className="text-body-sm">
              Lunas
            </span>
          )}
        </Button>
      )}

      <Button
        size="none"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(debt);
        }}
        title="Ubah catatan"
        className="h-7 px-1.5 gap-0.5 text-xs text-fg-muted hover:text-fg-strong hover:bg-zinc-800 rounded-lg transition-all"
      >
        <Edit3 className="h-3.5 w-3.5 shrink-0" />
        {size === "default" && (
          <span className="text-body-sm">Ubah</span>
        )}
      </Button>

      <Button
        size="none"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(debt);
        }}
        title="Hapus catatan"
        className="h-7 px-1.5 gap-0.5 text-xs text-fg-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
      >
        <Trash2 className="h-3.5 w-3.5 shrink-0" />
        {size === "default" && (
          <span className="text-body-sm">Hapus</span>
        )}
      </Button>
    </div>
  );

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={
          justToggled
            ? {
                scale: [1, 1.015, 1],
                opacity: isSettled ? 0.6 : 1,
                y: 0,
              }
            : {
                scale: 1,
                opacity: isSettled ? 0.6 : 1,
                y: 0,
              }
        }
        exit={{ opacity: 0, x: -20 }}
        transition={
          justToggled
            ? { duration: 0.5, ease: "easeInOut" }
            : { duration: 0.2, delay: index < 8 ? index * 0.04 : 0 }
        }
        className={`relative overflow-hidden px-3 py-2.5 rounded-xl transition-all duration-300 grid grid-cols-2 md:grid-cols-12 items-center gap-x-2 gap-y-2 md:gap-x-1.5 md:gap-y-0 text-body-sm ${
          justToggled
            ? "border border-emerald-500/20"
            : isSettled
            ? "opacity-60 bg-zinc-950/30 md:bg-transparent mobile-border-muted"
            : "mobile-border hover:bg-zinc-900/40 bg-transparent"
        }`}
      >
        <SuccessOverlay show={justToggled} />
        {/* Kolom 1: Nama */}
        <div className="order-1 md:order-1 col-span-1 md:col-span-2 flex items-center gap-2 min-w-0 flex-nowrap">
          <h4 className="text-body-md font-semibold text-fg capitalize truncate max-w-[90px] xs:max-w-[130px] md:max-w-[150px]">
            {debt.counterpart_name}
          </h4>
        </div>

        {/* Kolom 2: Tipe (Desktop Only) */}
        <div className="hidden md:flex items-center md:order-2 col-span-2 lg:col-span-1">
          <TypeBadge />
        </div>

        {/* Kolom 3: Status (Desktop Only) */}
        <div className="hidden md:flex items-center md:order-3 col-span-1">
          <StatusBadge />
        </div>

        {/* Kolom 4: Catatan & Waktu */}
        <div className="order-3 md:order-4 col-span-2 md:col-span-2 lg:col-span-3 min-w-0 flex flex-col md:flex-row md:items-center gap-1 text-body-sm text-fg-subtle">
          <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap flex-nowrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-fg-faint md:hidden shrink-0" />
              <span>{getRelativeTime(debt.created_at)}</span>
            </div>
            {/* Badge Tipe & Status Mobile */}
            <div className="flex md:hidden gap-1 shrink-0 flex-nowrap">
              <TypeBadge />
              <StatusBadge />
            </div>
          </div>

          {/* Catatan (Keterangan) & ActionButtons (Mobile Only) */}
          <div className="flex md:hidden items-center justify-between gap-2 w-full mt-1">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <FileText className="h-3 w-3 text-fg-faint shrink-0" />
              <span className="italic truncate text-fg-muted min-w-0">
                {debt.note ? `“${debt.note}”` : "—"}
              </span>
            </div>
            <div className="shrink-0">
              <ActionButtons />
            </div>
          </div>

          {/* Catatan untuk Desktop Only */}
          {debt.note && (
            <div className="hidden md:flex items-center gap-1 min-w-0 flex-1">
              <span className="text-fg-faint shrink-0">•</span>
              <span className="italic truncate text-fg-muted min-w-0">
                &ldquo;{debt.note}&rdquo;
              </span>
            </div>
          )}
        </div>

        {/* Kolom 5: Nominal/Uang */}
        <div className="order-2 md:order-5 col-span-1 md:col-span-2 text-right shrink-0 pr-2">
          <span
            className={cn(
              "text-value-sm font-semibold tracking-tight whitespace-nowrap",
              getDebtColorClass(debt.type, isSettled)
            )}
          >
            {formatRupiah(debt.amount)}
          </span>
        </div>

        {/* Kolom 6: Aksi (Desktop Only) */}
        <div className="hidden md:flex order-4 md:order-6 col-span-1 md:col-span-3 items-center shrink-0 justify-end">
          <ActionButtons />
        </div>
      </motion.div>
    );
  }

  // mode tampilan grouped / per orang
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={
        justToggled
          ? {
              scale: [1, 1.015, 1],
              opacity: isSettled ? 0.6 : 1,
              y: 0,
            }
          : {
              scale: 1,
              opacity: isSettled ? 0.6 : 1,
              y: 0,
            }
      }
      exit={{ opacity: 0, x: -20 }}
      transition={
        justToggled
          ? { duration: 0.5, ease: "easeInOut" }
          : { duration: 0.18, delay: index < 8 ? index * 0.03 : 0 }
      }
      className={`relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-body-sm transition-all duration-300 border ${
        justToggled
          ? "border-emerald-500/20"
          : isSettled
          ? "opacity-60 bg-zinc-950/20 border-zinc-800/40 mobile-border-muted"
          : "bg-zinc-900/20 hover:bg-zinc-900/60 border-zinc-800/80 mobile-border"
      }`}
    >
      <SuccessOverlay show={justToggled} />
      {/* Left side info block */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-body-sm text-fg-subtle shrink-0">
            <Calendar className="h-3 w-3 text-fg-faint shrink-0" />
            <span>{getRelativeTime(debt.created_at)}</span>
          </div>
          <TypeBadge />
          <StatusBadge />
        </div>
        {debt.note && (
          <div className="flex items-center gap-1 text-body-sm text-fg-muted min-w-0">
            <FileText className="h-3 w-3 text-fg-faint shrink-0" />
            <span className="italic truncate">&ldquo;{debt.note}&rdquo;</span>
          </div>
        )}
      </div>

      {/* Right side info block */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t border-zinc-800/45 sm:border-none w-full sm:w-auto">
        <span
          className={cn(
            "text-value-sm font-semibold tracking-tight whitespace-nowrap self-start sm:self-auto",
            getDebtColorClass(debt.type, isSettled)
          )}
        >
          {formatRupiah(debt.amount)}
        </span>
        <div className="flex justify-end w-full sm:w-auto">
          <ActionButtons />
        </div>
      </div>
    </motion.div>
  );
}
