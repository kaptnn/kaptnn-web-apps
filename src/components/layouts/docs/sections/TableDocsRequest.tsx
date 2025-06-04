/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'antd'
import { useDocsRequestStore } from '@/stores/useDocsRequestStore'
import { columns as baseColumns } from '../utils/table'
import { memo, useCallback, useMemo } from 'react'
import useAuthStore from '@/stores/AuthStore'

interface TableComponentProps {
  token: string
  fetchData: () => void
}

const DocsRequestTable: React.FC<TableComponentProps> = ({ token, fetchData }) => {
  const {
    data,
    loading,
    total,
    current,
    pageSize,
    selectedRowKeys,
    setSelectedRowKeys,
    setCurrent,
    setPageSize,
    openModal
  } = useDocsRequestStore()

  const { userInfo } = useAuthStore()
  const isAdmin = useMemo(() => userInfo?.profile?.role === 'admin', [userInfo])

  const columns = useMemo(() => baseColumns(openModal, isAdmin), [isAdmin, openModal])

  const onSelectChange = useCallback(
    (newKeys: React.Key[]) => {
      setSelectedRowKeys(newKeys)
    },
    [setSelectedRowKeys]
  )

  const onPaginationChange = useCallback(
    (page: number, size?: number) => {
      setCurrent(page)
      setPageSize(size ?? pageSize)
      fetchData()
    },
    [setCurrent, setPageSize, fetchData, pageSize]
  )

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={columns}
      rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPaginationChange,
        position: ['bottomCenter']
      }}
    />
  )
}

export default memo(DocsRequestTable)
