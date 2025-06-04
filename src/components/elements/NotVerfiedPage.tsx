'use client'

import { Empty, Flex, Typography } from 'antd'
import DashboardLayouts from '../layouts/DashboardLayouts'

const NotVerfiedPage = () => {
  return (
    <DashboardLayouts>
      <Flex className="h-full w-full" justify="center" align="center">
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description
          styles={{ image: { height: 120 } }}
        >
          <Typography.Title level={3}>Belum Terverifikasi</Typography.Title>
          <Typography.Paragraph className="max-w-md">
            Maaf anda belum terverifikasi, mohon hubungi atau tunggu Admin untuk
            memverifikasi akun anda.
          </Typography.Paragraph>
        </Empty>
      </Flex>
    </DashboardLayouts>
  )
}

export default NotVerfiedPage
