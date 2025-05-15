import useAuthStore from '@/stores/AuthStore'
import { GetAllUsersParams } from '@/utils/axios/user'
import { Flex, Select } from 'antd'
import { memo, useCallback, useMemo } from 'react'

export interface FilterOptions {
  companies: { value: string; label: string }[]
}

interface FilterComponentProps {
  filterValues: GetAllUsersParams
  onFilterChange: (filters: GetAllUsersParams) => void
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

const FilterAllUsers: React.FC<FilterComponentProps> = ({
  filterValues,
  onFilterChange,
  options
}) => {
  const { userInfo } = useAuthStore()
  const isAdmin = useMemo(() => userInfo?.profile?.role === 'admin', [userInfo])

  const handleChange = useCallback<
    <K extends keyof GetAllUsersParams>(field: K, val: GetAllUsersParams[K]) => void
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

      {isAdmin && (
        <Select
          placeholder="Filter Target User"
          style={{ minWidth: 120 }}
          options={options.companies}
          value={filterValues.company_id}
          onChange={val => handleChange('company_id', val)}
          allowClear
        />
      )}
    </Flex>
  )
}

export default memo(FilterAllUsers)
