import { Flex, Spin } from 'antd'

const LoadingPage = () => {
  return (
    <main className="h-screen w-full items-center justify-center bg-white dark:bg-white">
      <Flex className="h-screen w-full" justify="center" align="center">
        <Spin />
      </Flex>
    </main>
  )
}

export default LoadingPage
