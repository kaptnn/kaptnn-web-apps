"use client";

import axiosInstance from "@/utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCompanySchema } from "@/utils/constants/company";

export default function useCreateCompanyForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createCompanySchema>>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      company_name: "",
      year_of_assignment: new Date().getFullYear(),
      start_audit_period: new Date().toISOString(),
      end_audit_period: new Date().toISOString(),
    },
  });

  async function onSubmit(values: z.infer<typeof createCompanySchema>) {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post("/v1/companies/", values);
        console.log("Company created successfully:", response.data);
      } catch (error: unknown) {
        if (error) {
          const errorMessage = error || "Something went wrong!";
          console.error("Login Error:", errorMessage);
        } else {
          console.error("Network Error:", error);
        }
      }
    });
  }

  return { form, isPending, onSubmit };
}
