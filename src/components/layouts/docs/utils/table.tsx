import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Flex,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";

export interface DataType {
  key: React.Key;
  id: string;
  admin_id: string;
  request_title: string;
  request_desc: string;
  target_user_id: string;
  category_id: string;
  due_date: string;
  upload_date: string;
  status: string;
  type: string;
}

export type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export const columns: TableColumnsType<DataType> = [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  {
    title: "Nama Dokumen",
    dataIndex: "request_title",
    key: "request_title",
  },
  {
    title: "Target User",
    dataIndex: "target_user_id",
    key: "target_user_id",
    render: (item: string) => {
      const display =
        typeof item === "string" && item.length > 0 ? item.slice(0, 1) : "U";
      return (
        <Flex align="center" justify="center">
          <Avatar
            style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
            size="default"
          >
            {display}
          </Avatar>
        </Flex>
      );
    },
  },
  {
    title: "User Uploader",
    dataIndex: "type",
    key: "type",
    render: (item: string) => {
      const display =
        typeof item === "string" && item.length > 0 ? item.slice(0, 1) : "U";
      return (
        <Flex align="center" justify="center">
          <Avatar
            style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
            size="default"
          >
            {display}
          </Avatar>
        </Flex>
      );
    },
  },
  {
    title: "Due Date",
    dataIndex: "due_date",
    key: "due_date",
  },
  {
    title: "Upload Date",
    dataIndex: "upload_date",
    key: "upload_date",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (item: string) => {
      const statusColors: Record<
        string,
        { color: string; icon: React.ReactNode }
      > = {
        uploaded: { color: "success", icon: <CheckCircleOutlined /> },
        pending: { color: "warning", icon: <ClockCircleOutlined /> },
        overdue: { color: "error", icon: <CloseCircleOutlined /> },
        none: { color: "default", icon: <MinusCircleOutlined /> },
      };

      const { color, icon } = statusColors[item] || statusColors["none"];
      return (
        <Flex align="center" justify="center">
          <Tag icon={icon} color={color}>
            {item}
          </Tag>
        </Flex>
      );
    },
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Flex gap={8} align="center" justify="center">
        <Button type="primary">View</Button>
        <Button type="default">Edit</Button>
        <Button danger type="primary">
          Delete
        </Button>
      </Flex>
    ),
  },
];
