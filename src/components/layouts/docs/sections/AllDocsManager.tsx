"use client";

import { useState } from "react";
import DashboardLayouts from "../../DashboardLayouts";
import {
  Input,
  Button,
  Flex,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Modal,
  Form,
  Select,
  Upload,
  message,
} from "antd";

import type { UploadProps } from "antd";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { dataSource, DataType } from "@/utils/constants/mock-data";

const { Search } = Input;

const { Dragger } = Upload;

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const columns: TableColumnsType<DataType> = [
  { title: "Document Name", dataIndex: "name" },
  { title: "Category", dataIndex: "category" },
  {
    title: "Type",
    dataIndex: "type",
    render: (item: string) => (
      <Flex align="center" justify="center">
        <Tag color="default">{item}</Tag>
      </Flex>
    ),
  },
  { title: "Upload Date", dataIndex: "upload" },
  { title: "Due Date", dataIndex: "due" },
  {
    title: "Status",
    dataIndex: "status",
    render: (item: string) => {
      const statusColors: Record<
        string,
        { color: string; icon: React.ReactNode }
      > = {
        Done: { color: "success", icon: <CheckCircleOutlined /> },
        Pending: { color: "warning", icon: <ClockCircleOutlined /> },
        Overdue: { color: "error", icon: <CloseCircleOutlined /> },
        "In Progress": { color: "processing", icon: <SyncOutlined /> },
        None: { color: "default", icon: <MinusCircleOutlined /> },
      };

      const { color, icon } = statusColors[item] || statusColors["None"];

      return (
        <Flex align="center" justify="center">
          <Tag icon={icon} color={color}>
            {item}
          </Tag>
        </Flex>
      );
    },
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <Flex gap={8} align="center" justify="center">
        <Button color="primary" variant="solid">
          View
        </Button>
        <Button color="default" type="default">
          Edit
        </Button>
        <Button color="danger" variant="solid">
          Delete
        </Button>
      </Flex>
    ),
  },
];

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const AllDocsManager = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
              Add New Document
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Flex>
        </Flex>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          className="rounded-lg"
          bordered
        />
      </Flex>
      <Modal
        title={"Add New Document"}
        loading={loading}
        centered
        open={open}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical">
          <Form.Item
            name="email"
            label="Nama Dokumen"
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
            label="Kategori Dokumen"
            rules={[
              { required: true, message: "Masukkan nomor telepon anda!" },
            ]}
          >
            <Select></Select>
          </Form.Item>

          <Form.Item
            name="company"
            label="Upload Dokumen"
            rules={[
              { required: true, message: "Masukkan nama perusahaan anda!" },
            ]}
          >
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Tekan atau seret file ke area untuk menguploadnya
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayouts>
  );
};

export default AllDocsManager;
