import { Flex, Spin } from "antd";

const Loading = () => {
  return (
    <Flex className="w-full h-screen" justify="center" align="center">
      <Spin />
    </Flex>
  );
};

export default Loading;
