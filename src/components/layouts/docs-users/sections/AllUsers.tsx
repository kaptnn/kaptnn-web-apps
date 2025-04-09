/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button, Flex, Input, Select, SelectProps, Table } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { TableRowSelection, columns, DataType } from "../utils/table";

const { Search } = Input;

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const AllUsers = ({ users = [], company = [] }) => {
  console.log(users);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center" gap={16} className="w-3/5">
            <Search placeholder="Search" loading={false} enterButton />
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%" }}
              placeholder="Pilih Perusahaan"
              onChange={handleChange}
              options={company}
            />
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%" }}
              placeholder="Pilih Role"
              onChange={handleChange}
              options={options}
            />
            <Select
              mode="multiple"
              allowClear
              style={{ width: "50%" }}
              placeholder="Pilih Membership"
              onChange={handleChange}
              options={options}
            />
          </Flex>
          <Flex align="center">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showLoading}
            >
              Add New Company
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Flex>
        </Flex>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={users}
          expandable={{
            expandedRowRender: (item) => <Flex>{item.email}</Flex>,
            rowExpandable: (item) => item.email !== "Not Expandable",
          }}
          className="rounded-lg"
          bordered
          pagination={{
            align: "center",
            style: { marginTop: "32px" },
            position: ["bottomCenter"],
          }}
        />
      </Flex>
    </DashboardLayouts>
  );
};

export default AllUsers;
