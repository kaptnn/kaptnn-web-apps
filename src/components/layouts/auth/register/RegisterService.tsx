"use client";

import axiosInstance from "@/utils/axios";
import { registerSchema } from "@/utils/constants/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function useRegisterForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      company: "",
      password: "",
      agreement: false,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post("/auth/sign-in/email/", {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          company: values.company,
          password: values.password,
          agreement: values.agreement,
        });

        if (response.status === 201) {
          router.push("/login");
        }
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
