/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import dynamic from 'next/dynamic'
import { useEffect, useCallback, useMemo, useState, memo } from 'react'
import { Row, Col, Card, message, Flex, Typography, Skeleton } from 'antd'
import DashboardLayouts from '../../DashboardLayouts'
import { useCompanyStore } from '@/stores/useCompanyStore'
import { useDocsRequestStore } from '@/stores/useDocsRequestStore'
import axiosInstance from '@/utils/axios'
import {
  CompanyApi,
  DocsCategoryApi,
  DocsRequestApi,
  UserApi
} from '@/utils/axios/api-service'
import { useAllUsersStore } from '@/stores/useAllUsersStore'
import { useDocsCategoryStore } from '@/stores/useDocsCategory'
import dayjs from 'dayjs'
import { useBootstrapAuth } from '@/hooks/useBootstrapAuth'

const LoadingPage = dynamic(() => import('@/components/elements/LoadingPage'), {
  ssr: false,
  loading: () => <Skeleton active />
})

interface DashboardClientProps {
  initialToken: string
  isAdmin: boolean
  currentUser: any
}

const Dashboard: React.FC<DashboardClientProps> = ({
  initialToken,
  isAdmin,
  currentUser
}) => {
  const [mounted, setMounted] = useState(false)

  const {
    loading: compLoading,
    total: compTotal,
    setData: setCompData,
    setTotal: setCompTotal,
    setLoading: setCompLoading
  } = useCompanyStore()

  const {
    loading: docCatLoading,
    total: docCatTotal,
    setData: setDocCatData,
    setTotal: setDocCatTotal,
    setLoading: setDocCatLoading
  } = useDocsCategoryStore()

  const {
    loading: usersLoading,
    data: usersData,
    total: usersTotal,
    setData: setUsersData,
    setTotal: setUsersTotal,
    setLoading: setUsersLoading
  } = useAllUsersStore()

  const {
    loading: docReqLoading,
    data: docReqData,
    total: docReqTotal,
    setData: setDocReqData,
    setTotal: setDocReqTotal,
    setLoading: setDocReqLoading
  } = useDocsRequestStore()

  const loading = useMemo(
    () => [compLoading, usersLoading, docCatLoading, docReqLoading].some(Boolean),
    [compLoading, usersLoading, docCatLoading, docReqLoading]
  )

  const fetchData = useCallback(async () => {
    setCompLoading(true)
    setDocReqLoading(true)
    setUsersLoading(true)
    setDocCatLoading(true)

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${initialToken}`
    try {
      const [compRes, docReqRes, usersRes, docCatRes] = await Promise.all([
        CompanyApi.getAllCompanies({}, initialToken),
        DocsRequestApi.getDocsRequestStatusSummary(initialToken),
        UserApi.getAllUsers({}, initialToken),
        DocsCategoryApi.getAllDocsCategory({}, initialToken)
      ])

      const formattedCompanies = compRes.result.map((c: any) => ({
        ...c,
        key: c.id,
        start_audit_period: dayjs(c.start_audit_period).format('DD-MMMM-YYYY'),
        end_audit_period: dayjs(c.end_audit_period).format('DD-MMMM-YYYY')
      }))

      setCompData(formattedCompanies)
      setCompTotal(compRes.meta.totalItems)

      setDocReqData(docReqRes)

      setUsersData(usersRes.result)
      setUsersTotal(usersRes.meta.totalItems)

      setDocCatData(docCatRes.result)
      setDocCatTotal(docCatRes.meta.totalItems)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      message.error('Failed to fetch dashboard data.')
    } finally {
      setCompLoading(false)
      setDocReqLoading(false)
      setUsersLoading(false)
      setDocCatLoading(false)
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
    setUsersData,
    setUsersTotal,
    setDocCatData,
    setDocCatTotal
  ])

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

  const userRolesCount = useMemo(() => {
    const counts: Record<string, number> = {}
    usersData.forEach(u => {
      counts[u.profile.role] = (counts[u.profile.role] || 0) + 1
    })
    return Object.entries(counts).map(([label, count]) => ({ label, count }))
  }, [usersData])

  const docReqStatusCount = useMemo(() => {
    const counts: Record<string, number> = {}
    docReqData.forEach(d => {
      counts[d.status] = (counts[d.status] || 0) + 1
    })
    return Object.entries(counts).map(([label, count]) => ({ label, count }))
  }, [docReqData])

  if (!mounted) return <LoadingPage />

  return (
    <DashboardLayouts>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        {isAdmin ? 'Statistik & Analitik Perusahaan' : 'Statistik & Analitik Anda'}
      </Typography.Title>

      <Skeleton loading={loading} active>
        <Row gutter={[24, 24]}>
          {isAdmin && (
            <>
              <Col span={12}>
                <Flex vertical gap={24}>
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
                        <Typography.Paragraph style={{ margin: 0 }}>
                          Admin
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
                      {docReqData.reduce((sum, item) => sum + item.total!, 0)}{' '}
                      Permintaan
                    </Typography.Title>

                    <Flex vertical>
                      <Typography.Paragraph
                        className="font-medium"
                        style={{ marginTop: 12, marginBottom: 4 }}
                      >
                        Detail Data Permintaan Dokumen
                      </Typography.Paragraph>

                      {docReqData.map((item, index) => {
                        return (
                          <Flex
                            key={index}
                            align="center"
                            justify="space-between"
                            className="w-full"
                          >
                            <Typography.Paragraph
                              style={{ margin: 0 }}
                              className="capitalize"
                            >
                              {item.status}
                            </Typography.Paragraph>
                            <Typography.Link
                              href=""
                              className="hover:underline"
                              style={{ margin: 0 }}
                            >
                              {item.total}
                            </Typography.Link>
                          </Flex>
                        )
                      })}
                    </Flex>
                  </Card>

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
                        <Typography.Paragraph style={{ margin: 0 }}>
                          Admin
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
                </Flex>
              </Col>

              <Col span={12}>
                <Flex vertical gap={24}>
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
                        <Typography.Paragraph style={{ margin: 0 }}>
                          Admin
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
                        <Typography.Paragraph style={{ margin: 0 }}>
                          Admin
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
                </Flex>
              </Col>
            </>
          )}
        </Row>
      </Skeleton>
    </DashboardLayouts>
  )
}

export default memo(Dashboard)
