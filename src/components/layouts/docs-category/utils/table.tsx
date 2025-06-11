/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaretDownOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps, Table, TableProps } from 'antd'

export interface DataType {
  key: React.Key
  id: string
  name: string
  document_created: number
  document_finished: number
}

export interface SummaryDataType {
  key: React.Key
  category_id: string
  category_name: string
  total: number
  accepted: number
}

export type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

export const columns = (
  onAction: (type: 'view' | 'edit' | 'delete', record: DataType) => void
) => [
  Table.SELECTION_COLUMN,
  {
    title: 'Nama Kategori',
    dataIndex: 'name',
    key: 'name',
    sorter: true
  },
  {
    title: 'Jumlah Dokumen Terbuat',
    dataIndex: 'document_created',
    key: 'document_created',
    sorter: true,
    render: (item: number) => (
      <Flex align="center" justify="start">
        {item} Dokumen
      </Flex>
    )
  },
  {
    title: 'Jumlah Dokumen Selesai',
    dataIndex: 'document_finished',
    key: 'document_finished',
    sorter: true,
    render: (item: number) => (
      <Flex align="center" justify="start">
        {item} Dokumen
      </Flex>
    )
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: (_text: any, record: DataType) => {
      const menu: MenuProps = {
        items: [
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
