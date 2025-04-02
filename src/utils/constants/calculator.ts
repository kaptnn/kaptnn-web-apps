import { z } from "zod";

export const depreciationCalculatorSchema = z.object({
  harga_perolehan: z.number().int(),
  estimasi_umur: z.number().int(),
  estimasi_nilai_sisa: z.number().int(),
  metode: z.string(),
});

export const presentValueCalculatorSchema = z.object({
  harga_perolehan: z.number().int(),
  estimasi_umur: z.number().int(),
  estimasi_nilai_sisa: z.number().int(),
  metode: z.string(),
});

export const weightedAverageCalculatorSchema = z.object({
  harga_perolehan: z.number().int(),
  estimasi_umur: z.number().int(),
  estimasi_nilai_sisa: z.number().int(),
  metode: z.string(),
});

