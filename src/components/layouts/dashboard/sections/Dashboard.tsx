/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useCallback, useMemo } from "react";
import { Row, Col, Card, Spin, message, Flex, Typography } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { useCompanyStore } from "@/stores/useCompanyStore";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import axiosInstance from "@/utils/axios";
import {
  CompanyApi,
  DocsCategoryApi,
  DocsRequestApi,
  UserApi,
} from "@/utils/axios/api-service";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { useDocsCategoryStore } from "@/stores/useDocsCategory";

interface DashboardClientProps {
  initialToken: string;
  isAdmin: boolean;
  currentUser: any;
}

const Dashboard: React.FC<DashboardClientProps> = ({
  initialToken,
  isAdmin,
  currentUser,
}) => {
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
    const fulfilledCount = docReqData.filter(
      (d: any) => d.status === "fulfilled",
    ).length;
    const totalCount = docReqData.length;
    const pct = totalCount ? (fulfilledCount / totalCount) * 100 : 0;
    return {
      fulfilled: fulfilledCount,
      unfulfilled: totalCount - fulfilledCount,
      pct: +pct.toFixed(2),
    };
  }, [docReqData]);

  if (compLoading || docReqLoading || usersLoading || docCatLoading) {
    return (
      <DashboardLayouts>
        <main className="h-screen w-full items-center justify-center">
          <Flex className="h-screen w-full" justify="center" align="center">
            <Spin />
          </Flex>
        </main>
      </DashboardLayouts>
    );
  }

  return (
    <DashboardLayouts>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Statistik & Analitik
      </Typography.Title>

      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card variant="outlined">
            <Flex align="center" justify="space-between" className="w-full">
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Total Pengguna Aktif
              </Typography.Title>
              <Typography.Link
                href=""
                className="hover:underline"
                style={{ marginTop: 0 }}
              >
                Lihat Semua
              </Typography.Link>
            </Flex>

            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {usersTotal} Pengguna
            </Typography.Title>

            <Flex vertical>
              <Typography.Paragraph
                className="font-medium"
                style={{ marginTop: 12, marginBottom: 4 }}
              >
                Detail Data Pengguna
              </Typography.Paragraph>

              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>Admin</Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Manager
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Client
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col span={12}>
          <Card variant="outlined">
            <Flex align="center" justify="space-between" className="w-full">
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Total Perusahaan Aktif
              </Typography.Title>
              <Typography.Link
                href=""
                className="hover:underline"
                style={{ marginTop: 0 }}
              >
                Lihat Semua
              </Typography.Link>
            </Flex>

            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {compTotal} Perusahaan
            </Typography.Title>

            <Flex vertical>
              <Typography.Paragraph
                className="font-medium"
                style={{ marginTop: 12, marginBottom: 4 }}
              >
                Detail Data Perusahaan
              </Typography.Paragraph>

              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>Admin</Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Manager
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Client
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col span={12}>
          <Card variant="outlined">
            <Flex align="center" justify="space-between" className="w-full">
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Total Permintaan Dokumen Aktif
              </Typography.Title>
              <Typography.Link
                href=""
                className="hover:underline"
                style={{ marginTop: 0 }}
              >
                Lihat Semua
              </Typography.Link>
            </Flex>

            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {docReqTotal} Permintaan
            </Typography.Title>

            <Flex vertical>
              <Typography.Paragraph
                className="font-medium"
                style={{ marginTop: 12, marginBottom: 4 }}
              >
                Detail Data Permintaan Dokumen
              </Typography.Paragraph>

              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Pending
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Uploaded
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Accepted
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Rejected
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Overdue
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col span={12}>
          <Card variant="outlined">
            <Flex align="center" justify="space-between" className="w-full">
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Total Kategori Dokumen
              </Typography.Title>
              <Typography.Link
                href=""
                className="hover:underline"
                style={{ marginTop: 0 }}
              >
                Lihat Semua
              </Typography.Link>
            </Flex>

            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {docCatTotal} Kategori
            </Typography.Title>

            <Flex vertical>
              <Typography.Paragraph
                className="font-medium"
                style={{ marginTop: 12, marginBottom: 4 }}
              >
                Detail Data Kategori Dokumen
              </Typography.Paragraph>

              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>Admin</Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Manager
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Client
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col span={12}>
          <Card variant="outlined">
            <Flex align="center" justify="space-between" className="w-full">
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Total Penyimpanan Dokumen
              </Typography.Title>
              <Typography.Link
                href=""
                className="hover:underline"
                style={{ marginTop: 0 }}
              >
                Lihat Semua
              </Typography.Link>
            </Flex>

            <Typography.Title level={3} style={{ marginTop: 0 }}>
              {docCatTotal} Kategori
            </Typography.Title>

            <Flex vertical>
              <Typography.Paragraph
                className="font-medium"
                style={{ marginTop: 12, marginBottom: 4 }}
              >
                Detail Data Kategori Dokumen
              </Typography.Paragraph>

              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>Admin</Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Manager
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
              <Flex align="center" justify="space-between" className="w-full">
                <Typography.Paragraph style={{ margin: 0 }}>
                  Client
                </Typography.Paragraph>
                <Typography.Link
                  href=""
                  className="hover:underline"
                  style={{ margin: 0 }}
                >
                  {usersTotal}
                </Typography.Link>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>
    </DashboardLayouts>
  );
};

export default Dashboard;
