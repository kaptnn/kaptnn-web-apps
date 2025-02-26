"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AntDesignOutlined } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Flex,
  Layout,
  Menu,
  theme,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import { getDefaultOpenKeys, menuItems } from "@/utils/constants/navigation";

const { Title, Paragraph } = Typography;

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayouts: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    router.push(e.key);
  };

  const breadcrumbItems = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => {
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);
      const href = `/${arr.slice(0, index + 1).join("/")}`;

      return {
        title,
        href: index === arr.length - 1 ? undefined : href,
      };
    });

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setOpenKeys(getDefaultOpenKeys(pathname));
  }, [pathname]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
        }}
      >
        <div className="w-full h-24 p-4">
          <div className="w-full h-full bg-white rounded"></div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["/dashboard"]}
          selectedKeys={[`${pathname}`]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 16,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0, fontWeight: "bold" }}>
            Welcome to KAP Tambunan & Nasafi Dashboard
          </Title>
          <Flex align="center" gap={24}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-8"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                clipRule="evenodd"
              />
            </svg>

            <Flex align="center" gap={8}>
              <Avatar
                icon={<AntDesignOutlined />}
                style={{ height: "44px", width: "44px" }}
              />
              <Flex vertical>
                <Title level={5} style={{ margin: 0 }}>
                  Username
                </Title>
                <Paragraph style={{ margin: 0 }}>Company Name</Paragraph>
              </Flex>
            </Flex>
          </Flex>
        </Header>
        <Breadcrumb
          style={{ margin: "16px", padding: "16px 0px 0px 0px" }}
          items={breadcrumbItems}
        />
        <Content
          style={{
            margin: "16px",
            padding: 24,
            minHeight: "100vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayouts;
