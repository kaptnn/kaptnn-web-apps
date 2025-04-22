import { Flex, Spin } from "antd";

const Loading = () => {
  return (
    <main className="h-screen w-full items-center justify-center">
      <Flex className="h-screen w-full" justify="center" align="center">
        <Spin />
      </Flex>
    </main>
  );
};

export default Loading;
