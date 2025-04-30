"use client";

import { Button, Form, InputNumber, Select } from "antd";
import { Controller } from "react-hook-form";
import useDepreciationCalculatorForm from "./Service";

const DepreciationCalculatorForm = ({
  setCalculationResult,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCalculationResult: (result: any) => void;
}) => {
  const { form, isPending, onSubmit } =
    useDepreciationCalculatorForm(setCalculationResult);

  return (
    <Form
      onFinish={form.handleSubmit(onSubmit)}
      className="w-full"
      layout="vertical"
      scrollToFirstError
    >
      <Form.Item
        label="Harga Perolehan (Dalam Rupiah):"
        validateStatus={form.formState.errors.harga_perolehan ? "error" : ""}
        help={form.formState.errors.harga_perolehan?.message}
      >
        <Controller
          name="harga_perolehan"
          control={form.control}
          rules={{ required: "Harga perolehan harus diisi!" }}
          render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
        />
      </Form.Item>

      <Form.Item
        label="Estimasi Umur (Dalam Tahun):"
        validateStatus={form.formState.errors.estimasi_umur ? "error" : ""}
        help={form.formState.errors.estimasi_umur?.message}
      >
        <Controller
          name="estimasi_umur"
          control={form.control}
          rules={{ required: "Estimasi umur harus diisi!" }}
          render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
        />
      </Form.Item>

      <Form.Item
        label="Estimasi Nilai Sisa (Dalam Rupiah):"
        validateStatus={form.formState.errors.estimasi_nilai_sisa ? "error" : ""}
        help={form.formState.errors.estimasi_nilai_sisa?.message}
      >
        <Controller
          name="estimasi_nilai_sisa"
          control={form.control}
          rules={{ required: "Estimasi nilai sisa harus diisi!" }}
          render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
        />
      </Form.Item>

      <Form.Item
        label="Metode:"
        validateStatus={form.formState.errors.metode ? "error" : ""}
        help={form.formState.errors.metode?.message}
      >
        <Controller
          name="metode"
          control={form.control}
          rules={{ required: "Pilih metode perhitungan!" }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Pilih Metode Perhitungan"
              options={[
                { value: "straight_line", label: "Straight Line" },
                { value: "double_declining", label: "Double Declining" },
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
