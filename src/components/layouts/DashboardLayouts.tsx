'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Avatar,
  Breadcrumb,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Modal,
  theme,
  Typography,
  type MenuProps
} from 'antd'
import {
  getMenuItemsByRole,
  getDefaultOpenKeys,
  accountProfileItems
} from '@/utils/constants/navigation'
import Image from 'next/image'
import Link from 'next/link'
import useAuthStore from '@/stores/AuthStore'
import { BellOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import LoadingPage from '../elements/LoadingPage'

const { Header, Sider, Content } = Layout

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayouts: React.FC<DashboardLayoutProps> = ({ children }) => {
  const userInfo = useAuthStore(state => state.userInfo)
  const role = userInfo?.profile.role ?? 'client'
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const router = useRouter()
  const pathname = usePathname()

  const menuItems = getMenuItemsByRole(role)

  useEffect(() => {
    setMounted(true)
    setOpenKeys(getDefaultOpenKeys(pathname, menuItems))
  }, [pathname, menuItems])

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const handleMenuClick: MenuProps['onClick'] = e => {
    router.push(e.key)
  }

  const breadcrumbItems = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      const href = `/${arr.slice(0, index + 1).join('/')}`
      return {
        title,
        href: index === arr.length - 1 ? undefined : href
      }
    })

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    setOpenKeys(keys)
  }

  if (userInfo === null && !mounted) return <LoadingPage />

  return (
    <Layout>
      <Sider
        style={{
          width: '100%',
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          scrollbarWidth: 'thin',
          scrollbarGutter: 'stable',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Flex vertical>
          <div className="ml-1 h-24 w-full p-4">
            <div className="flex h-full w-full items-center justify-center rounded bg-white p-4">
              <Link href={'/'}>
                {mounted && (
                  <Image
                    src={'/kaptnn-logo.webp'}
                    alt="Logo KAP TNN"
                    width={1024}
                    height={1024}
                  />
                )}
              </Link>
            </div>
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['/dashboard']}
            selectedKeys={[`${pathname}`]}
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ marginLeft: 4 }}
          />
        </Flex>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 16,
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
          className="shadow-md shadow-gray-700/10"
        >
          <Breadcrumb items={breadcrumbItems} style={{ marginInline: 12 }} />
          <Flex align="center" gap={24} style={{ marginInline: 12 }}>
            <Flex
              align="center"
              justify="center"
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer rounded-full transition-all duration-150 hover:bg-gray-200/50"
              style={{ margin: 0, padding: 8 }}
            >
              <QuestionCircleOutlined style={{ fontSize: 22, margin: 0, padding: 0 }} />
            </Flex>
            <Flex
              align="center"
              justify="center"
              onClick={() => alert('Notification')}
              className="cursor-pointer rounded-full transition-all duration-150 hover:bg-gray-200/50"
              style={{ margin: 0, padding: 8 }}
            >
              <BellOutlined style={{ fontSize: 22, margin: 0, padding: 0 }} />
            </Flex>
            <Dropdown
              menu={{ items: accountProfileItems }}
              trigger={['click']}
              placement="bottomRight"
              arrow
            >
              <Avatar
                onClick={e => e?.preventDefault()}
                size="large"
                className="capitalize hover:cursor-pointer"
                style={{ marginLeft: 8 }}
              >
                {userInfo?.name[0]}
              </Avatar>
            </Dropdown>
          </Flex>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: 24,
            height: '100%',
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          {children}
        </Content>
        <Modal
          centered
          open={isModalOpen}
          width={1024}
          onCancel={() => setIsModalOpen(false)}
          maskClosable={false}
        >
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            Bantuan & Dokumentasi
          </Typography.Title>
        </Modal>
      </Layout>
    </Layout>
  )
}

export default DashboardLayouts
