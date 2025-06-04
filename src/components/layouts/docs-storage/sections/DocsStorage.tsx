/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useAllUsersStore } from '@/stores/useAllUsersStore'
import DashboardLayouts from '../../DashboardLayouts'
import { Button, Card, Col, Flex, Input, Row, Typography } from 'antd'
import { FolderTwoTone, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface DocsStorageClientProps {
  initialToken: string
  isAdmin: boolean
  currentUser: any
}

const DocsStorage: React.FC<DocsStorageClientProps> = ({
  initialToken,
  isAdmin,
  currentUser
}) => {
  const {
    pageSize,
    current,
    loading,
    setData,
    setLoading,
    setCurrent,
    setTotal,
    openModal
  } = useAllUsersStore()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex align="center">
            <Input.Search
              placeholder="Search companies…"
              onSearch={() => {}}
              loading={false}
              enterButton
              allowClear
            />
          </Flex>
          <Flex align="center">
            {isAdmin && (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                loading={loading}
                onClick={() => openModal('create')}
              >
                Tambah Folder
              </Button>
            )}
          </Flex>
        </Flex>

        <Flex>
          <Flex vertical align="center" justify="center">
            <FolderTwoTone size={128} />
            <Typography.Paragraph>Nama Folder</Typography.Paragraph>
          </Flex>
        </Flex>
      </Flex>
    </DashboardLayouts>
  )
}

export default DocsStorage
