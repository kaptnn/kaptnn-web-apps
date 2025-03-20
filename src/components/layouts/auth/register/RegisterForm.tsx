"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Select, Typography } from "antd";
import Link from "next/link";
import { Controller } from "react-hook-form";
import useRegisterForm from "./RegisterService";

const { Paragraph } = Typography;

const Register = () => {
  const { form, isPending, onSubmit } = useRegisterForm();

  return (
    <div className="gap-16 md:gap-6 grid grid-cols-1 md:grid-cols-2 min-h-screen pb-16 md:pb-0 bg-white">
      <div className="h-full min-h-32 md:min-h-screen w-full bg-blue-600 p-8">
        <Button icon={<ArrowLeftOutlined />} href="/">
          Back to Home
        </Button>
      </div>
      <div className="flex flex-col md:justify-center md:items-center w-full px-5 md:px-24 bg-white">
        <Form
          onFinish={form.handleSubmit(onSubmit)}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
          {/*  */}
          <Form.Item
            label="Nama Lengkap"
            rules={[
              {
                required: true,
                message: "Masukkan nama lengkap anda!",
                whitespace: true,
              },
            ]}
          >
            <Controller
              name="name"
              control={form.control}
              rules={{
                required: "Masukkan nama lengkap anda!",
              }}
              render={({ field, fieldState }) => (
                <Input {...field} status={fieldState.error ? "error" : ""} />
              )}
            />
          </Form.Item>

          {/*  */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-6">
            {/*  */}
            <Form.Item
              label="Nomor Telepon"
              rules={[
                { required: true, message: "Masukkan nomor telepon anda!" },
              ]}
            >
              <Controller
                name="phoneNumber"
                control={form.control}
                rules={{
                  required: "Masukkan nomor telepon anda!",
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    status={fieldState.error ? "error" : ""}
                    addonBefore={"+62"}
                    style={{ width: "100%" }}
                  />
                )}
              />
            </Form.Item>

            {/*  */}
            <Form.Item
              label="Nama Perusahaan"
              rules={[
                { required: true, message: "Masukkan nama perusahaan anda!" },
              ]}
            >
              <Controller
                name="company"
                control={form.control}
                rules={{ required: "Masukkan nama perusahaan anda!" }}
                render={({ field, fieldState }) => (
                  <Select
                    {...field}
                    status={fieldState.error ? "error" : ""}
                    placeholder="Pilih Metode Perhitungan"
                    options={[
                      {
                        value: "straight_line",
                        label: <span>KAP Tambunan & Nasafi</span>,
                      },
                      {
                        value: "double_declining",
                        label: <span>Double Declining</span>,
                      },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-6">
            {/*  */}
            <Form.Item label="Kata Sandi" hasFeedback>
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

            {/*  */}
            <Form.Item label="Konfirmasi Kata Sandi" hasFeedback>
              <Controller
                name="confirmPassword"
                control={form.control}
                rules={{ required: "Konfirmasi kata sandi anda!" }}
                render={({ field, fieldState }) => (
                  <Input.Password
                    {...field}
                    status={fieldState.error ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
          </div>

          {/*  */}
          <Form.Item
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
          >
            <Controller
              name="agreement"
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  I have read the <a href="">agreement</a>
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isPending}
            >
              {isPending ? "Tunggu Sebentar" : "Daftar Sekarang"}
            </Button>
          </Form.Item>

          <Paragraph className="text-center">
            Sudah mempunyai akun?
            <Link href="/login"> Masuk</Link>
          </Paragraph>
        </Form>
      </div>
    </div>
  );
};

export default Register;
