'use client'

import { Empty, Flex, Typography } from 'antd'
import DashboardLayouts from '../layouts/DashboardLayouts'

const MaintainedPage = () => {
  return (
    <DashboardLayouts>
      <Flex className="h-full w-full" justify="center" align="center">
        <Empty
          image={Empty.PRESENTED_IMAGE_DEFAULT}
          description
          styles={{ image: { height: 120 } }}
        >
          <Typography.Title level={3}>Sedang Dalam Perbaikan</Typography.Title>
          <Typography.Paragraph className="max-w-md">
            Maaf halaman ini sedang dalam perbaikan, mohon tunggu untuk menggunakan
            halaman ini setelah perbaikan selesai.
          </Typography.Paragraph>
        </Empty>
      </Flex>
    </DashboardLayouts>
  )
}

export default MaintainedPage
