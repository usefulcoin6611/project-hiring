export interface Debt {
  id: string;
  user_id: string;
  type: "owed_to_me" | "i_owe";
  counterpart_name: string;
  amount: number;
  note: string | null;
  due_date: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DebtGroup {
  key: string;
  counterpart_name: string;
  displayName: string;
  owed_to_me: number;
  i_owe: number;
  itemsCount: number;
}

export interface DebtStats {
  owedToMe: number;
  iOwe: number;
  net: number;
}

export type DebtType = "owed_to_me" | "i_owe";
export type ViewMode = "list" | "group";
export type StatusFilter = "semua" | "belum" | "lunas";
export type SortBy = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
