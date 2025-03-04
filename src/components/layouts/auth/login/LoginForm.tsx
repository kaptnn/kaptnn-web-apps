"use client";

import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";
import Link from "next/link";
import { Controller } from "react-hook-form";
import useLoginForm from "./LoginService";

const { Paragraph } = Typography;

const Login = () => {
  const { form, isPending, onSubmit } = useLoginForm();

  return (
    <div className="gap-16 md:gap-6 grid grid-cols-1 md:grid-cols-2 min-h-screen md:mb-0 bg-white">
      <div className="h-full md:min-h-screen w-full bg-blue-600"></div>
      <div className="flex flex-col md:justify-center md:items-center w-full px-5 md:px-24">
        <Form
          onFinish={form.handleSubmit(onSubmit)}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item label="E-mail">
            <Controller
              name="email"
              control={form.control}
              rules={{
                required: "Masukkan e-mail anda!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail tidak valid!",
                },
              }}
              render={({ field, fieldState }) => (
                <Input {...field} status={fieldState.error ? "error" : ""} />
              )}
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item label="Kata Sandi">
            <Controller
              name="password"
              control={form.control}
              rules={{ required: "Masukkan kata sandi anda!" }}
              render={({ field, fieldState }) => (
                <Input.Password
                  {...field}
                  status={fieldState.error ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Controller
                name="rememberMe"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value} // Fixed Ant Design warning
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>
                )}
              />
              <Link href="/forgot-password">Lupa Kata Sandi?</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={isPending}>
              Masuk
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
