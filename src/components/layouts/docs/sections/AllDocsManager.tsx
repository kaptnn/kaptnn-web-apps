/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import DashboardLayouts from '../../DashboardLayouts'
import { Input, Button, Flex, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DocsRequestTable from './TableDocsRequest'
import DocsRequestModals from './ModalDocsRequest'
import { useDocsRequestStore } from '@/stores/useDocsRequestStore'
import { DocsRequestApi } from '@/utils/axios/api-service'
import { DataType } from '../utils/table'
import FilterDocsRequest, { FilterOptions } from './FilterDocsRequest'
import debounce from 'lodash/debounce'
import { useAllUsersStore } from '@/stores/useAllUsersStore'
import { useDocsCategoryStore } from '@/stores/useDocsCategory'
import { GetAllDocumentRequestParams } from '@/utils/axios/docs/request'
import type { GetProps } from 'antd'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'

const LoadingPage = dynamic(() => import('@/components/elements/LoadingPage'), {
  ssr: false,
  loading: () => (
    <main role="status" aria-live="polite" className="h-screen w-full bg-white">
      Loading...
    </main>
  )
})

type SearchProps = GetProps<typeof Input.Search>

const { Search } = Input

interface DocsReqClientProps {
  initialToken: string
  isAdmin: boolean
  currentUser: any
}

const AllDocsManager: React.FC<DocsReqClientProps> = ({
  initialToken,
  isAdmin,
  currentUser
}) => {
  const {
    pageSize,
    current,
    filters,
    setData,
    setLoading,
    setCurrent,
    setTotal,
    setFilters,
    openModal
  } = useDocsRequestStore()

  const { data: users } = useAllUsersStore()
  const { data: categories } = useDocsCategoryStore()

  const [searchTerm, setSearchTerm] = useState<string>(filters.name || '')
  const [mounted, setMounted] = useState(false)

  const options: FilterOptions = useMemo(
    () => ({
      statuses: [
        { value: 'pending', label: 'Pending' },
        { value: 'uploaded', label: 'Uploaded' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'overdue', label: 'Overdue' }
      ],
      admins: users
        .filter(u => u.profile.role === 'admin')
        .map(u => ({ value: u.id, label: u.name })),
      targetUsers: users.map(u => ({ value: u.id, label: u.name })),
      categories: categories.map(cat => ({ value: cat.id, label: cat.name }))
    }),
    [users, categories]
  )

  const fetchDocumentRequest = useCallback(async () => {
    setLoading(true)
    try {
      const params: GetAllDocumentRequestParams = {
        page: current,
        limit: pageSize,
        sort: filters.sort,
        order: filters.order,
        name: searchTerm || undefined,
        status: filters.status || undefined,
        admin_id: filters.admin_id || undefined,
        target_user_id: isAdmin ? filters.target_user_id || undefined : currentUser.id,
        category_id: filters.category_id || undefined
      }

      const response = await DocsRequestApi.getAllDocsRequest(params, initialToken)

      const formatted: DataType[] = response.result.map((item: DataType) => ({
        ...item,
        key: item.id,
        due_date: item?.due_date ? dayjs(item.due_date).format('DD-MMMM-YYYY') : '-',
        upload_date: item?.upload_date
          ? dayjs(item.upload_date).format('DD-MMMM-YYYY')
          : '-'
      }))

      setData(formatted)
      setTotal(response.meta.totalItems)
    } catch (err) {
      console.error(err)
      message.error('Failed to fetch document requests.')
    } finally {
      setLoading(false)
    }
  }, [
    setLoading,
    current,
    pageSize,
    filters.sort,
    filters.order,
    filters.status,
    filters.admin_id,
    filters.target_user_id,
    filters.category_id,
    searchTerm,
    isAdmin,
    currentUser.id,
    initialToken,
    setData,
    setTotal
  ])

  const debouncedSetSearchFilter = useMemo(
    () =>
      debounce((value: string) => {
        setFilters({ ...filters, name: value })
        setCurrent(1)
      }, 500),
    [filters, setFilters, setCurrent]
  )

  useEffect(() => {
    setMounted(true)
    fetchDocumentRequest()
  }, [fetchDocumentRequest])

  const handleSearchInputChange: SearchProps['onChange'] = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSetSearchFilter(value)
  }

  const onSearch: SearchProps['onSearch'] = (value: string) => {
    setFilters({ ...filters, name: value })
    setSearchTerm(value)
    setCurrent(1)
  }

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters)
    setCurrent(1)
  }

  if (!mounted) return <LoadingPage />

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Search
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onSearch={onSearch}
              enterButton
              allowClear
            />
          </Flex>
          <Flex align="center">
            {isAdmin && (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => openModal('create')}
              >
                Tambah Permintaan Dokumen
              </Button>
            )}
          </Flex>
        </Flex>
        <FilterDocsRequest
          filterValues={{ ...filters }}
          onFilterChange={handleFilterChange}
          options={options}
        />
        <DocsRequestTable token={initialToken} fetchData={fetchDocumentRequest} />
        <DocsRequestModals token={initialToken} />
      </Flex>
    </DashboardLayouts>
  )
}

export default memo(AllDocsManager)
