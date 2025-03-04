"use client";

import { Button, Form, Input } from "antd";
import { Controller } from "react-hook-form";
import useLoginForm from "../../auth/login/LoginService";

const PresentValueCalculatorForm = () => {
  const { form, isPending, onSubmit } = useLoginForm();

  return (
    <Form
      onFinish={form.handleSubmit(onSubmit)}
      className="w-full"
      layout="vertical"
      scrollToFirstError
    >
      <Form.Item label="Nilai Masa Depan (Dalam Rupiah):">
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

      <Form.Item label="Rate (Dalam %):">
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

      <Form.Item label="Jangka Waktu (Dalam Tahun):">
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

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isPending}>
          Hitung Present Value
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PresentValueCalculatorForm;
