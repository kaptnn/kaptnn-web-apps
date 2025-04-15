"use client";

import axiosInstance from "@/utils/axios";
import { loginSchema } from "@/utils/constants/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuthStore from "@/stores/AuthStore";
import { getCurrentUser } from "@/utils/axios/user";
import { getCompanyById } from "@/utils/axios/company";

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

        const result = response.data?.result;
        if (!result?.access_token) {
          router.push("/login");
          return;
        }

        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("refresh_token", result.refresh_token);
        axiosInstance.defaults.headers.Authorization = `Bearer ${result.access_token}`;

        const now = new Date();
        const accessTokenExp = new Date(now.getTime() + 60 * 60 * 1000);
        const refreshTokenExp = new Date(
          now.getTime() + 60 * 60 * 1000 * 24 * 7
        );

        document.cookie = `access_token=${
          result.access_token
        }; expires=${accessTokenExp.toUTCString()}; path=/; secure; samesite=strict`;
        document.cookie = `refresh_token=${
          result.refresh_token
        }; expires=${refreshTokenExp.toUTCString()}; path=/; secure; samesite=strict`;

        useAuthStore
          .getState()
          .setAuth(result.access_token, result.refresh_token);

        const rawCurrentUserData = await getCurrentUser(result.access_token);
        const rawCompanyByIdData = await getCompanyById(
          rawCurrentUserData.company_id,
          result.access_token
        );

        const currentUserData = {
          ...rawCurrentUserData,
          company_name: rawCompanyByIdData.company_name,
        };

        useAuthStore.getState().setUserInfo(currentUserData);

        router.push("/dashboard");
      } catch (error: unknown) {
        let errorMessage = "Something went wrong!";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.error("Login Error:", errorMessage);
      }
    });
  }

  return { form, isPending, onSubmit };
}
