/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import DashboardLayouts from "../../DashboardLayouts";
import { Input, Button, Flex, message, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DocsRequestTable from "./TableDocsRequest";
import DocsRequestModals from "./ModalDocsRequest";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import { DocsRequestApi } from "@/utils/axios/api-service";
import { DataType } from "../utils/table";

const { Search } = Input;

interface DocsReqClientProps {
  initialToken: string;
}

const AllDocsManager: React.FC<DocsReqClientProps> = ({ initialToken }) => {
  const { pageSize, current, loading, setData, setLoading, setCurrent, setTotal, openModal } = useDocsRequestStore();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocumentRequest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DocsRequestApi.getAllDocsRequest(
        { page: current, limit: pageSize, sort: "created_at", order: "asc" },
        initialToken,
      );

      const formatted: DataType[] = response.result.map((item: DataType) => ({
        ...item,
        key: item.id,
        due_date: item.due_date?.split("T")[0] || "-",
        upload_date: item.upload_date?.split("T")[0] || "-",
      }));

      setData(formatted);
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

  const onSearch = (value: string) => {
    setSearchTerm(value);
    setCurrent(1);
  };

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Search placeholder="Search" onSearch={onSearch} loading={false} enterButton allowClear />
          </Flex>
          <Flex align="center">
            <Button icon={<PlusOutlined />} type="primary" loading={loading} onClick={() => openModal("create")}>
              Tambah Permintaan Dokumen
            </Button>
          </Flex>
        </Flex>
        <Flex>
          <Divider />
        </Flex>
        <DocsRequestTable token={initialToken} fetchData={fetchDocumentRequest} />
        <DocsRequestModals token={initialToken} />
      </Flex>
    </DashboardLayouts>
  );
};

export default AllDocsManager;
