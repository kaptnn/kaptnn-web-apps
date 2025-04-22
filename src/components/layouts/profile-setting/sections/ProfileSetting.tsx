"use client";

import { Typography } from "antd";
import DashboardLayouts from "../../DashboardLayouts";

const ProfileSetting = () => {
  return (
    <DashboardLayouts>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Pengaturan Profil Pengguna
      </Typography.Title>
    </DashboardLayouts>
  );
};

export default ProfileSetting;
