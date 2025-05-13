/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from '@/stores/AuthStore'
import { GetAllDocumentRequestParams } from '@/utils/axios/docs/request'
import { Flex, Select } from 'antd'
import { memo } from 'react'

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
  const isAdmin = userInfo.profile.role === 'admin'

  const handleChange =
    <K extends keyof GetAllDocumentRequestParams>(field: K) =>
    (value: any) => {
      onFilterChange({ ...filterValues, [field]: value })
    }

  return (
    <Flex className="w-full" align="center" gap={12} wrap>
      <Select
        placeholder="Sort By"
        style={{ minWidth: 120 }}
        options={sortOptions}
        value={filterValues.sort}
        onChange={handleChange('sort')}
        allowClear
      />

      <Select
        placeholder="Order"
        style={{ minWidth: 120 }}
        options={orderOptions}
        value={filterValues.order}
        onChange={handleChange('order')}
        allowClear
      />

      <Select
        placeholder="Filter Status"
        style={{ minWidth: 120 }}
        options={options.statuses}
        value={filterValues.status}
        onChange={handleChange('status')}
        allowClear
      />

      <Select
        placeholder="Filter Admin"
        style={{ minWidth: 120 }}
        options={options.admins}
        value={filterValues.admin_id}
        onChange={handleChange('admin_id')}
        allowClear
      />

      {isAdmin && (
        <Select
          placeholder="Filter Target User"
          style={{ minWidth: 120 }}
          options={options.targetUsers}
          value={filterValues.target_user_id}
          onChange={handleChange('target_user_id')}
          allowClear
        />
      )}

      <Select
        placeholder="Filter Category"
        style={{ minWidth: 120 }}
        options={options.categories}
        value={filterValues.category_id}
        onChange={handleChange('category_id')}
        allowClear
      />
    </Flex>
  )
}

export default memo(FilterDocsRequest)
