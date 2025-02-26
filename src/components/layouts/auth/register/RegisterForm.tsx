"use client";

import {
  AutoComplete,
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Typography,
} from "antd";
import Link from "next/link";

const { Paragraph } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = () => {
  const [form] = Form.useForm();

  const onFinish = (values: unknown) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Flex
      vertical
      gap={48}
      align="center"
      style={{ marginBottom: 64 }}
      className="min-h-screen"
    >
      <div className="h-32 w-full bg-blue-600"></div>
      <Flex vertical style={{ paddingInline: 20 }} className="w-full">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
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
            <AutoComplete placeholder="Masukkan Nama Perusahaan Anda">
              <Input />
            </AutoComplete>
          </Form.Item>

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
                    new Error("match! Konfirmasi kata sandi anda tidak cocok!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

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
            {...tailFormItemLayout}
          >
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" className="w-full">
              Daftar Sekarang
            </Button>
          </Form.Item>

          <Paragraph className="text-center">
            Sudah mempunyai akun?
            <Link href="/login"> Masuk</Link>
          </Paragraph>
        </Form>
      </Flex>
    </Flex>
  );
};

export default Register;
