import { Button, Flex, Table, TableColumnsType, TableProps, Tag } from "antd";

export interface DataType {
  key: React.Key;
  id: string;
  name: string;
  email: string;
  company_id: string;
  profile: UserProfileDataType;
}

export interface UserProfileDataType {
  id: string;
  is_verified: boolean;
  membership: string;
  role: string;
}

export type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export const columns: TableColumnsType<DataType> = [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  { title: "Nama User", dataIndex: "name" },
  {
    title: "Email",
    dataIndex: "email",
    render: (item) => (
      <Flex align="center" justify="start">
        <Tag>{item}</Tag>
      </Flex>
    ),
  },
  {
    title: "Role",
    dataIndex: ["profile", "role"],
    render: (item) => (
      <Flex align="center" justify="center">
        <Tag color="blue">{item}</Tag>
      </Flex>
    ),
  },
  {
    title: "Membership",
    dataIndex: ["profile", "membership"],
    render: (item) => (
      <Flex align="center" justify="center">
        <Tag color="gold">{item}</Tag>
      </Flex>
    ),
  },
  {
    title: "Nama Perusahaan",
    dataIndex: "company_name",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => (
      <Flex gap={8} align="center" justify="center">
        <Button color="primary" variant="solid">
          View
        </Button>
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
