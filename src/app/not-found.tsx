"use client";

import { Button, Empty, Flex } from "antd";

const NotFound = () => {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <Flex className="w-full h-screen" justify="center" align="center">
        <Empty description="Not Found Dashboard">
          <Button
            type="primary"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back to Homepage
          </Button>
        </Empty>
      </Flex>
    </main>
  );
};

export default NotFound;
