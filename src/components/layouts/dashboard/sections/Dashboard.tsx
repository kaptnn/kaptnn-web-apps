/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import { Row, Col, Card, Statistic, Spin, message, Flex } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import DashboardLayouts from "../../DashboardLayouts";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import axiosInstance from "@/utils/axios";
import { CompanyApi, DocsCategoryApi, DocsRequestApi, UserApi } from "@/utils/axios/api-service";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { useDocsCategoryStore } from "@/stores/useDocsCategory";

interface DashboardClientProps {
  initialToken: string;
}

const Dashboard: React.FC<DashboardClientProps> = ({ initialToken }) => {
  const {
    loading: compLoading,
    data: compData,
    total: compTotal,
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading,
  } = useCompanyStore();

  const {
    loading: usersLoading,
    data: usersData,
    total: usersTotal,
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading,
  } = useAllUsersStore();

  const {
    loading: docReqLoading,
    data: docReqData,
    total: docReqTotal,
    setData: setDocReqData,
    setTotal: setDocReqTotal,
    setLoading: setDocReqLoading,
  } = useDocsRequestStore();

  const {
    loading: docCatLoading,
    data: docCatData,
    total: docCatTotal,
    setData: setDocCatData,
    setTotal: setDocCatTotal,
    setLoading: setDocCatLoading,
  } = useDocsCategoryStore();

  useEffect(() => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
  }, [initialToken]);

  const fetchData = useCallback(async () => {
    setCompLoading(true);
    setDocReqLoading(true);
    setUsersLoading(true);
    setDocCatLoading(true);
    try {
      const [compRes, docReqRes, usersRes, docCatRes] = await Promise.all([
        CompanyApi.getAllCompanies({}, initialToken),
        DocsRequestApi.getAllDocsRequest({}, initialToken),
        UserApi.getAllUsers({}, initialToken),
        DocsCategoryApi.getAllDocsCategory({}, initialToken),
      ]);

      const formattedCompanies = compRes.result.map((c: any) => ({
        ...c,
        key: c.id,
        start_audit_period: new Date(c.start_audit_period).toISOString().split("T")[0],
        end_audit_period: new Date(c.end_audit_period).toISOString().split("T")[0],
      }));
      setCompData(formattedCompanies);
      setCompTotal(compRes.meta.totalItems);

      setDocReqData(docReqRes.result);
      setDocReqTotal(docReqRes.meta.totalItems);

      setUsersData(usersRes.result);
      setUsersTotal(usersRes.meta.totalItems);

      setDocCatData(docCatRes.result);
      setDocCatTotal(docCatRes.meta.totalItems);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      message.error("Failed to fetch dashboard data.");
    } finally {
      setCompLoading(false);
      setDocReqLoading(false);
      setUsersLoading(false);
      setDocCatLoading(false);
    }
  }, [
    setCompLoading,
    setDocReqLoading,
    setUsersLoading,
    setDocCatLoading,
    initialToken,
    setCompData,
    setCompTotal,
    setDocReqData,
    setDocReqTotal,
    setUsersData,
    setUsersTotal,
    setDocCatData,
    setDocCatTotal,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const fulfilledCount = docReqData.filter((d: any) => d.status === "fulfilled").length;
    const totalCount = docReqData.length;
    const pct = totalCount ? (fulfilledCount / totalCount) * 100 : 0;
    return {
      fulfilled: fulfilledCount,
      unfulfilled: totalCount - fulfilledCount,
      pct: +pct.toFixed(2),
    };
  }, [docReqData]);

  if (compLoading || docReqLoading || usersLoading) {
    return (
      <DashboardLayouts>
        <main className="h-screen w-full items-center justify-center">
          <Flex className="h-screen w-full" justify="center" align="center">
            <Spin tip="Loading dashboard..." />
          </Flex>
        </main>
      </DashboardLayouts>
    );
  }

  return (
    <DashboardLayouts>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card variant="outlined" className="h-48">
            {/* Optional: Add summary chart or welcome banner here */}
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic title="Total Pengguna Aktif" value={usersTotal} suffix="Pengguna" />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic title="Total Perusahaan Aktif" value={compTotal} suffix=" Perusahaan" />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic title="Total Permintaan Dokumen" value={docReqTotal} suffix=" Dokumen" />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic title="Total Permintaan Dokumen Terpenuhi" value={stats.unfulfilled} suffix=" Dokumen" />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic title="Total Permintaan Dokumen Pending" value={stats.unfulfilled} suffix=" Dokumen" />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic title="Total Permintaan Dokumen Ditolak" value={stats.unfulfilled} suffix=" Dokumen" />
          </Card>
        </Col>

        <Col xs={12} sm={8}>
          <Card variant="outlined">
            <Statistic
              title="Kapasitas Penyimpanan"
              value={stats.unfulfilled}
              prefix={<ArrowDownOutlined />}
              suffix=" Dokumen"
            />
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default Dashboard;
