import { Button, Flex, Table, TableColumnsType, TableProps } from "antd";

export interface DataType {
  key: React.Key;
  id: string;
  name: string;
  document_created: number;
  document_finished: number;
}

export type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

export const columns: TableColumnsType<DataType> = [
  Table.SELECTION_COLUMN,
  { title: "Nama Kategori", dataIndex: "name" },
  { title: "Jumlah Dokumen Terbuat", dataIndex: "document_created" },
  { title: "Jumlah Dokumen Selesai", dataIndex: "document_finished" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <Flex gap={8} align="center" justify="center">
        <Button color="default" type="default">
          Edit
        </Button>
        <Button color="danger" variant="solid">
          Delete
        </Button>
      </Flex>
    ),
  },
];
