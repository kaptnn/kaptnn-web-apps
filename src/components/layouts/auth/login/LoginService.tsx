"use client";

import axiosInstance from "@/utils/axios";
import { loginSchema } from "@/utils/constants/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function useLoginForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        const response = await axiosInstance.post("/v1/auth/login/", {
          email: values.email,
          password: values.password,
        });

        if (response.data.data.access_token) {
          localStorage.setItem("token", response.data.data.access_token);
          axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.data.access_token}`;
        }

        router.push("/dashboard");
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
