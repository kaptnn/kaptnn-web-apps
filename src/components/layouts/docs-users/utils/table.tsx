/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Dropdown, Button, Tag, Flex } from 'antd'
import type { MenuProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SettingOutlined,
  CaretDownOutlined,
  CheckCircleFilled,
  CloseCircleFilled
} from '@ant-design/icons'

export type ActionType = 'view' | 'verify' | 'unverify' | 'delete'

export interface UserProfileDataType {
  id: string
  is_verified: boolean
  membership_status: string
  role: string
}

export interface DataType {
  key: React.Key
  id: string
  name: string
  email: string
  company_id: string
  company_name: string
  role?: string
  total?: number
  profile: UserProfileDataType
}

export const columns = (
  onAction: (action: ActionType, record: DataType) => void,
  isAdmin: boolean
): ColumnsType<DataType> => {
  const baseColumns: ColumnsType<DataType> = [
    Table.SELECTION_COLUMN,
    {
      title: 'Nama User',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      render: (email: string) => (
        <Flex align="center" justify="start">
          <Tag>{email}</Tag>
        </Flex>
      )
    },
    {
      title: 'Role',
      dataIndex: ['profile', 'role'],
      key: 'role',
      sorter: true,
      render: (role: string) => (
        <Flex align="center" justify="start">
          <Tag className="capitalize" color="blue">
            {role}
          </Tag>
        </Flex>
      )
    },
    {
      title: 'Membership',
      dataIndex: ['profile', 'membership_status'],
      key: 'membership',
      sorter: true,
      render: (m: string) => (
        <Flex align="center" justify="center">
          <Tag className="capitalize" color="gold">
            {m}
          </Tag>
        </Flex>
      )
    },
    {
      title: 'Nama Perusahaan',
      dataIndex: 'company_name',
      key: 'company_name',
      sorter: true
    }
  ]

  const verificationColumn: ColumnsType<DataType>[number] = {
    title: 'Verifikasi',
    dataIndex: ['profile', 'is_verified'],
    key: 'verification',
    sorter: true,
    render: (isVerified: boolean) => (
      <Flex align="center" justify="center">
        {isVerified ? (
          <CheckCircleFilled style={{ color: 'green' }} />
        ) : (
          <CloseCircleFilled style={{ color: 'red' }} />
        )}
      </Flex>
    )
  }

  const actionColumn: ColumnsType<DataType>[number] = {
    title: 'Action',
    key: 'action',
    render: (_: any, record: DataType) => {
      const items: MenuProps['items'] = [
        { key: 'view', label: 'View Data' },
        ...(record.profile.is_verified ? [{ key: 'edit', label: 'Edit Data' }] : []),
        ...(isAdmin && !record.profile.is_verified
          ? [{ key: 'verify', label: 'Verify User' }]
          : [{ key: 'unverify', label: 'Disabled User' }]),
        { type: 'divider' },
        { key: 'delete', label: 'Delete Data', danger: true }
      ]

      return (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => onAction(key as ActionType, record)
          }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Button icon={<SettingOutlined />}>
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      )
    }
  }

  return isAdmin ? [...baseColumns, verificationColumn, actionColumn] : baseColumns
}
