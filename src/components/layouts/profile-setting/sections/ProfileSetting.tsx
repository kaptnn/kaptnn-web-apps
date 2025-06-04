'use client'

import { Avatar, Flex, Input, Typography } from 'antd'
import DashboardLayouts from '../../DashboardLayouts'
import useAuthStore from '@/stores/AuthStore'
import { useEffect, useState } from 'react'
import LoadingPage from '@/components/elements/LoadingPage'

const { Title } = Typography

const ProfileSetting = () => {
  const { userInfo } = useAuthStore()
  const [mounted, setMounted] = useState<boolean>(false)
  const name = userInfo?.name.split(' ')[0]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <LoadingPage />

  return (
    <DashboardLayouts>
      <Title level={2} style={{ marginTop: 0 }}>
        Pengaturan Profil Pengguna
      </Title>

      <Flex gap={48}>
        <Avatar
          size={128}
          className="capitalize hover:cursor-pointer"
          style={{ marginTop: 28 }}
        >
          {name}
        </Avatar>

        <Flex vertical gap={24} style={{ marginTop: 24 }}>
          <Flex vertical gap={4}>
            <Title level={5} style={{ marginTop: 0 }}>
              Nama Pengguna
            </Title>
            <Input size="large" disabled value={userInfo?.name} />
          </Flex>

          <Flex vertical gap={4}>
            <Title level={5} style={{ marginTop: 0 }}>
              Email
            </Title>
            <Input size="large" disabled value={userInfo?.email} />
          </Flex>

          <Flex vertical gap={4}>
            <Title level={5} style={{ marginTop: 0 }}>
              Nama Perusahaan
            </Title>
            <Input size="large" disabled value={userInfo?.company_name} />
          </Flex>

          <div className="grid grid-cols-2 gap-6">
            <Flex vertical gap={4}>
              <Title level={5} style={{ marginTop: 0 }}>
                Role
              </Title>
              <Input
                size="large"
                disabled
                className="capitalize"
                value={userInfo?.profile.role}
              />
            </Flex>

            <Flex vertical gap={4}>
              <Title level={5} style={{ marginTop: 0 }}>
                Membership
              </Title>
              <Input
                size="large"
                disabled
                className="capitalize"
                value={userInfo?.profile.membership_status}
              />
            </Flex>
          </div>
        </Flex>
      </Flex>
    </DashboardLayouts>
  )
}

export default ProfileSetting
