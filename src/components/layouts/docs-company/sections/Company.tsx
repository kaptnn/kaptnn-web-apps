/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useCallback, useState, useMemo, memo } from 'react'
import { Input, Button, Flex, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import CompanyTable from './TableCompany'
import CompanyModals from './ModalCompany'
import DashboardLayouts from '../../DashboardLayouts'
import { useCompanyStore } from '@/stores/useCompanyStore'
import { DataType } from '../utils/table'
import { CompanyApi } from '@/utils/axios/api-service'
import type { GetProps } from 'antd'
import { GetAllCompaniesParams } from '@/utils/axios/company'
import { debounce } from 'lodash'
import FilterCompany, { FilterOptions } from './FilterCompany'
import dayjs from 'dayjs'

type SearchProps = GetProps<typeof Input.Search>

interface CompanyClientProps {
  initialToken: string
  isAdmin: boolean
  currentUser: any
}

const { Search } = Input

const Company: React.FC<CompanyClientProps> = ({
  initialToken,
  isAdmin,
  currentUser
}) => {
  const {
    pageSize,
    current,
    filters,
    data,
    setData,
    setLoading,
    setCurrent,
    setTotal,
    setFilters,
    openModal
  } = useCompanyStore()

  const [searchTerm, setSearchTerm] = useState('')

  const options: FilterOptions = useMemo(() => {
    const uniqueYears = Array.from(new Set(data.map(cat => cat.year_of_assignment)))

    const sortedYears = uniqueYears
      .filter((y): y is number => typeof y === 'number')
      .sort((a, b) => a - b)

    return {
      year_of_assignment: sortedYears.map(year => ({
        value: year,
        label: year
      }))
    }
  }, [data])

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const params: GetAllCompaniesParams = {
        page: current,
        limit: pageSize,
        sort: filters.sort,
        order: filters.order,
        name: searchTerm || undefined,
        year_of_assignment: filters.year_of_assignment || undefined
      }

      const response = await CompanyApi.getAllCompanies(params, initialToken)

      const formatted: DataType[] = response.result.map((c: DataType) => ({
        ...c,
        key: c.id,
        start_audit_period: dayjs(c.start_audit_period).format('DD-MMMM-YYYY'),
        end_audit_period: dayjs(c.end_audit_period).format('DD-MMMM-YYYY')
      }))

      setData(formatted)
      setTotal(response.meta.totalItems)
    } catch (err) {
      console.error(err)
      message.error('Failed to fetch companies.')
    } finally {
      setLoading(false)
    }
  }, [
    setLoading,
    current,
    pageSize,
    filters.sort,
    filters.order,
    filters.year_of_assignment,
    searchTerm,
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
    fetchCompanies()
  }, [fetchCompanies])

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

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Search
              placeholder="Cari Nama Perusahaan"
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
                Tambah Perusahaan
              </Button>
            )}
          </Flex>
        </Flex>
        <FilterCompany
          filterValues={{ ...filters }}
          onFilterChange={handleFilterChange}
          options={options}
        />
        <CompanyTable token={initialToken} fetchData={fetchCompanies} />
        <CompanyModals token={initialToken} />
      </Flex>
    </DashboardLayouts>
  )
}

export default memo(Company)
