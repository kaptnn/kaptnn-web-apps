/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button, Flex, Input, message } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAllUsersStore } from "@/stores/useAllUsersStore";
import { UserApi } from "@/utils/axios/api-service";
import { DataType } from "../utils/table";
import type { GetProps } from "antd";
import { GetAllUsersParams } from "@/utils/axios/user";
import FilterAllUsers, { FilterOptions } from "./FilterAllUsers";
import { debounce } from "lodash";
import TableAllUsers from "./TableAllUsers";
import ModalAllUsers from "./ModalAllUsers";
import { useCompanyStore } from "@/stores/useCompanyStore";

type SearchProps = GetProps<typeof Input.Search>;

interface AllUsersClientProps {
  initialToken: string;
  isAdmin: boolean;
  currentUser: any;
}

const AllUsers: React.FC<AllUsersClientProps> = ({
  initialToken,
  isAdmin,
  currentUser,
}) => {
  const {
    pageSize,
    current,
    loading,
    filters,
    data,
    setData,
    setLoading,
    setCurrent,
    setTotal,
    setFilters,
    openModal,
  } = useAllUsersStore();

  const { data: dataComps } = useCompanyStore();

  const companyMap = useMemo(() => {
    return new Map((dataComps || []).map((comp) => [comp.id, comp.company_name]));
  }, [dataComps]);

  const [searchTerm, setSearchTerm] = useState<string>(filters.name || "");

  const options: FilterOptions = useMemo(
    () => ({
      companies: dataComps.map((cat) => ({ value: cat.id, label: cat.company_name })),
    }),
    [dataComps],
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetAllUsersParams = {
        page: current,
        limit: pageSize,
        sort: filters.sort,
        order: filters.order,
        name: searchTerm || undefined,
        email: filters.email,
        company_id: isAdmin ? filters.company_id : currentUser?.company_id,
      };

      const response = await UserApi.getAllUsers(params, initialToken);

      const formatted: DataType[] = response.result.map((c: DataType) => ({
        ...c,
        key: c.id,
        company_name: companyMap.get(c.company_id) || "Unknown",
      }));

      setData(formatted);
      setTotal(response.meta.totalItems);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch companies.");
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    current,
    pageSize,
    filters.sort,
    filters.order,
    filters.email,
    filters.company_id,
    searchTerm,
    isAdmin,
    currentUser?.company_id,
    initialToken,
    setData,
    setTotal,
    companyMap,
  ]);

  const debouncedFetch = useMemo(() => debounce(() => fetchUsers(), 500), [fetchUsers]);

  useEffect(() => {
    debouncedFetch();
    return debouncedFetch.cancel;
  }, [debouncedFetch]);

  const onSearch: SearchProps["onSearch"] = (value: string, _e, info) => {
    setFilters({ ...filters, name: value });
    setSearchTerm(value);
    setCurrent(1);
  };

  const debouncedSetSearchFilter = useMemo(
    () =>
      debounce((value: string) => {
        setFilters({ ...filters, name: value });
        setCurrent(1);
      }, 500),
    [filters, setFilters, setCurrent],
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetSearchFilter(value);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
    setCurrent(1);
  };

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Input.Search
              placeholder="Search"
              value={searchTerm}
              onSearch={onSearch}
              onChange={handleSearchInputChange}
              loading={false}
              enterButton
              allowClear
            />
          </Flex>
          <Flex align="center">
            <FilterAllUsers
              filterValues={{ ...filters }}
              onFilterChange={handleFilterChange}
              options={options}
            />
          </Flex>
        </Flex>
        <TableAllUsers token={initialToken} fetchData={fetchUsers} />
        <ModalAllUsers token={initialToken} />
      </Flex>
    </DashboardLayouts>
  );
};

export default AllUsers;
