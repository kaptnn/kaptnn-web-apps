"use client";

import { useState } from "react";
import DashboardLayouts from "../../DashboardLayouts";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { columns, DataType, TableRowSelection } from "../utils/table";
import useCreateCompanyForm from "../form/Service";
import { Controller } from "react-hook-form";

const { Search } = Input;
const Company = ({ company }: { company: DataType[] }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { form, isPending, onSubmit } = useCreateCompanyForm();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex>
            <Search placeholder="Search" loading={false} enterButton />
          </Flex>
          <Flex align="center">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showLoading}
            >
              Add New Company
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Flex>
        </Flex>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={company}
          expandable={{
            expandedRowRender: (item) => <Flex>{item.company_name}</Flex>,
            rowExpandable: (item) => item.company_name !== "Not Expandable",
          }}
          className="rounded-lg"
          bordered
        />
      </Flex>
      <Modal
        title={"Tambah Data Perusahaan"}
        loading={loading}
        centered
        open={open}
        okText="Tambah Data Perusahaan"
        cancelText="Batalkan"
        onCancel={() => setOpen(false)}
      >
        {/* <Form layout="vertical">
          <Form.Item
            name="company_name"
            label="Nama Perusahaan"
            rules={[
              {
                required: true,
                message: "Masukkan e-mail anda!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="year_of_assignment"
            label="Tahun Penugasan"
            rules={[
              {
                required: true,
                message: "Masukkan e-mail anda!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <div className="w-full grid grid-cols-2 gap-6">
            <Form.Item
              name="start_audit_period"
              label="Awal Periode Audit"
              rules={[
                {
                  required: true,
                  message: "Masukkan e-mail anda!",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="end_audit_period"
              label="Akhir Periode Audit"
              rules={[
                {
                  required: true,
                  message: "Masukkan e-mail anda!",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Form> */}
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
      </Modal>
    </DashboardLayouts>
  );
};

export default Company;
