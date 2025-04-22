"use client";

import React, { useCallback, useEffect } from "react";
import DashboardLayouts from "../../DashboardLayouts";
import { Input, Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DocsRequestTable from "./TableDocsRequest";
import DocsRequestModals from "./ModalDocsRequest";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import { DocsRequestApi } from "@/utils/axios/api-service";

const { Search } = Input;

// const props: UploadProps = {
//   name: "file",
//   multiple: true,
//   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== "uploading") {
//       console.log(info.file, info.fileList);
//     }
//     if (status === "done") {
//       message.success(`${info.file.name} file uploaded successfully.`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };

interface DocsReqClientProps {
  initialToken: string;
}

const AllDocsManager: React.FC<DocsReqClientProps> = ({ initialToken }) => {
  const {
    pageSize,
    current,
    loading,
    setData,
    setLoading,
    setOpen,
    setTotal,
    setModalType,
  } = useDocsRequestStore();

  const fetchDocumentRequest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DocsRequestApi.getAllDocsRequest(
        {
          page: current,
          limit: pageSize,
          sort: "created_at",
          order: "asc",
        },
        initialToken
      );

      setData(response.result);
      setTotal(response.meta.totalItems);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  }, [setLoading, initialToken, current, pageSize, setData, setTotal]);

  useEffect(() => {
    fetchDocumentRequest();
  }, [fetchDocumentRequest]);

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Search placeholder="Search" loading={false} enterButton />
          </Flex>
          <Flex align="center">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              loading={loading}
              onClick={() => {
                setOpen(true);
                setModalType("create");
              }}
            >
              Add New Document Request
            </Button>
          </Flex>
        </Flex>
        <DocsRequestTable token={initialToken} />
        <DocsRequestModals
          token={initialToken}
          refresh={fetchDocumentRequest}
        />
      </Flex>
    </DashboardLayouts>
  );
};

export default AllDocsManager;
