/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaretDownOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, MenuProps, Table, TableProps, Tag } from "antd";

export interface DataType {
  key: React.Key;
  id: string;
  company_name: string;
  year_of_assignment: number;
  start_audit_period: string;
  end_audit_period: string;
}

export type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export const columns = (
  onAction: (type: "view" | "edit" | "delete", record: DataType) => void,
) => [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  {
    title: "Company Name",
    dataIndex: "company_name",
    key: "company_name",
    sorter: true,
  },
  {
    title: "Tahun Penugasan",
    dataIndex: "year_of_assignment",
    key: "year_of_assignment",
    sorter: true,
    render: (item: number) => (
      <Flex align="center" justify="center">
        <Tag>{item}</Tag>
      </Flex>
    ),
  },
  {
    title: "Mulai Periode Audit",
    dataIndex: "start_audit_period",
    key: "start_audit_period",
    sorter: true,
  },
  {
    title: "Akhir Periode Audit",
    dataIndex: "end_audit_period",
    key: "end_audit_period",
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
