"use client";

import { Avatar, Flex, Input, Typography } from "antd";
import DashboardLayouts from "../../DashboardLayouts";
import useAuthStore from "@/stores/AuthStore";

const ProfileSetting = () => {
  const { userInfo } = useAuthStore();
  const name = userInfo?.name.split(" ")[0];

  return (
    <DashboardLayouts>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Pengaturan Profil Pengguna
      </Typography.Title>

      <Flex gap={48}>
        <Avatar
          size={128}
          className="capitalize hover:cursor-pointer"
          style={{ marginTop: 28 }}
        >
          {name}
        </Avatar>

        <Flex vertical gap={24} style={{ marginTop: 24 }}>
          <Flex vertical gap={4}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Nama Pengguna
            </Typography.Title>
            <Input size="large" disabled value={userInfo?.name} />
          </Flex>

          <Flex vertical gap={4}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Email
            </Typography.Title>
            <Input size="large" disabled value={userInfo?.email} />
          </Flex>

          <Flex vertical gap={4}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Nama Perusahaan
            </Typography.Title>
            <Input size="large" disabled value={userInfo?.company_name} />
          </Flex>

          <div className="grid grid-cols-2 gap-6">
            <Flex vertical gap={4}>
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Role
              </Typography.Title>
              <Input
                size="large"
                disabled
                className="capitalize"
                value={userInfo?.profile.role}
              />
            </Flex>

            <Flex vertical gap={4}>
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Membership
              </Typography.Title>
              <Input
                size="large"
                disabled
                className="capitalize"
                value={userInfo?.profile.membership_status}
              />
            </Flex>
          </div>
        </Flex>
      </Flex>
    </DashboardLayouts>
  );
};

export default ProfileSetting;
