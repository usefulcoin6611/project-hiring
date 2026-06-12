import { DebtType } from "@/types/debt";

export function getDebtColorClass(type: DebtType, isSettled: boolean = false): string {
  if (isSettled) {
    return "text-fg-subtle line-through font-medium";
  }
  return type === "owed_to_me" ? "text-emerald-400" : "text-rose-500";
}

export function getDebtTypeLabel(type: DebtType): string {
  return type === "owed_to_me" ? "Dihutang" : "Saya Hutang";
}
