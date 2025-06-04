/* eslint-disable @typescript-eslint/no-unused-vars */
import useAuthStore from '@/stores/AuthStore'
import { GetAllDocumentCategoryParams } from '@/utils/axios/docs/category'
import { Flex, Select } from 'antd'
import { memo, useCallback, useMemo } from 'react'

interface FilterComponentProps {
  filterValues: GetAllDocumentCategoryParams
  onFilterChange: (filters: GetAllDocumentCategoryParams) => void
}

const sortOptions = [
  { value: 'created_at', label: 'Created At' },
  { value: 'due_date', label: 'Due Date' }
]

const orderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
]

const FilterDocsCategory: React.FC<FilterComponentProps> = ({
  filterValues,
  onFilterChange
}) => {
  const { userInfo } = useAuthStore()
  const isAdmin = useMemo(() => userInfo?.profile?.role === 'admin', [userInfo])

  const handleChange = useCallback<
    <K extends keyof GetAllDocumentCategoryParams>(
      field: K,
      val: GetAllDocumentCategoryParams[K]
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
    </Flex>
  )
}

export default memo(FilterDocsCategory)
