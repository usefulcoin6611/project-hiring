"use client";

import React from "react";
import { DollarSign, FileText, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardIcon, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GroupedViewContent } from "./GroupedView";
import { ListViewContent } from "./ListView";
import { Debt, DebtGroup } from "@/types/debt";

interface DebtResultsProps {
  loading: boolean;
  processedDebts: Debt[];
  groupedDebts: DebtGroup[];
  viewMode: "list" | "group";
  setViewMode: (mode: "list" | "group") => void;
  expandedPerson: string | null;
  setExpandedPerson: (person: string | null) => void;
  toggleSettle: (debt: Debt) => Promise<void> | void;
  openForm: (debt?: Debt) => void;
  confirmDelete: (debt: Debt) => void;
  totalCount: number;
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
}

export function DebtResults({
  loading,
  processedDebts,
  groupedDebts,
  viewMode,
  setViewMode,
  expandedPerson,
  setExpandedPerson,
  toggleSettle,
  openForm,
  confirmDelete,
  totalCount,
  searchQuery,
  statusFilter,
  typeFilter,
}: DebtResultsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-16 w-full rounded-xl bg-zinc-900/50 animate-pulse" />
        ))}
      </div>
    );
  }

  // empty state kalo kasbon masih kosong melompong
  if (totalCount === 0) {
    return (
      <Card variant="empty">
        <CardHeader>
          <CardIcon>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />
          </CardIcon>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Semua catatan kasbon kamu akan tampil di sini. Klik tombol &quot;Catat Baru&quot; di atas untuk memulai.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const getFilterDescription = () => {
    const active = [];
    if (searchQuery.trim()) active.push(`nama "${searchQuery}"`);
    if (statusFilter !== "semua") active.push(statusFilter === "lunas" ? "Lunas" : "Belum Lunas");
    if (typeFilter !== "semua") active.push(typeFilter === "owed_to_me" ? "Dihutang" : "Saya Hutang");
    if (active.length === 0) return "Tidak ditemukan catatan kasbon.";
    return `Tidak ada data yang cocok dengan filter ${active.join(", ")}.`;
  };

  return (
    <Card variant="dashboard">
      {/* Unified Card Header */}
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>
            {viewMode === "group" ? "Kasbon per Orang" : "Daftar Kasbon"}
          </CardTitle>
          <Badge variant="count">
            {viewMode === "group" ? `${groupedDebts.length} Orang` : `${processedDebts.length} Catatan`}
          </Badge>
        </div>

        {/* View Switcher */}
        <CardAction className="inline-flex items-center rounded-lg p-0.5 bg-zinc-950 shrink-0 h-8 mr-1.5">
          <Button
            variant="switcher"
            size="none"
            data-state={viewMode === "list" ? "on" : "off"}
            onClick={() => setViewMode("list")}
            title="Tampilan Semua"
          >
            <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 shrink-0" /> <span>Semua</span>
          </Button>
          <Button
            variant="switcher"
            size="none"
            data-state={viewMode === "group" ? "on" : "off"}
            onClick={() => setViewMode("group")}
            title="Tampilan per Orang"
          >
            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 shrink-0" /> <span>Per Orang</span>
          </Button>
        </CardAction>
      </CardHeader>

      {/* Inner Content Area with AnimatePresence */}
      <div className="flex-1 min-h-0 flex flex-col justify-center">
        {processedDebts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="p-2.5 rounded-full bg-zinc-950 text-fg-faint mb-2 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <h4 className="text-title-sm font-semibold text-fg">Hasil tidak ditemukan</h4>
            <p className="text-body-sm text-fg-muted max-w-xs mt-1">
              {getFilterDescription()}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === "group" ? (
              <motion.div
                key="group-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.12 }}
                className="flex-1 min-h-0 flex flex-col"
              >
                <GroupedViewContent
                  processedDebts={processedDebts}
                  groupedDebts={groupedDebts}
                  expandedPerson={expandedPerson}
                  setExpandedPerson={setExpandedPerson}
                  toggleSettle={toggleSettle}
                  openForm={openForm}
                  confirmDelete={confirmDelete}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.12 }}
                className="flex-1 min-h-0 flex flex-col"
              >
                <ListViewContent
                  processedDebts={processedDebts}
                  toggleSettle={toggleSettle}
                  openForm={openForm}
                  confirmDelete={confirmDelete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </Card>
  );
}
