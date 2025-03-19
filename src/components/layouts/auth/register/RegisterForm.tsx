"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Checkbox, Form, Input, Typography } from "antd";
import Link from "next/link";

const { Paragraph } = Typography;

const Register = () => {
  const onFinish = (values: unknown) => {
    console.log("Received values of form: ", values);
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
          onFinish={onFinish}
          className="w-full"
          layout="vertical"
          scrollToFirstError
        >
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

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "E-mail tidak valid!",
              },
              {
                required: true,
                message: "Masukkan e-mail anda!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-6">
            <Form.Item
              name="phone"
              label="Nomor Telepon"
              rules={[
                { required: true, message: "Masukkan nomor telepon anda!" },
              ]}
            >
              <Input addonBefore={"+62"} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="company"
              label="Nama Perusahaan"
              rules={[
                { required: true, message: "Masukkan nama perusahaan anda!" },
              ]}
            >
              <AutoComplete placeholder="Masukkan Nama Perusahaan">
                <Input />
              </AutoComplete>
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-6">
            {" "}
            <Form.Item
              name="password"
              label="Kata Sandi"
              rules={[
                {
                  required: true,
                  message: "Masukkan kata sandi anda!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Konfirmasi Kata Sandi"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Konfirmasi ulang kata sandi anda!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "match! Konfirmasi kata sandi anda tidak cocok!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <Form.Item
            name="agreement"
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
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Daftar Sekarang
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
