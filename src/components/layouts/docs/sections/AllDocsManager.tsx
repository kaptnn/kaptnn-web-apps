"use client";

import { useState } from "react";
import DashboardLayouts from "../../DashboardLayouts";
import {
  Input,
  Button,
  Flex,
  Table,
  Modal,
  Form,
  message,
  UploadProps,
  Upload,
  Select,
} from "antd";

import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { columns, DataType, TableRowSelection } from "../utils/table";

const { Search } = Input;

const { Dragger } = Upload;

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

const AllDocsManager = ({ docs_request }: { docs_request: [] }) => {
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
          dataSource={docs_request}
          expandable={{
            expandedRowRender: (item) => (
              <Flex>
                Dokumen dengan kategori {item.category_id} untuk{" "}
                {item.request_title}
              </Flex>
            ),
            rowExpandable: (item) => item.request_title !== "Not Expandable",
          }}
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
