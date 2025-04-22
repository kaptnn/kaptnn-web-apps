import { Button, Flex, Table, TableColumnsType, TableProps, Tag } from "antd";

export interface DataType {
  key: React.Key;
  id: string;
  company_name: string;
  year_of_assignment: number;
  start_audit_period: string;
  end_audit_period: string;
}

export type TableRowSelection<T extends object = object> = TableProps<T>["rowSelection"];

export const columns: TableColumnsType<DataType> = [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  { title: "Company Name", dataIndex: "company_name" },
  {
    title: "Tahun Penugasan",
    dataIndex: "year_of_assignment",
    render: (item: number) => (
      <Flex align="center" justify="center">
        <Tag>{item}</Tag>
      </Flex>
    ),
  },
  { title: "Mulai Periode Audit", dataIndex: "start_audit_period" },
  { title: "Akhir Periode Audit", dataIndex: "end_audit_period" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <Flex gap={8} align="center" justify="center">
        <Button color="primary" variant="solid" onClick={() => {}}>
          View
        </Button>
        <Button color="default" type="default" onClick={() => {}}>
          Edit
        </Button>
        <Button color="danger" variant="solid" onClick={() => {}}>
          Delete
        </Button>
      </Flex>
    ),
  },
];
