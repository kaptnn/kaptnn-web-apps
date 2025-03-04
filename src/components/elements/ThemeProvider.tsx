"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

interface Props {
  children: ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <AntdRegistry>
      <ThemeProvider
        enableSystem={false}
        forcedTheme="light"
        disableTransitionOnChange
      >
        <AntDesignProvider>{children}</AntDesignProvider>
      </ThemeProvider>
    </AntdRegistry>
  );
}

function AntDesignProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      {children}
    </ConfigProvider>
  );
}
