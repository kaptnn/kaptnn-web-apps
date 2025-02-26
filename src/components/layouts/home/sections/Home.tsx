"use client";

import React from "react";
import { Button, Flex, Typography } from "antd";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <main>
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <div className="relative h-full w-full [&>div]:absolute [&>div]:bottom-0 [&>div]:right-0 [&>div]:z-[-2] [&>div]:h-full [&>div]:w-full [&>div]:bg-gradient-to-b [&>div]:from-blue-200 [&>div]:to-white">
            <div></div>
          </div>
        </div>

        <Flex
          vertical
          gap={24}
          align="center"
          justify="center"
          className="min-h-screen"
        >
          <Flex
            vertical
            gap={24}
            style={{ padding: 20 }}
            className="max-w-3xl text-center"
          >
            <Flex vertical>
              <Title className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-slate-900">
                KAP Tambunan & Nasafi Web Apps
              </Title>
              <Paragraph className="mx-auto mb-8 max-w-2xl text-lg text-slate-700">
                Build modern and beautiful websites with this collection of
                stunning background patterns. Perfect for landing pages, apps,
                and dashboards.
              </Paragraph>
            </Flex>
            <Flex justify="center" gap={16}>
              <Button type="primary" size="large" href="/login">
                Login
              </Button>
              <Button type="default" size="large" href="/dashboard">
                Dashboard
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </main>
  );
};

export default Home;
