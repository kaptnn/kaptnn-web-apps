import useAuthStore from '@/stores/AuthStore'
import { GetAllDocumentRequestParams } from '@/utils/axios/docs/request'
import { Flex, Select } from 'antd'
import { memo, useCallback, useMemo } from 'react'

export interface FilterOptions {
  statuses: { value: string; label: string }[]
  admins: { value: string; label: string }[]
  targetUsers: { value: string; label: string }[]
  categories: { value: string; label: string }[]
}

interface FilterComponentProps {
  filterValues: GetAllDocumentRequestParams
  onFilterChange: (filters: GetAllDocumentRequestParams) => void
  options: FilterOptions
}

const sortOptions = [
  { value: 'created_at', label: 'Created At' },
  { value: 'due_date', label: 'Due Date' }
]

const orderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
]

const FilterDocsRequest: React.FC<FilterComponentProps> = ({
  filterValues,
  onFilterChange,
  options
}) => {
  const { userInfo } = useAuthStore()
  const isAdmin = useMemo(() => userInfo?.profile?.role === 'admin', [userInfo])

  const handleChange = useCallback<
    <K extends keyof GetAllDocumentRequestParams>(
      field: K,
      val: GetAllDocumentRequestParams[K]
    ) => void
  >(
    (field, val) => {
      onFilterChange({ ...filterValues, [field]: val })
    },
    [filterValues, onFilterChange]
  )

  return (
    <Flex className="w-full" align="center" gap={12} wrap>
      <Select
        placeholder="Sort By"
        style={{ minWidth: 120 }}
        options={sortOptions}
        value={filterValues.sort}
        onChange={val => handleChange('sort', val)}
        allowClear
      />

      <Select
        placeholder="Order"
        style={{ minWidth: 120 }}
        options={orderOptions}
        value={filterValues.order}
        onChange={val => handleChange('order', val)}
        allowClear
      />

      <Select
        placeholder="Filter Status"
        style={{ minWidth: 120 }}
        options={options.statuses}
        value={filterValues.status}
        onChange={val => handleChange('status', val)}
        allowClear
      />

      <Select
        placeholder="Filter Admin"
        style={{ minWidth: 120 }}
        options={options.admins}
        value={filterValues.admin_id}
        onChange={val => handleChange('admin_id', val)}
        allowClear
      />

      {isAdmin && (
        <Select
          placeholder="Filter Target User"
          style={{ minWidth: 120 }}
          options={options.targetUsers}
          value={filterValues.target_user_id}
          onChange={val => handleChange('target_user_id', val)}
          allowClear
        />
      )}

      <Select
        placeholder="Filter Category"
        style={{ minWidth: 120 }}
        options={options.categories}
        value={filterValues.category_id}
        onChange={val => handleChange('category_id', val)}
        allowClear
      />
    </Flex>
  )
}

export default memo(FilterDocsRequest)
