/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from '@/stores/AuthStore'
import { GetAllCompaniesParams } from '@/utils/axios/company'
import { Flex, Select } from 'antd'
import { memo } from 'react'

export interface FilterOptions {
  year_of_assignment: { value: number; label: number }[]
}

interface FilterComponentProps {
  filterValues: GetAllCompaniesParams
  onFilterChange: (filters: GetAllCompaniesParams) => void
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

const FilterCompany: React.FC<FilterComponentProps> = ({
  filterValues,
  onFilterChange,
  options
}) => {
  const { userInfo } = useAuthStore()
  const isAdmin = userInfo.profile.role === 'admin'

  const handleChange =
    <K extends keyof GetAllCompaniesParams>(field: K) =>
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
        options={options.year_of_assignment}
        value={filterValues.year_of_assignmenet}
        onChange={handleChange('year_of_assignmenet')}
        allowClear
      />
    </Flex>
  )
}

export default memo(FilterCompany)
