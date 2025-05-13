/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'antd'
import { useDocsRequestStore } from '@/stores/useDocsRequestStore'
import { columns as baseColumns } from '../utils/table'
import { memo, useMemo } from 'react'
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
  const isAdmin = userInfo.profile.role === 'admin'

  const onSelectChange = (newKeys: React.Key[]) => setSelectedRowKeys(newKeys)

  const columns = useMemo(() => baseColumns(openModal, isAdmin), [isAdmin, openModal])

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
        onChange: (page, size) => {
          setCurrent(page)
          setPageSize(size || pageSize)
          fetchData()
        },
        position: ['bottomCenter']
      }}
    />
  )
}

export default memo(DocsRequestTable)
