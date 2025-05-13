/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CaretDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Flex, MenuProps, Table, TableProps, Tag } from 'antd'

export interface DataType {
  key: React.Key
  id: string
  admin_id: string
  request_title: string
  request_desc: string
  target_user_id: string
  category_id: string
  due_date: string
  upload_date: string
  status: string
  type: string
}

const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
  uploaded: { color: 'green', icon: <CheckCircleOutlined /> },
  pending: { color: 'gold', icon: <ClockCircleOutlined /> },
  overdue: { color: 'red', icon: <CloseCircleOutlined /> },
  none: { color: 'default', icon: <MinusCircleOutlined /> }
}

export type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

export const columns = (
  onAction: (type: 'view' | 'edit' | 'delete', record: DataType) => void,
  isAdmin: boolean
) => [
  Table.SELECTION_COLUMN,
  {
    title: 'Nama Dokumen',
    dataIndex: 'request_title',
    key: 'request_title',
    sorter: true
  },
  {
    title: 'Target Pengguna',
    dataIndex: 'target_user_id',
    key: 'target_user_id',
    sorter: false,
    render: (item: string) => {
      return (
        <Flex align="center" justify="center">
          <Avatar
            className="capitalize"
            style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }}
            size="default"
          >
            {item?.charAt(0)?.toUpperCase() ?? <UserOutlined />}
          </Avatar>
        </Flex>
      )
    }
  },
  {
    title: 'Upload Pengguna',
    dataIndex: 'type',
    key: 'type',
    sorter: false,
    render: (item: string) => {
      return (
        <Flex align="center" justify="center">
          <Avatar
            className="capitalize"
            style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }}
            size="default"
          >
            {item?.charAt(0)?.toUpperCase() ?? <UserOutlined />}
          </Avatar>
        </Flex>
      )
    }
  },
  {
    title: 'Due Date',
    dataIndex: 'due_date',
    key: 'due_date',
    sorter: true,
    render: (item: string) => {
      return (
        <Flex align="center" justify="center">
          {item}
        </Flex>
      )
    }
  },
  {
    title: 'Upload Date',
    dataIndex: 'upload_date',
    key: 'upload_date',
    sorter: true,
    render: (item: string) => {
      return (
        <Flex align="center" justify="center">
          {item}
        </Flex>
      )
    }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: false,
    filters: Object.keys(statusMap).map(key => ({ text: key, value: key })),
    render: (item: string) => {
      const { color, icon } = statusMap[item] || statusMap.none
      return (
        <Flex align="center" justify="center">
          <Tag icon={icon} color={color}>
            {item}
          </Tag>
        </Flex>
      )
    }
  },
  {
    title: 'Action',
    key: 'action',
    sorter: false,
    render: (_text: any, record: DataType) => {
      const menu: MenuProps = {
        items: isAdmin
          ? [
              {
                key: 'view',
                label: 'View Data'
              },
              {
                key: 'edit',
                label: 'Edit Data'
              },
              {
                key: 'divider',
                type: 'divider'
              },
              {
                key: 'delete',
                label: 'Delete Data',
                danger: true
              }
            ]
          : [
              {
                key: 'view',
                label: 'View Request'
              },
              {
                key: 'upload_request',
                label: 'Upload Request'
              },
              {
                key: 'edit_request',
                label: 'Edit Request'
              },
              {
                key: 'divider',
                type: 'divider'
              },
              {
                key: 'delete_request',
                label: 'Delete Request',
                danger: true
              }
            ],
        onClick: ({ key }) => onAction(key as any, record)
      }

      return (
        <Dropdown menu={menu} placement="bottomRight" arrow trigger={['click']}>
          <Button>
            <SettingOutlined />
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      )
    }
  }
]
