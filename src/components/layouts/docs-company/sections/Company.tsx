/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useCallback, useState } from "react";
import { Input, Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CompanyTable from "./TableCompany";
import CompanyModals from "./ModalCompany";
import DashboardLayouts from "../../DashboardLayouts";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { DataType } from "../utils/table";
import { CompanyApi } from "@/utils/axios/api-service";

interface CompanyClientProps {
  initialToken: string;
}

const Company: React.FC<CompanyClientProps> = ({ initialToken }) => {
  const { pageSize, current, loading, setData, setLoading, setCurrent, setTotal, openModal } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CompanyApi.getAllCompanies(
        { page: current, limit: pageSize, sort: "created_at", order: "asc" },
        initialToken,
      );

      const formatted: DataType[] = response.result.map((c: DataType) => ({
        ...c,
        key: c.id,
        start_audit_period: new Date(c.start_audit_period).toISOString().split("T")[0],
        end_audit_period: new Date(c.end_audit_period).toISOString().split("T")[0],
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
    fetchCompanies();
  }, [fetchCompanies]);

  const onSearch = (value: string) => {
    setSearchTerm(value);
    setCurrent(1);
  };

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Input.Search placeholder="Search companies…" onSearch={onSearch} loading={false} enterButton allowClear />
          </Flex>
          <Flex align="center">
            <Button icon={<PlusOutlined />} type="primary" loading={loading} onClick={() => openModal("create")}>
              Tambah Perusahaan
            </Button>
          </Flex>
        </Flex>
        <CompanyTable token={initialToken} fetchData={fetchCompanies} />
        <CompanyModals token={initialToken} />
      </Flex>
    </DashboardLayouts>
  );
};

export default Company;
