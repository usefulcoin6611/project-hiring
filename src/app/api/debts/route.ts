import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { z } from "zod";

// schema zod buat validasi
const createDebtSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"]),
  counterpart_name: z.string().min(1, "Nama orang wajib diisi ya!"),
  amount: z.number().int().positive("Jumlah uang harus bernilai positif!").max(999999999999999, "Angka yang dimasukkan terlalu besar!"),
  note: z.string().max(200, "Catatan maksimal 200 karakter aja ya!").optional().nullable(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD!").optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Kamu harus login dulu untuk mengakses data ini." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "semua"; // semua, belum, lunas
    const type = searchParams.get("type") || "semua"; // semua, owed_to_me, i_owe

    let query = supabase
      .from("debts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // filter status
    if (status === "lunas") {
      query = query.not("settled_at", "is", null);
    } else if (status === "belum") {
      query = query.is("settled_at", null);
    }

    // filter tipe
    if (type !== "semua") {
      query = query.eq("type", type);
    }

    const { data: debts, error: dbError } = await query;

    if (dbError) {
      console.error("[DEBTS_GET_DB_ERROR]", dbError);
      return NextResponse.json(
        { error: "Gagal mengambil data hutang dari database." },
        { status: 500 }
      );
    }

    return NextResponse.json({ debts }, { status: 200 });
  } catch (err) {
    console.error("[DEBTS_GET_API_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = createDebtSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { type, counterpart_name, amount, note, due_date } = parseResult.data;

    const { data: newDebt, error: insertError } = await supabase
      .from("debts")
      .insert({
        user_id: user.id,
        type,
        counterpart_name,
        amount,
        note,
        due_date,
        settled_at: null, // default belum lunas pas input baru
      })
      .select()
      .single();

    if (insertError) {
      console.error("[DEBTS_POST_INSERT_ERROR]", insertError);
      return NextResponse.json(
        { error: "Gagal menyimpan catatan hutang baru." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Catatan hutang berhasil disimpan!", debt: newDebt },
      { status: 201 }
    );
  } catch (err) {
    console.error("[DEBTS_POST_API_ERROR]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
