import { z } from "zod";

export const createDebtSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"]),
  counterpart_name: z.string().min(1, "Nama orang wajib diisi ya!"),
  amount: z.number().int().positive("Jumlah uang harus bernilai positif!").max(999999999999999, "Angka yang dimasukkan terlalu besar!"),
  note: z.string().max(200, "Catatan maksimal 200 karakter aja ya!").optional().nullable(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD!").optional().nullable(),
});
export type CreateDebtInput = z.infer<typeof createDebtSchema>;
