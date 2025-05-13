/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from '@/stores/AuthStore'
import { GetAllDocumentCategoryParams } from '@/utils/axios/docs/category'
import { Flex, Select } from 'antd'
import { memo } from 'react'

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
  const isAdmin = userInfo.profile.role === 'admin'

  const handleChange =
    <K extends keyof GetAllDocumentCategoryParams>(field: K) =>
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
    </Flex>
  )
}

export default memo(FilterDocsCategory)
