/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'antd'
import { useCompanyStore } from '@/stores/useCompanyStore'
import { columns as baseColumns } from '../utils/table'
import { memo, useCallback, useMemo } from 'react'

interface TableComponentProps {
  token: string
  fetchData: () => void
}

const CompanyTable: React.FC<TableComponentProps> = ({ token, fetchData }) => {
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
  } = useCompanyStore()

  const columns = useMemo(() => baseColumns(openModal), [openModal])

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

export default memo(CompanyTable)
