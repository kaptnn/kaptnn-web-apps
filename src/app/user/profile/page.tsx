import ProfileSetting from "@/components/layouts/profile-setting";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const UserProfileSettingPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <ProfileSetting />;
};

export default UserProfileSettingPage;
