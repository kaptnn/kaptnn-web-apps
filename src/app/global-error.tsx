/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import { Button, Flex, Typography } from 'antd'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const { Title, Paragraph } = Typography

const GlobalErrorPage = ({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="flex h-screen w-full items-center justify-center bg-white dark:bg-white">
          <Flex
            className="h-screen w-full"
            justify="center"
            align="center"
            vertical
            gap={16}
          >
            <Flex vertical>
              <Title
                level={1}
                className="text-center text-5xl font-bold"
                style={{ margin: 0, fontWeight: 'bold' }}
              >
                Oops... <br />
                Something went wrong
              </Title>
              <Paragraph className="my-4 text-center text-lg">
                Something is not working right now. Try again later or head back to
                homepage.
              </Paragraph>
            </Flex>

            <Flex align="center" gap={16} vertical className="mt-12">
              <Button
                type="primary"
                onClick={() => {
                  window.location.href = '/'
                }}
              >
                Back to Homepage
              </Button>
              <Button onClick={() => reset()}>Try again</Button>
            </Flex>
          </Flex>
        </main>
      </body>
    </html>
  )
}

export default GlobalErrorPage
