/* eslint-disable @typescript-eslint/no-unused-vars */
import useAuthStore from '@/stores/AuthStore'
import { GetAllCompaniesParams } from '@/utils/axios/company'
import { Flex, Select } from 'antd'
import { memo, useCallback, useMemo } from 'react'

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
  const isAdmin = useMemo(() => userInfo?.profile?.role === 'admin', [userInfo])

  const handleChange = useCallback<
    <K extends keyof GetAllCompaniesParams>(
      field: K,
      val: GetAllCompaniesParams[K]
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
        placeholder="Filter Tahun Penugasan"
        style={{ minWidth: 120 }}
        options={options.year_of_assignment}
        value={filterValues.year_of_assignment}
        onChange={val => handleChange('year_of_assignment', val)}
        allowClear
      />
    </Flex>
  )
}

export default memo(FilterCompany)
