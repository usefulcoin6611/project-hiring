import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateDebtSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"]).optional(),
  counterpart_name: z.string().min(1, "Nama orang wajib diisi ya!").optional(),
  amount: z.number().int().positive("Jumlah uang harus bernilai positif!").max(999999999999999, "Angka yang dimasukkan terlalu besar!").optional(),
  note: z.string().max(200, "Catatan maksimal 200 karakter aja ya!").optional().nullable(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD!").optional().nullable(),
  settled: z.boolean().optional(), // flag status lunas
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk memperbarui data." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = updateDebtSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { settled, ...restData } = parseResult.data;
    
    // make sure kasbon-nya ada & punya user yg login
    const { data: currentDebt, error: checkError } = await supabase
      .from("debts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !currentDebt) {
      return NextResponse.json(
        { error: "Data hutang tidak ditemukan atau kamu tidak memiliki akses." },
        { status: 404 }
      );
    }

    // susun payload buat update
    const updatePayload: Record<string, unknown> = { ...restData };

    if (settled !== undefined) {
      updatePayload.settled_at = settled ? new Date().toISOString() : null;
    }

    const { data: updatedDebt, error: updateError } = await supabase
      .from("debts")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[DEBTS_PATCH_UPDATE_ERROR]", updateError);
      return NextResponse.json(
        { error: "Gagal memperbarui catatan hutang." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Catatan hutang berhasil diperbarui!", debt: updatedDebt },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DEBTS_PATCH_API_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk menghapus data." },
        { status: 401 }
      );
    }

    // validasi kepemilikan data
    const { data: currentDebt, error: checkError } = await supabase
      .from("debts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !currentDebt) {
      return NextResponse.json(
        { error: "Data tidak ditemukan atau kamu tidak memiliki hak menghapus data ini." },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("debts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[DEBTS_DELETE_ERROR]", deleteError);
      return NextResponse.json(
        { error: "Gagal menghapus catatan hutang." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Catatan hutang berhasil dihapus!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DEBTS_DELETE_API_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
