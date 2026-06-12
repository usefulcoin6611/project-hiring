import { useState, useCallback, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import { Debt } from "@/types/debt";
import { updateDebtStatusAction, deleteDebtAction } from "@/app/actions/debts";

interface UseDebtsReturn {
  debts: Debt[];
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>;
  loading: boolean;
  errorMsg: string;
  userName: string;
  fetchData: () => Promise<void>;
  toggleSettle: (debt: Debt) => Promise<void>;
  // state buat delete
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deletingDebt: Debt | null;
  deleteLoading: boolean;
  confirmDelete: (debt: Debt) => void;
  handleDelete: () => Promise<void>;
  toast: { message: string; type: "success" | "error" } | null;
  setToast: React.Dispatch<React.SetStateAction<{ message: string; type: "success" | "error" } | null>>;
}

export function useDebts(initialDebts: Debt[] = [], initialUserName: string = ""): UseDebtsReturn {
  const supabase = createBrowserSupabaseClient();

  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [loading, setLoading] = useState(initialDebts.length === 0);
  const [errorMsg, setErrorMsg] = useState("");
  const [userName, setUserName] = useState(initialUserName);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingDebt, setDeletingDebt] = useState<Debt | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.email?.split("@")[0] || "Teman");
      }

      const res = await fetch("/api/debts");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengambil data kasbon.");
      }

      setDebts(data.debts || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghubungi server.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (initialDebts.length === 0) {
      fetchData();
    }
  }, [fetchData, initialDebts.length]);

  const toggleSettle = async (debt: Debt) => {
    try {
      const newSettledState = !debt.settled_at;
      const result = await updateDebtStatusAction(debt.id, newSettledState);

      if (!result.success) {
        setToast({ message: result.error || "Gagal mengubah status kasbon.", type: "error" });
        return;
      }

      setDebts((prev) =>
        prev.map((item) =>
          item.id === debt.id
            ? { ...item, settled_at: result.settledAt || null }
            : item
        )
      );
    } catch {
      setToast({ message: "Terjadi kesalahan jaringan.", type: "error" });
    }
  };

  const confirmDelete = (debt: Debt) => {
    setDeletingDebt(debt);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingDebt) return;
    try {
      setDeleteLoading(true);
      const result = await deleteDebtAction(deletingDebt.id);

      if (!result.success) {
        setToast({ message: result.error || "Gagal menghapus kasbon.", type: "error" });
        return;
      }

      setDebts((prev) => prev.filter((item) => item.id !== deletingDebt.id));
      setIsDeleteOpen(false);
      setToast({ message: "Catatan berhasil dihapus.", type: "success" });
    } catch {
      setToast({ message: "Terjadi kesalahan jaringan.", type: "error" });
    } finally {
      setDeleteLoading(false);
      setDeletingDebt(null);
    }
  };

  return {
    debts,
    setDebts,
    loading,
    errorMsg,
    userName,
    fetchData,
    toggleSettle,
    isDeleteOpen,
    setIsDeleteOpen,
    deletingDebt,
    deleteLoading,
    confirmDelete,
    handleDelete,
    toast,
    setToast,
  };
}
