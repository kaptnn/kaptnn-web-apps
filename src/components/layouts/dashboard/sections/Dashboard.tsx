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
import { useSummaryDataStore } from '@/stores/useSummaryData'

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

  const {
    userRoleCountData,
    docsReqStatusData,
    docsCatTotalData,
    companyUserCountData,
    setUserRoleCountData,
    setdocsReqStatusData,
    setdocsCatTotalData,
    setCompanyUserCountData
  } = useSummaryDataStore()

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
        CompanyApi.getCompanyUserCount(initialToken),
        DocsRequestApi.getDocsRequestStatusSummary(initialToken),
        UserApi.getUserProfileRoleCount(initialToken),
        DocsCategoryApi.getDocsCategoryCount(initialToken)
      ])

      setCompanyUserCountData(compRes)
      setdocsReqStatusData(docReqRes)
      setUserRoleCountData(usersRes)
      setdocsCatTotalData(docCatRes)
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
    setCompanyUserCountData,
    setdocsReqStatusData,
    setUserRoleCountData,
    setdocsCatTotalData
  ])

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [fetchData])

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
                        href="/dashboard/document/users"
                        className="hover:underline"
                        style={{ marginTop: 0 }}
                      >
                        Lihat Semua
                      </Typography.Link>
                    </Flex>

                    <Typography.Title level={3} style={{ marginTop: 0 }}>
                      {userRoleCountData?.reduce((sum, item) => sum + item.total!, 0)}{' '}
                      Pengguna
                    </Typography.Title>

                    <Flex vertical>
                      <Typography.Paragraph
                        className="font-medium"
                        style={{ marginTop: 12, marginBottom: 4 }}
                      >
                        Detail Data Pengguna
                      </Typography.Paragraph>
                      {userRoleCountData?.map((item, index) => {
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
                              {item.name}
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
                        Total Permintaan Dokumen Aktif
                      </Typography.Title>
                      <Typography.Link
                        href="/dashboard/document"
                        className="hover:underline"
                        style={{ marginTop: 0 }}
                      >
                        Lihat Semua
                      </Typography.Link>
                    </Flex>

                    <Typography.Title level={3} style={{ marginTop: 0 }}>
                      {docsReqStatusData.reduce((sum, item) => sum + item.total!, 0)}{' '}
                      Permintaan
                    </Typography.Title>

                    <Flex vertical>
                      <Typography.Paragraph
                        className="font-medium"
                        style={{ marginTop: 12, marginBottom: 4 }}
                      >
                        Detail Data Permintaan Dokumen
                      </Typography.Paragraph>

                      {docsReqStatusData.map((item, index) => {
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
                              {item.name}
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
                        href="/dashboard/document/category"
                        className="hover:underline"
                        style={{ marginTop: 0 }}
                      >
                        Lihat Semua
                      </Typography.Link>
                    </Flex>

                    <Typography.Title level={3} style={{ marginTop: 0 }}>
                      {companyUserCountData?.reduce(
                        (sum, item) => sum + item.total!,
                        0
                      )}{' '}
                      Perusahaan
                    </Typography.Title>

                    <Flex vertical>
                      <Typography.Paragraph
                        className="font-medium"
                        style={{ marginTop: 12, marginBottom: 4 }}
                      >
                        Detail Data Kategori Dokumen
                      </Typography.Paragraph>

                      {companyUserCountData.map((item, index) => {
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
                              {item.name}
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
                        Total Kategori Dokumen
                      </Typography.Title>
                      <Typography.Link
                        href="/dashboard/document/company"
                        className="hover:underline"
                        style={{ marginTop: 0 }}
                      >
                        Lihat Semua
                      </Typography.Link>
                    </Flex>

                    <Typography.Title level={3} style={{ marginTop: 0 }}>
                      {docsCatTotalData?.reduce((sum, item) => sum + item.total!, 0)}{' '}
                      Kategori
                    </Typography.Title>

                    <Flex vertical>
                      <Typography.Paragraph
                        className="font-medium"
                        style={{ marginTop: 12, marginBottom: 4 }}
                      >
                        Detail Data Kategori Dokumen
                      </Typography.Paragraph>

                      {docsCatTotalData.map((item, index) => {
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
                              {item.name}
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
