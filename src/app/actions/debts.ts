"use server";

import { createClient } from "@/lib/supabase";
import { createDebtSchema, CreateDebtInput } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { Debt } from "@/types/debt";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

async function getAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Akses ditolak. Silakan login terlebih dahulu.");
  }
  return user;
}

export async function createDebtAction(input: CreateDebtInput): Promise<{ success: boolean; debt?: Debt; error?: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    const validated = createDebtSchema.parse(input);

    const { data: newDebt, error: insertError } = await supabase
      .from("debts")
      .insert({
        user_id: user.id,
        type: validated.type,
        counterpart_name: validated.counterpart_name,
        amount: validated.amount,
        note: validated.note,
        due_date: validated.due_date,
        settled_at: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[createDebtAction_DB_ERROR]", insertError);
      return { success: false, error: "Gagal menyimpan catatan hutang baru." };
    }

    revalidatePath("/");
    return { success: true, debt: newDebt };
  } catch (err) {
    console.error("[createDebtAction_ERROR]", err);
    return { success: false, error: err instanceof Error ? err.message : "Terjadi kesalahan server." };
  }
}

export async function updateDebtAction(id: string, input: CreateDebtInput): Promise<{ success: boolean; debt?: Debt; error?: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    const validated = createDebtSchema.parse(input);

    const { data: updatedDebt, error: updateError } = await supabase
      .from("debts")
      .update({
        type: validated.type,
        counterpart_name: validated.counterpart_name,
        amount: validated.amount,
        note: validated.note,
        due_date: validated.due_date,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("[updateDebtAction_DB_ERROR]", updateError);
      return { success: false, error: "Gagal mengubah catatan hutang." };
    }

    revalidatePath("/");
    return { success: true, debt: updatedDebt };
  } catch (err) {
    console.error("[updateDebtAction_ERROR]", err);
    return { success: false, error: err instanceof Error ? err.message : "Terjadi kesalahan server." };
  }
}

export async function updateDebtStatusAction(id: string, settled: boolean): Promise<{ success: boolean; settledAt?: string | null; error?: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    const settledAt = settled ? new Date().toISOString() : null;

    const { error: updateError } = await supabase
      .from("debts")
      .update({
        settled_at: settledAt,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[updateDebtStatusAction_DB_ERROR]", updateError);
      return { success: false, error: "Gagal mengubah status lunas kasbon." };
    }

    revalidatePath("/");
    return { success: true, settledAt };
  } catch (err) {
    console.error("[updateDebtStatusAction_ERROR]", err);
    return { success: false, error: err instanceof Error ? err.message : "Terjadi kesalahan server." };
  }
}

export async function deleteDebtAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser(supabase);

    const { error: deleteError } = await supabase
      .from("debts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("[deleteDebtAction_DB_ERROR]", deleteError);
      return { success: false, error: "Gagal menghapus kasbon." };
    }

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("[deleteDebtAction_ERROR]", err);
    return { success: false, error: err instanceof Error ? err.message : "Terjadi kesalahan server." };
  }
}
