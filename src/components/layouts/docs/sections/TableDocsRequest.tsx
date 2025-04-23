/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from "antd";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import { columns as baseColumns } from "../utils/table";
import React, { useMemo } from "react";

interface TableComponentProps {
  token: string;
  fetchData: () => void;
}

const DocsRequestTable: React.FC<TableComponentProps> = ({ token, fetchData }) => {
  const {
    data,
    loading,
    total,
    current,
    pageSize,
    selectedRowKeys,
    setSelectedRowKeys,
    setCurrent,
    setPageSize,
    openModal,
  } = useDocsRequestStore();

  const onSelectChange = (newKeys: React.Key[]) => setSelectedRowKeys(newKeys);

  const columns = useMemo(() => baseColumns(openModal), [openModal]);

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={columns}
      rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: (page, size) => {
          setCurrent(page);
          setPageSize(size || pageSize);
          fetchData();
        },
        position: ["bottomCenter"],
      }}
    />
  );
};

export default React.memo(DocsRequestTable);
