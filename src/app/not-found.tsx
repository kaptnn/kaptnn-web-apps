"use client";

import { Button, Empty, Flex } from "antd";

const NotFound = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Flex className="h-screen w-full" justify="center" align="center">
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
