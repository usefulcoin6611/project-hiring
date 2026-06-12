import { useState, useMemo } from "react";
import { Debt, DebtGroup, DebtStats, ViewMode, StatusFilter, SortBy } from "@/types/debt";
import { calculateStats, filterAndSortDebts, groupDebts } from "@/lib/debt-stats";

interface UseDebtFiltersReturn {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: StatusFilter;
  setStatusFilter: React.Dispatch<React.SetStateAction<StatusFilter>>;
  typeFilter: string;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  expandedPerson: string | null;
  setExpandedPerson: React.Dispatch<React.SetStateAction<string | null>>;
  processedDebts: Debt[];
  groupedDebts: DebtGroup[];
  stats: DebtStats;
  
  // state filter lanjutan
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  maxAmountFilter: number | null;
  setMaxAmountFilter: React.Dispatch<React.SetStateAction<number | null>>;
  maxDebtAmount: number;
}

export function useDebtFilters(debts: Debt[]): UseDebtFiltersReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");
  const [typeFilter, setTypeFilter] = useState("semua");
  const [sortBy, setSortBy] = useState<SortBy>("date-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  // state advanced filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxAmountFilter, setMaxAmountFilter] = useState<number | null>(null);

  const maxDebtAmount = useMemo(() => {
    if (debts.length === 0) return 10000000; // Rp 10.000.000 default max
    return Math.max(...debts.map((d) => d.amount));
  }, [debts]);

  const stats = useMemo<DebtStats>(() => calculateStats(debts), [debts]);

  const processedDebts = useMemo<Debt[]>(
    () =>
      filterAndSortDebts(debts, {
        statusFilter,
        typeFilter,
        searchQuery,
        startDate,
        endDate,
        maxAmountFilter,
        sortBy,
      }),
    [debts, statusFilter, typeFilter, searchQuery, sortBy, startDate, endDate, maxAmountFilter]
  );

  const groupedDebts = useMemo<DebtGroup[]>(() => groupDebts(processedDebts), [processedDebts]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    expandedPerson,
    setExpandedPerson,
    processedDebts,
    groupedDebts,
    stats,
    
    // state filter lanjutan
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    maxAmountFilter,
    setMaxAmountFilter,
    maxDebtAmount,
  };
}
