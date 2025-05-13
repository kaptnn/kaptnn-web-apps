'use client'

import { Empty, Flex, Typography } from 'antd'
import DashboardLayouts from '../layouts/DashboardLayouts'

const NotVerfiedPage = () => {
  return (
    <DashboardLayouts>
      <Flex className="h-full w-full" justify="center" align="center">
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} styles={{ image: { height: 60 } }}>
          <Typography.Title level={3}>Customize Description</Typography.Title>
          <Typography.Paragraph>Deskripsi</Typography.Paragraph>
        </Empty>
      </Flex>
    </DashboardLayouts>
  )
}

export default NotVerfiedPage
