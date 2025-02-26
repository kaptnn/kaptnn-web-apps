"use client";

import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";
import Link from "next/link";
import { Controller } from "react-hook-form";
import useLoginForm from "./LoginService";

const { Paragraph } = Typography;

const Login = () => {
  const { form, isPending, onSubmit } = useLoginForm();

  return (
    <Flex vertical gap={48} align="center" className="min-h-screen mb-16">
      <div className="h-32 w-full bg-blue-600"></div>
      <Flex vertical className="w-full px-5">
        <Form
          onFinish={form.handleSubmit(onSubmit)}
          className="w-full"
          layout="vertical"
          style={{ maxWidth: 600 }}
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
      </Flex>
    </Flex>
  );
};

export default Login;
