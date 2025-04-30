/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button, Flex, Input, message } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { UserApi } from "@/utils/axios/api-service";
import { DataType } from "../utils/table";

interface AllUsersClientProps {
  initialToken: string;
}

const AllUsers: React.FC<AllUsersClientProps> = ({ initialToken }) => {
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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserApi.getAllUsers(
        { page: current, limit: pageSize, sort: "created_at", order: "asc" },
        initialToken,
      );

      const formatted: DataType[] = response.result.map((c: DataType) => ({
        ...c,
        key: c.id,
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
    fetchUsers();
  }, [fetchUsers]);

  const onSearch = (value: string) => {
    setSearchTerm(value);
    setCurrent(1);
  };

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Input.Search
              placeholder="Search users..."
              onSearch={onSearch}
              loading={false}
              enterButton
              allowClear
            />
          </Flex>
          <Flex align="center">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              loading={loading}
              onClick={() => openModal("create")}
            >
              Add New User
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </DashboardLayouts>
  );
};

export default AllUsers;
