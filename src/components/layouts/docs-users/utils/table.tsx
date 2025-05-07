/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaretDownOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, MenuProps, Table, TableProps, Tag } from "antd";

export interface DataType {
  result: any;
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

export const columns = (
  onAction: (type: "view" | "edit" | "delete", record: DataType) => void,
) => [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  { title: "Nama User", dataIndex: "name", key: "name", sorter: true },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: true,
    render: (item: any) => (
      <Flex align="center" justify="start">
        <Tag>{item}</Tag>
      </Flex>
    ),
  },
  {
    title: "Role",
    dataIndex: ["profile", "role"],
    key: "role",
    sorter: true,
    render: (item: any) => (
      <Flex align="center" justify="center">
        <Tag color="blue" className="capitalize">
          {item}
        </Tag>
      </Flex>
    ),
  },
  {
    title: "Membership",
    dataIndex: ["profile", "membership_status"],
    key: "membership",
    sorter: true,
    render: (item: any) => (
      <Flex align="center" justify="center">
        <Tag color="gold" className="capitalize">
          {item}
        </Tag>
      </Flex>
    ),
  },
  {
    title: "Nama Perusahaan",
    dataIndex: "company_id",
    key: "company_id",
    sorter: true,
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: (_text: any, record: DataType) => {
      const menu: MenuProps = {
        items: [
          {
            key: "view",
            label: "View Data",
          },
          {
            key: "edit",
            label: "Edit Data",
          },
          {
            key: "divider",
            type: "divider",
          },
          {
            key: "delete",
            label: "Delete Data",
            danger: true,
          },
        ],
        onClick: ({ key }) => onAction(key as any, record),
      };
      return (
        <Dropdown menu={menu} placement="bottomRight" arrow trigger={["click"]}>
          <Button>
            <SettingOutlined />
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      );
    },
  },
];
