export function formatRupiahParts(value: number): {
  prefix: string;
  numberPart: string;
  isNegative: boolean;
} {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const numberPart = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absValue);

  return {
    prefix: "Rp",
    numberPart,
    isNegative,
  };
}

/**
 * Format a number as Indonesian Rupiah display string.
 * Example: 1500000 → "Rp 1.500.000"
 */
export function formatRupiah(value: number): string {
  const { prefix, numberPart, isNegative } = formatRupiahParts(value);
  return `${isNegative ? "-" : ""}${prefix} ${numberPart}`;
}

/**
 * Format a string input with thousand separators for Rupiah input fields.
 * Strips non-numeric characters and re-formats.
 * Example: "1500000" → "1.500.000"
 */
export function formatInputRupiah(value: string): string {
  const clean = value.replace(/\D/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseInt(clean, 10));
}

/**
 * Returns a human-readable relative time string in Bahasa Indonesia.
 * Example: "Hari ini", "Kemarin", "3 hari lalu", "2 minggu lalu", "1 bulan lalu"
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    const isToday = date.toDateString() === now.toDateString();
    return isToday ? "Hari ini" : "Kemarin";
  }
  if (diffDays <= 7) return `${diffDays} hari lalu`;
  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu lalu`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} bulan lalu`;
}
