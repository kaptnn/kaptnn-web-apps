"use client";

import { useEffect, useCallback } from "react";
import { Input, Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "@/utils/axios";
import CompanyTable from "./TableCompany";
import CompanyModals from "./ModalCompany";
import DashboardLayouts from "../../DashboardLayouts";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { DataType } from "../utils/table";

interface CompanyClientProps {
  initialToken: string;
}

const Company: React.FC<CompanyClientProps> = ({ initialToken }) => {
  const {
    pageSize,
    current,
    setData,
    setLoading,
    setOpen,
    setTotal,
    setModalType,
  } = useCompanyStore();

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resp } = await axiosInstance.get(
        `/v1/companies?page=${current}&limit=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${initialToken}` },
        }
      );

      const formatted: DataType[] = resp.result.map((c: DataType) => ({
        ...c,
        key: c.id,
        start_audit_period: new Date(c.start_audit_period)
          .toISOString()
          .split("T")[0],
        end_audit_period: new Date(c.end_audit_period)
          .toISOString()
          .split("T")[0],
      }));

      setData(formatted);
      setTotal(resp.pagination.total_items);
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

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Input.Search placeholder="Search companies…" enterButton />
          </Flex>
          <Flex align="center">
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setOpen(true);
                setModalType("create");
              }}
            >
              Add New Company
            </Button>
          </Flex>
        </Flex>
        <CompanyTable token={initialToken} />
        <CompanyModals token={initialToken} refresh={fetchCompanies} />
      </Flex>
    </DashboardLayouts>
  );
};

export default Company;
