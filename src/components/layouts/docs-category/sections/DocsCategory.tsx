/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Flex, Input, message } from "antd";
import type { GetProps } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataType } from "../utils/table";
import { DocsCategoryApi } from "@/utils/axios/api-service";
import { useDocsCategoryStore } from "@/stores/useDocsCategory";
import DocsCategoryTable from "./TableDocsCategory";
import DocsCategoryModals from "./ModalDocsCategory";
import FilterDocsCategory from "./FilterDocsCategory";
import { debounce } from "lodash";
import { GetAllDocumentCategoryParams } from "@/utils/axios/docs/category";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

interface DocsCategoryClientProps {
  initialToken: string;
  isAdmin: boolean;
  currentUser: any;
}

const DocsCategory: React.FC<DocsCategoryClientProps> = ({
  initialToken,
  isAdmin,
  currentUser,
}) => {
  const {
    pageSize,
    current,
    loading,
    filters,
    setData,
    setLoading,
    setCurrent,
    setTotal,
    openModal,
    setFilters,
  } = useDocsCategoryStore();
  const [searchTerm, setSearchTerm] = useState<string>(filters.name || "");

  const fetchDocumentCategory = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetAllDocumentCategoryParams = {
        page: current,
        limit: pageSize,
        sort: filters.sort,
        order: filters.order,
        name: searchTerm || undefined,
      };

      const response = await DocsCategoryApi.getAllDocsCategory(params, initialToken);

      const formatted: DataType[] = response.result.map((item: DataType) => ({
        ...item,
        key: item.id,
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
    searchTerm,
    initialToken,
    setData,
    setTotal,
  ]);

  const debouncedFetch = useMemo(
    () => debounce(() => fetchDocumentCategory(), 500),
    [fetchDocumentCategory],
  );

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
            <Search
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
            {isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                loading={loading}
                onClick={() => openModal("create")}
              >
                Tambah Kategori
              </Button>
            )}
          </Flex>
        </Flex>
        <FilterDocsCategory
          filterValues={{ ...filters }}
          onFilterChange={handleFilterChange}
        />
        <DocsCategoryTable token={initialToken} fetchData={fetchDocumentCategory} />
        <DocsCategoryModals token={initialToken} />
      </Flex>
    </DashboardLayouts>
  );
};

export default DocsCategory;
