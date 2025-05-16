'use client'

import '@ant-design/v5-patch-for-react-19'
import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd'

interface Props {
  children: ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <AntdRegistry>
      <ThemeProvider
        enableSystem={false}
        forcedTheme="light"
        attribute="class"
        disableTransitionOnChange
      >
        <ConfigProvider
          theme={{
            algorithm: antdTheme.defaultAlgorithm
          }}
        >
          <AntdApp>{children}</AntdApp>
        </ConfigProvider>
      </ThemeProvider>
    </AntdRegistry>
  )
}
