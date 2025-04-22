"use client";

import axiosInstance from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { depreciationCalculatorSchema } from "@/utils/constants/calculator";

export default function useDepreciationCalculatorForm(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCalculationResult: (result: any) => void,
) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof depreciationCalculatorSchema>>({
    resolver: zodResolver(depreciationCalculatorSchema),
    defaultValues: {
      harga_perolehan: 0,
      estimasi_umur: 0,
      estimasi_nilai_sisa: 0,
      metode: "straight_line",
    },
  });

  async function onSubmit(values: z.infer<typeof depreciationCalculatorSchema>) {
    startTransition(async () => {
      try {
        const response = await axiosInstance.get("/v1/calculator/depreciation", {
          params: values,
        });

        console.log("API Response:", response.data);
        setCalculationResult(response.data); // Send result to parent component
      } catch (error) {
        console.error("API Error:", error);
      }
    });
  }

  return { form, isPending, onSubmit };
}
