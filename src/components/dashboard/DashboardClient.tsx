"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert";
import { useDebtDashboard } from "@/hooks/dashboard/useDebtDashboard";
import { motion } from "framer-motion";

// render komponen
import { Header } from "@/components/dashboard/layout/Header";
import { StatsCards } from "@/components/dashboard/stats/StatsCards";
import { FiltersPanel } from "@/components/dashboard/filters/FiltersPanel";
import { Container } from "@/components/dashboard/layout/Container";
import { DebtFormModal } from "@/components/dashboard/modals/DebtFormModal";
import { DebtDeleteModal } from "@/components/dashboard/modals/DebtDeleteModal";
import { DebtResults } from "@/components/dashboard/views/DebtResults";
import { Toast } from "@/components/ui/toast";
import { AnimatePresence } from "framer-motion";
import { Debt } from "@/types/debt";

import { containerVariants, itemVariants } from "@/lib/motion";

interface DashboardClientProps {
  initialDebts: Debt[];
  initialUserName: string;
}

export function DashboardClient({ initialDebts, initialUserName }: DashboardClientProps) {
  const {
    isMobile,
    loading,
    errorMsg,
    userName,
    stats,
    isDeleteOpen,
    setIsDeleteOpen,
    deletingDebt,
    deleteLoading,
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    maxAmountFilter,
    setMaxAmountFilter,
    maxDebtAmount,
    handleLogout,
    logoutLoading,
    fetchData,
    openForm,
    toggleSettle,
    confirmDelete,
    handleDelete,
    onSubmitForm,
    totalCount,
    toast,
    setToast,
  } = useDebtDashboard(initialDebts, initialUserName);

  return (
    <Container variant="page">
      <Header userName={userName} onLogout={handleLogout} isLoggingOut={logoutLoading} />
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3 sm:gap-4"
        >
          {errorMsg && (
            <motion.div variants={itemVariants} className="order-0">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMsg}
                </AlertDescription>
                <AlertAction>
                  <Button size="sm" variant="link" onClick={fetchData} className="text-red-400 hover:underline p-0 h-auto">
                    Coba Lagi
                  </Button>
                </AlertAction>
              </Alert>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="order-1">
            <StatsCards stats={stats} />
          </motion.div>

          <div className="order-2 md:order-3">
            <DebtResults
              loading={loading}
              processedDebts={processedDebts}
              groupedDebts={groupedDebts}
              viewMode={viewMode}
              setViewMode={setViewMode}
              expandedPerson={expandedPerson}
              setExpandedPerson={setExpandedPerson}
              toggleSettle={toggleSettle}
              openForm={openForm}
              confirmDelete={confirmDelete}
              totalCount={totalCount}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
            />
          </div>

          <div className="order-3 md:order-2">
            <FiltersPanel
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              maxAmountFilter={maxAmountFilter}
              setMaxAmountFilter={setMaxAmountFilter}
              maxDebtAmount={maxDebtAmount}
              onOpenForm={() => openForm()}
              owedToMe={stats.owedToMe}
              iOwe={stats.iOwe}
            />
          </div>
        </motion.div>
      </Container>

      {/* modal & lembar bawah (bottom sheet) */}
      <DebtFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isMobile={isMobile}
        editingDebt={editingDebt}
        formError={formError}
        formType={formType}
        setFormType={setFormType}
        formName={formName}
        setFormName={setFormName}
        formAmount={formAmount}
        setFormAmount={setFormAmount}
        formDueDate={formDueDate}
        setFormDueDate={setFormDueDate}
        formNote={formNote}
        setFormNote={setFormNote}
        formLoading={formLoading}
        formSuccess={formSuccess}
        onSubmit={onSubmitForm}
      />

      <DebtDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        isMobile={isMobile}
        deletingDebt={deletingDebt}
        deleteLoading={deleteLoading}
        onDelete={handleDelete}
      />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </Container>
  );
}
