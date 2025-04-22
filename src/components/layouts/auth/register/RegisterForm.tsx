"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Select, Typography } from "antd";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/utils/constants/user";
import { z } from "zod";
import { AuthApi } from "@/utils/axios/api-service";

const { Paragraph } = Typography;

const Register = ({
  companies,
}: {
  companies: { value: string; label: string }[];
}) => {
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFinish = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        const response = await AuthApi.registerUser({
          name: values.name,
          email: values.email,
          company_id: values.company,
          password: values.password,
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
  };

  return (
    <div className="gap-16 md:gap-6 grid grid-cols-1 md:grid-cols-2 min-h-screen pb-16 md:pb-0 bg-white">
      <div className="h-full min-h-32 md:min-h-screen w-full bg-blue-600 p-8">
        <Button icon={<ArrowLeftOutlined />} href="/">
          Back to Home
        </Button>
      </div>
      <div className="flex flex-col md:justify-center md:items-center w-full px-5 md:px-24 bg-white">
        <Form
          form={form}
          onFinish={handleFinish}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
          {/*  */}
          <Form.Item
            name="name"
            label="Nama Lengkap"
            rules={[
              {
                required: true,
                message: "Masukkan nama lengkap anda!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/*  */}
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: "Masukkan nama lengkap anda!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-6">
            {/*  */}
            <Form.Item
              label="Nomor Telepon"
              rules={[
                { required: true, message: "Masukkan nomor telepon anda!" },
              ]}
            >
              <Input addonBefore={"+62"} style={{ width: "100%" }} />
            </Form.Item>

            {/*  */}
            <Form.Item
              label="Nama Perusahaan"
              rules={[
                { required: true, message: "Masukkan nama perusahaan anda!" },
              ]}
            >
              <Select
                placeholder="Pilih Metode Perhitungan"
                options={companies}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-6">
            {/*  */}
            <Form.Item label="Kata Sandi" hasFeedback>
              <Input.Password />
            </Form.Item>

            {/*  */}
            <Form.Item label="Konfirmasi Kata Sandi" hasFeedback>
              <Input.Password />
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
            <Checkbox onChange={(e) => e.target.checked}>
              I have read the <a href="">agreement</a>
            </Checkbox>
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
