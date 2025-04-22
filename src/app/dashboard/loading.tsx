import { Flex, Spin } from "antd";

const Loading = () => {
  return (
    <main className="w-full h-screen justify-center items-center">
      <Flex className="w-full h-screen" justify="center" align="center">
        <Spin />
      </Flex>
    </main>
  );
};

export default Loading;
