/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button, Flex, Input, message } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { DataType } from "../utils/table";
import { DocsCategoryApi } from "@/utils/axios/api-service";
import { useDocsCategoryStore } from "@/stores/useDocsCategory";
import DocsCategoryTable from "./TableDocsCategory";
import DocsCategoryModals from "./ModalDocsCategory";

const { Search } = Input;

interface DocsCategoryClientProps {
  initialToken: string;
}

const DocsCategory: React.FC<DocsCategoryClientProps> = ({ initialToken }) => {
  const { pageSize, current, loading, setData, setLoading, setCurrent, setTotal, openModal } = useDocsCategoryStore();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDocumentCategory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DocsCategoryApi.getAllDocsCategory(
        { page: current, limit: pageSize, sort: "created_at", order: "asc" },
        initialToken,
      );

      const formatted: DataType[] = response.result.map((item: DataType) => ({
        ...item,
        key: item.id,
      }));

      setData(formatted);
      setTotal(response.meta.totalItems);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  }, [setLoading, current, pageSize, initialToken, setData, setTotal]);

  useEffect(() => {
    fetchDocumentCategory();
  }, [fetchDocumentCategory]);

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
            <Button type="primary" icon={<PlusOutlined />} loading={loading} onClick={() => openModal("create")}>
              Tambah Kategori
            </Button>
          </Flex>
        </Flex>
        <DocsCategoryTable token={initialToken} fetchData={fetchDocumentCategory} />
        <DocsCategoryModals token={initialToken} />
      </Flex>
    </DashboardLayouts>
  );
};

export default DocsCategory;
