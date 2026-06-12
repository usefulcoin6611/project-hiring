import { Debt, DebtGroup, DebtStats, SortBy, StatusFilter } from "@/types/debt";

/**
 * Hitung summary stats (Net calc).
 * CATATAN BISNIS: hanya entry yang BELUM lunas (settled_at === null) yang dihitung.
 * net = total dihutang ke saya - total saya hutang.
 */
export function calculateStats(debts: Debt[]): DebtStats {
  let owedToMe = 0;
  let iOwe = 0;

  for (const debt of debts) {
    if (debt.settled_at) continue; // yang sudah lunas tidak dihitung
    if (debt.type === "owed_to_me") {
      owedToMe += debt.amount;
    } else {
      iOwe += debt.amount;
    }
  }

  return { owedToMe, iOwe, net: owedToMe - iOwe };
}

export interface FilterOptions {
  statusFilter: StatusFilter;
  typeFilter: string;
  searchQuery: string;
  startDate: string;
  endDate: string;
  maxAmountFilter: number | null;
  sortBy: SortBy;
}

/**
 * Filter + sort daftar debt sesuai opsi. Pure: tidak memutasi input.
 */
export function filterAndSortDebts(debts: Debt[], opts: FilterOptions): Debt[] {
  let result = [...debts];

  if (opts.statusFilter === "lunas") {
    result = result.filter((d) => d.settled_at !== null);
  } else if (opts.statusFilter === "belum") {
    result = result.filter((d) => d.settled_at === null);
  }

  if (opts.typeFilter !== "semua") {
    result = result.filter((d) => d.type === opts.typeFilter);
  }

  if (opts.searchQuery.trim() !== "") {
    const query = opts.searchQuery.toLowerCase();
    result = result.filter((d) =>
      d.counterpart_name.toLowerCase().includes(query)
    );
  }

  if (opts.startDate !== "") {
    result = result.filter((d) => d.created_at.split("T")[0] >= opts.startDate);
  }
  if (opts.endDate !== "") {
    result = result.filter((d) => d.created_at.split("T")[0] <= opts.endDate);
  }

  if (opts.maxAmountFilter !== null) {
    result = result.filter((d) => d.amount <= opts.maxAmountFilter!);
  }

  result.sort((a, b) => {
    if (opts.sortBy === "date-desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (opts.sortBy === "date-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (opts.sortBy === "amount-desc") return b.amount - a.amount;
    if (opts.sortBy === "amount-asc") return a.amount - b.amount;
    return 0;
  });

  return result;
}

/**
 * Kelompokkan debt per nama orang (case-insensitive).
 */
export function groupDebts(debts: Debt[]): DebtGroup[] {
  const groups: Record<string, DebtGroup> = {};

  for (const debt of debts) {
    const key = debt.counterpart_name.trim().toLowerCase();
    if (!groups[key]) {
      groups[key] = { key, counterpart_name: key, displayName: debt.counterpart_name, owed_to_me: 0, i_owe: 0, itemsCount: 0 };
    }
    groups[key].itemsCount += 1;
    if (debt.type === "owed_to_me") {
      groups[key].owed_to_me += debt.amount;
    } else {
      groups[key].i_owe += debt.amount;
    }
  }

  return Object.values(groups);
}
