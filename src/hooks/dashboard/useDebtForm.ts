import { useState } from "react";
import { Debt, DebtType } from "@/types/debt";
import { formatInputRupiah } from "@/lib/format";
import { createDebtSchema } from "@/lib/validation";
import { createDebtAction, updateDebtAction } from "@/app/actions/debts";

interface UseDebtFormReturn {
  isFormOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingDebt: Debt | null;
  formLoading: boolean;
  formError: string;
  formType: DebtType;
  setFormType: React.Dispatch<React.SetStateAction<DebtType>>;
  formName: string;
  setFormName: React.Dispatch<React.SetStateAction<string>>;
  formAmount: string;
  setFormAmount: React.Dispatch<React.SetStateAction<string>>;
  formDueDate: string;
  setFormDueDate: React.Dispatch<React.SetStateAction<string>>;
  formNote: string;
  setFormNote: React.Dispatch<React.SetStateAction<string>>;
  openForm: (debt?: Debt | null) => void;
  handleFormSubmit: (
    e: React.FormEvent,
    onSuccess: (debt: Debt, isEdit: boolean) => void
  ) => Promise<void>;
  formSuccess: boolean;
}

export function useDebtForm(): UseDebtFormReturn {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [formType, setFormType] = useState<DebtType>("owed_to_me");
  const [formName, setFormName] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const getLocalDateString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const [formDueDate, setFormDueDate] = useState(getLocalDateString());
  const [formNote, setFormNote] = useState("");

  const openForm = (debt: Debt | null = null) => {
    setFormError("");
    setFormSuccess(false);
    if (debt) {
      setEditingDebt(debt);
      setFormType(debt.type);
      setFormName(debt.counterpart_name);
      setFormAmount(formatInputRupiah(debt.amount.toString()));
      setFormDueDate(debt.due_date || getLocalDateString());
      setFormNote(debt.note || "");
    } else {
      setEditingDebt(null);
      setFormType("owed_to_me");
      setFormName("");
      setFormAmount("");
      setFormDueDate(getLocalDateString());
      setFormNote("");
    }
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    e: React.FormEvent,
    onSuccess: (debt: Debt, isEdit: boolean) => void
  ) => {
    e.preventDefault();

    const parsedAmount = parseInt(formAmount.replace(/\D/g, ""), 10);
    const payload = {
      type: formType,
      counterpart_name: formName.trim(),
      amount: parsedAmount,
      due_date: formDueDate || null,
      note: formNote.trim() || null,
    };

    const validation = createDebtSchema.safeParse(payload);
    if (!validation.success) {
      setFormError(validation.error.issues[0].message);
      return;
    }

    setFormLoading(true);
    setFormError("");

    try {
      const result = editingDebt
        ? await updateDebtAction(editingDebt.id, validation.data)
        : await createDebtAction(validation.data);

      if (!result.success || !result.debt) {
        throw new Error(result.error || "Gagal memproses kasbon.");
      }

      setFormSuccess(true);
      setTimeout(() => {
        onSuccess(result.debt!, !!editingDebt);
        setIsFormOpen(false);
        setFormSuccess(false);
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan koneksi.";
      setFormError(msg);
    } finally {
      setFormLoading(false);
    }
  };

  return {
    isFormOpen,
    setIsFormOpen,
    editingDebt,
    formLoading,
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
    openForm,
    handleFormSubmit,
    formSuccess,
  };
}
