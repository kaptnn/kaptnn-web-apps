"use client"

import { Button, Flex, Input } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Search } = Input;

const DocsCategory = () => {
  const [, setOpen] = useState<boolean>(false);
  const [, setLoading] = useState<boolean>(true);

  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <DashboardLayouts>
      <Flex gap="middle" vertical>
        <Flex align="center" justify="space-between" gap="middle">
          <Flex>
            <Search placeholder="Search" loading={false} enterButton />
          </Flex>
          <Flex align="center">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showLoading}
            >
              Add New Category
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </DashboardLayouts>
  );
};

export default DocsCategory;
