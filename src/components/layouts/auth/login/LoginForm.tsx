"use client";

import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/utils/constants/user";
import { AuthApi, CompanyApi, UserApi } from "@/utils/axios/api-service";
import axiosInstance from "@/utils/axios";
import useAuthStore from "@/stores/AuthStore";

const { Paragraph } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFinish = async (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const response = await AuthApi.loginUser({
          email: values.email,
          password: values.password,
        });
        if (!response?.access_token) {
          router.push("/login");
          return;
        }

        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.access_token}`;

        const now = new Date();
        const accessTokenExp = new Date(now.getTime() + 60 * 60 * 1000);
        const refreshTokenExp = new Date(
          now.getTime() + 60 * 60 * 1000 * 24 * 7
        );

        document.cookie = `access_token=${
          response.access_token
        }; expires=${accessTokenExp.toUTCString()}; path=/; secure; samesite=strict`;
        document.cookie = `refresh_token=${
          response.refresh_token
        }; expires=${refreshTokenExp.toUTCString()}; path=/; secure; samesite=strict`;

        useAuthStore
          .getState()
          .setAuth(response.access_token, response.refresh_token);

        const rawCurrentUserData = await UserApi.getCurrentUser(
          response.access_token
        );
        const rawCompanyByIdData = await CompanyApi.getCompanyById(
          rawCurrentUserData.company_id,
          response.access_token
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
  };

  return (
    <div className="gap-16 md:gap-6 grid grid-cols-1 md:grid-cols-2 min-h-screen md:mb-0 bg-white">
      <div className="h-full md:min-h-screen w-full bg-blue-600 p-8">
        <Button icon={<ArrowLeftOutlined />} href="/">
          Back to Home
        </Button>
      </div>
      <div className="flex flex-col md:justify-center md:items-center w-full px-5 md:px-24">
        <Form
          form={form}
          onFinish={handleFinish}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item name="email" label="E-mail" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            label="Kata Sandi"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <Form.Item name="rememberMe">
            <Flex justify="space-between" align="center">
              <Checkbox onChange={(e) => e.target.checked}>
                Remember me
              </Checkbox>

              <Link href="/forgot-password">Lupa Kata Sandi?</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={isPending}>
              {isPending ? "Tunggu Sebentar" : "Masuk"}
            </Button>
          </Form.Item>

          <Paragraph className="text-center">
            Belum mempunyai akun? <Link href="/register">Daftar Sekarang</Link>
          </Paragraph>
        </Form>
      </div>
    </div>
  );
};

export default Login;
