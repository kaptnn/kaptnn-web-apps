/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Flex } from "antd";
import { useDocsRequestStore } from "@/stores/useDocsRequestStore";
import { columns as baseColumns, DataType } from "../utils/table";

const DocsRequestTable = ({ token }: { token: string }) => {
  const {
    data,
    loading,
    modalType,
    total,
    current,
    pageSize,
    selectedRowKeys,
    setSelectedRowKeys,
    setCurrent,
    setPageSize,
    setOpen,
    setModalType,
    setSelectedCompany,
  } = useDocsRequestStore();

  const onSelectChange = (newKeys: React.Key[]) => setSelectedRowKeys(newKeys);

  const openModal = (type: typeof modalType, company?: DataType) => {
    setSelectedCompany(company || null);
    setModalType(type);
    setOpen(true);
  };

  const columns = baseColumns.map((col) =>
    col.key === "x"
      ? {
          ...col,
          render: (_: any, record: DataType) => (
            <Flex gap={8} justify="center">
              <Button type="primary" onClick={() => openModal("view", record)}>
                View
              </Button>
              <Button onClick={() => openModal("edit", record)}>Edit</Button>
              <Button
                type="primary"
                danger
                onClick={() => openModal("delete", record)}
              >
                Delete
              </Button>
            </Flex>
          ),
        }
      : col
  );

  return (
    <Table
      rowKey="id"
      bordered
      className="rounded-lg"
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
        },
        position: ["bottomCenter"],
      }}
    />
  );
};

export default DocsRequestTable;
