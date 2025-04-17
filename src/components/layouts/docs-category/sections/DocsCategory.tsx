"use client";

import { Button, DatePicker, Flex, Form, Input, InputNumber, Modal, Table } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { columns, DataType, TableRowSelection } from "../utils/table";

const { Search } = Input;

const DocsCategory = ({ docs_category }: { docs_category: [] }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
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
              Add New Category
            </Button>
          </Flex>
        </Flex>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={docs_category}
          className="rounded-lg"
          bordered
          pagination={{
            align: "center",
            style: { marginTop: "32px" },
            position: ["bottomCenter"],
          }}
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
        <Form layout="vertical">
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
        </Form>
        {/* <Form
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
        </Form> */}
      </Modal>
    </DashboardLayouts>
  );
};

export default DocsCategory;
