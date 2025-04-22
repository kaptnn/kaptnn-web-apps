/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
  TablePaginationConfig,
} from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TableRowSelection, columns as baseColumns, DataType } from "../utils/table";
import axiosInstance from "@/utils/axios";

interface UsersClientProps {
  initialToken: string;
  isAdmin: boolean;
  currentCompanyId: string;
  companyOptions: Array<{ value: string; label: string }>;
}

interface ApiResponse {
  result: DataType[];
  pagination: {
    current_page: number;
    total_items: number;
    total_pages: number;
  };
}

const AllUsers: React.FC<UsersClientProps> = ({ initialToken, isAdmin, currentCompanyId, companyOptions }) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: current,
        limit: pageSize,
        search: searchText || undefined,
        role: selectedRoles.length ? selectedRoles.join(",") : undefined,
        membership: selectedMemberships.length ? selectedMemberships.join(",") : undefined,
      };
      if (isAdmin) {
        if (selectedCompanies.length) params.company_name = selectedCompanies.join(",");
      } else {
        params.company_id = currentCompanyId;
      }

      const { data: resp } = await axiosInstance.get<ApiResponse>("/v1/users", {
        headers: { Authorization: `Bearer ${initialToken}` },
        params,
      });

      const lookup = companyOptions.reduce<Record<string, string>>((m, { value, label }) => {
        m[value] = label;
        return m;
      }, {});

      const formatted: DataType[] = resp.result.map((u) => ({
        ...u,
        key: u.id,
        company_name: lookup[u.company_id] || "Unknown",
      }));

      setData(formatted);
      setTotal(resp.pagination.total_items);
    } catch (err) {
      message.error("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    current,
    pageSize,
    searchText,
    selectedCompanies,
    selectedRoles,
    selectedMemberships,
    initialToken,
    isAdmin,
    currentCompanyId,
    companyOptions,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const pagination: TablePaginationConfig = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    onChange: (page, size) => {
      setCurrent(page);
      setPageSize(size || pageSize);
    },
    position: ["bottomCenter"],
  };

  const columns = useMemo(() => baseColumns, []);

  const onFinish = useCallback(
    async (values: any) => {
      const payload = {
        ...values,
        start_audit_period: values.start_audit_period.toISOString(),
        end_audit_period: values.end_audit_period.toISOString(),
      };

      try {
        await axiosInstance.post("/v1/companies/", payload, {
          headers: { Authorization: `Bearer ${initialToken}` },
        });
        message.success("Company created");
        setOpen(false);
        fetchUsers();
        form.resetFields();
      } catch (err) {
        console.error(err);
        message.error("Failed to create company");
      }
    },
    [form, initialToken, fetchUsers],
  );

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center" gap={16} className="w-3/5">
            <Input.Search
              placeholder="Search users…"
              enterButton
              allowClear
              onSearch={(val) => {
                setSearchText(val);
                setCurrent(1);
              }}
              style={{ width: 300 }}
            />
            <Select
              mode="multiple"
              allowClear
              disabled={!isAdmin}
              placeholder="Company"
              options={companyOptions}
              onChange={(vals) => {
                setSelectedCompanies(vals as string[]);
                setCurrent(1);
              }}
              style={{ width: 200 }}
            />
            <Select
              mode="multiple"
              allowClear
              placeholder="Role"
              options={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
              ]}
              onChange={(vals) => {
                setSelectedRoles(vals as string[]);
                setCurrent(1);
              }}
              style={{ width: 150 }}
            />
            <Select
              mode="multiple"
              allowClear
              placeholder="Membership"
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
                { value: "enterprise", label: "Enterprise" },
              ]}
              onChange={(vals) => {
                setSelectedMemberships(vals as string[]);
                setCurrent(1);
              }}
              style={{ width: 150 }}
            />
          </Flex>
          <Flex align="center">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                setOpen(true);
              }}
            >
              Add New User
            </Button>
          </Flex>
        </Flex>
        <Table<DataType>
          rowKey="id"
          loading={loading}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={data}
          pagination={pagination}
          expandable={{
            expandedRowRender: (item) => <Flex>{item.email}</Flex>,
            rowExpandable: (item) => item.email !== "Not Expandable",
          }}
          className="rounded-lg"
          bordered
        />
        <Modal
          title="Tambah Data Perusahaan"
          centered
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => form.submit()}
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="company_name"
              label="Nama Perusahaan"
              rules={[{ required: true, message: "Masukkan nama perusahaan!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="year_of_assignment"
              label="Tahun Penugasan"
              rules={[{ required: true, message: "Masukkan tahun penugasan!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                name="start_audit_period"
                label="Awal Periode Audit"
                rules={[{ required: true, message: "Pilih tanggal mulai!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="end_audit_period"
                label="Akhir Periode Audit"
                rules={[{ required: true, message: "Pilih tanggal akhir!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </Flex>
    </DashboardLayouts>
  );
};

export default AllUsers;
