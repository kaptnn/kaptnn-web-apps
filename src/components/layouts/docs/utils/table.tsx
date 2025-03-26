import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
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
  name: string;
  category: string;
  type: string;
  upload: string;
  due: string;
  status: string;
}

const categories = ["Accounting", "Legal", "HR", "Finance", "Marketing"];
const types = ["PDF", "Word", "Excel", "Image", "PowerPoint"];
const statuses = ["Done", "Pending", "Overdue", "In Progress"];
const getRandomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split("T")[0];

export const dataSource = Array.from<DataType>({ length: 14 }).map<DataType>(
  (_, i) => ({
    key: i,
    name: `Document Name ${i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    type: types[Math.floor(Math.random() * types.length)],
    upload: getRandomDate(new Date(2024, 0, 1), new Date(2025, 0, 1)),
    due: getRandomDate(new Date(2025, 0, 1), new Date(2025, 11, 31)),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  })
);

export type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export const columns: TableColumnsType<DataType> = [
  Table.SELECTION_COLUMN,
  Table.EXPAND_COLUMN,
  { title: "Document Name", dataIndex: "name" },
  {
    title: "Target User",
    dataIndex: "type",
    render: (item: string) => (
      <Flex align="center" justify="center">
        <Avatar
          style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
          size="default"
        >
          {item.slice(0, 1)}
        </Avatar>
      </Flex>
    ),
  },
  {
    title: "User Uploader",
    dataIndex: "type",
    render: (item: string) => (
      <Flex align="center" justify="center">
        <Avatar
          style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
          size="default"
        >
          {item.slice(0, 1)}
        </Avatar>
      </Flex>
    ),
  },
  { title: "Upload Date", dataIndex: "upload" },
  { title: "Due Date", dataIndex: "due" },
  {
    title: "Status",
    dataIndex: "status",
    render: (item: string) => {
      const statusColors: Record<
        string,
        { color: string; icon: React.ReactNode }
      > = {
        Done: { color: "success", icon: <CheckCircleOutlined /> },
        Pending: { color: "warning", icon: <ClockCircleOutlined /> },
        Overdue: { color: "error", icon: <CloseCircleOutlined /> },
        "In Progress": { color: "processing", icon: <SyncOutlined /> },
        None: { color: "default", icon: <MinusCircleOutlined /> },
      };

      const { color, icon } = statusColors[item] || statusColors["None"];

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
