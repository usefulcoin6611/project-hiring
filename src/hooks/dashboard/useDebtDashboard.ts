"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDebts } from "@/hooks/dashboard/useDebts";
import { useDebtForm } from "@/hooks/dashboard/useDebtForm";
import { useDebtFilters } from "@/hooks/dashboard/useDebtFilters";

import { Debt } from "@/types/debt";

export function useDebtDashboard(initialDebts: Debt[] = [], initialUserName: string = "") {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const isMobile = useIsMobile();

  const {
    debts,
    setDebts,
    loading,
    errorMsg,
    userName,
    toggleSettle,
    isDeleteOpen,
    setIsDeleteOpen,
    deletingDebt,
    deleteLoading,
    confirmDelete,
    handleDelete,
    fetchData,
    toast,
    setToast,
  } = useDebts(initialDebts, initialUserName);

  const {
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
  } = useDebtForm();

  const {
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    maxAmountFilter,
    setMaxAmountFilter,
    maxDebtAmount,
  } = useDebtFilters(debts);

  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      router.refresh();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setLogoutLoading(false);
    }
  };

  const handleFormSubmitBridged = async (e: React.FormEvent) => {
    await handleFormSubmit(e, (debt, isEdit) => {
      if (isEdit) {
        setDebts((prev) => prev.map((item) => (item.id === debt.id ? debt : item)));
      } else {
        setDebts((prev) => [debt, ...prev]);
      }
    });
  };

  return {
    // state dasar
    isMobile,
    loading,
    errorMsg,
    userName,
    stats,

    // state buat delete
    isDeleteOpen,
    setIsDeleteOpen,
    deletingDebt,
    deleteLoading,

    // state handle form
    isFormOpen,
    setIsFormOpen,
    editingDebt,
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
    formLoading,
    formSuccess,

    // state filter
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
    
    // state filter lanjutan
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    maxAmountFilter,
    setMaxAmountFilter,
    maxDebtAmount,

    // handler actions
    handleLogout,
    logoutLoading,
    fetchData,
    openForm,
    toggleSettle,
    confirmDelete,
    handleDelete,
    onSubmitForm: handleFormSubmitBridged,
    totalCount: debts.length,
    toast,
    setToast,
  };
}
