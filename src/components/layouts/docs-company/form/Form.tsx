"use client";

import { Button, Form, Input, InputNumber, DatePicker } from "antd";
import { Controller } from "react-hook-form";
import useCreateCompanyForm from "./Service";

const CreateCompanyForm = () => {
  const { form, isPending, onSubmit } = useCreateCompanyForm();

  return (
    <Form
      onFinish={form.handleSubmit(onSubmit)}
      className="w-full"
      layout="vertical"
      scrollToFirstError
    >
      <Form.Item label="Nama Perusahaan">
        <Controller
          name="company_name"
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
      <Form.Item label="Tahun Penugasan">
        <Controller
          name="year_of_assignment"
          control={form.control}
          rules={{ required: "" }}
          render={({ field, fieldState }) => (
            <InputNumber
              {...field}
              style={{ width: "100%" }}
              status={fieldState.error ? "error" : ""}
            />
          )}
        />
      </Form.Item>

      <div className="w-full grid grid-cols-2 gap-6">
        <Form.Item>
          <Controller
            name="start_audit_period"
            control={form.control}
            render={({ field, fieldState }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                status={fieldState.error ? "error" : ""}
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Controller
            name="end_audit_period"
            control={form.control}
            render={({ field, fieldState }) => (
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                status={fieldState.error ? "error" : ""}
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isPending}>
          {isPending ? "Tunggu Sebentar" : "Masuk"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateCompanyForm;
