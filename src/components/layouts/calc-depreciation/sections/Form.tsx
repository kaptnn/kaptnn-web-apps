"use client";

import { Button, Form, Input, Select } from "antd";
import { Controller } from "react-hook-form";
import useLoginForm from "../../auth/login/LoginService";

const DepreciationCalculatorForm = () => {
  const { form, isPending, onSubmit } = useLoginForm();

  return (
    <Form
      onFinish={form.handleSubmit(onSubmit)}
      className="w-full"
      layout="vertical"
      scrollToFirstError
    >
      <Form.Item label="Harga Perolehan (Dalam Rupiah):">
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

      <Form.Item label="Estimasi Umur (Dalam Tahun):">
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

      <Form.Item label="Estimasi Nilai Sisa (Dalam Tahun):">
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

      <Form.Item label="Metode:">
        <Controller
          name="password"
          control={form.control}
          rules={{ required: "Masukkan kata sandi anda!" }}
          render={({ field, fieldState }) => (
            <Select
              {...field}
              status={fieldState.error ? "error" : ""}
              placeholder="Pilih Metode Perhitungan"
              options={[
                { value: "straight_line", label: <span>Straight Line</span> },
                {
                  value: "double_declining",
                  label: <span>Double Declining</span>,
                },
              ]}
            />
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isPending}>
          Hitung Depreciation
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DepreciationCalculatorForm;
