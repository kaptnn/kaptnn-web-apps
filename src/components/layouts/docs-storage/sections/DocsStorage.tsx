/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useAllUsersStore } from "@/stores/useAllUsersStore";
import DashboardLayouts from "../../DashboardLayouts";
import { Button, Flex, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

interface DocsStorageClientProps {
  initialToken: string;
}

const DocsStorage: React.FC<DocsStorageClientProps> = ({ initialToken }) => {
  const {
    pageSize,
    current,
    loading,
    setData,
    setLoading,
    setCurrent,
    setTotal,
    openModal,
  } = useAllUsersStore();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Input.Search
              placeholder="Search companies…"
              onSearch={() => {}}
              loading={false}
              enterButton
              allowClear
            />
          </Flex>
          <Flex align="center">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              loading={loading}
              onClick={() => openModal("create")}
            >
              Tambah Perusahaan
            </Button>
          </Flex>
        </Flex>
        {/*  */}
      </Flex>
    </DashboardLayouts>
  );
};

export default DocsStorage;
