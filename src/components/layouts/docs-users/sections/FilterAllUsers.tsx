/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuthStore from "@/stores/AuthStore";
import { GetAllUsersParams } from "@/utils/axios/user";
import { Flex, Select } from "antd";
import { memo } from "react";

export interface FilterOptions {
  companies: { value: string; label: string }[];
}

interface FilterComponentProps {
  filterValues: GetAllUsersParams;
  onFilterChange: (filters: GetAllUsersParams) => void;
  options: FilterOptions;
}

const sortOptions = [
  { value: "created_at", label: "Created At" },
  { value: "due_date", label: "Due Date" },
];

const orderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const FilterAllUsers: React.FC<FilterComponentProps> = ({
  filterValues,
  onFilterChange,
  options,
}) => {
  const { userInfo } = useAuthStore();
  const isAdmin = userInfo.profile.role === "admin";

  const handleChange =
    <K extends keyof GetAllUsersParams>(field: K) =>
    (value: any) => {
      onFilterChange({ ...filterValues, [field]: value });
    };

  return (
    <Flex className="w-full" align="center" gap={12} wrap>
      <Select
        placeholder="Sort By"
        style={{ minWidth: 120 }}
        options={sortOptions}
        value={filterValues.sort}
        onChange={handleChange("sort")}
        allowClear
      />

      <Select
        placeholder="Order"
        style={{ minWidth: 120 }}
        options={orderOptions}
        value={filterValues.order}
        onChange={handleChange("order")}
        allowClear
      />

      {isAdmin && (
        <Select
          placeholder="Filter Target User"
          style={{ minWidth: 120 }}
          options={options.companies}
          value={filterValues.company_id}
          onChange={handleChange("company_id")}
          allowClear
        />
      )}
    </Flex>
  );
};

export default memo(FilterAllUsers);
