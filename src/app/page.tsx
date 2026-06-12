import React from "react";
import { createClient } from "@/lib/supabase";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { Debt } from "@/types/debt";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.email?.split("@")[0] || "Teman";

  const { data: debtsData } = await supabase
    .from("debts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const initialDebts: Debt[] = debtsData || [];

  return (
    <DashboardClient
      initialDebts={initialDebts}
      initialUserName={userName}
    />
  );
}
