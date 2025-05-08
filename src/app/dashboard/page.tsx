import Dashboard from "@/components/layouts/dashboard";
import { UserApi } from "@/utils/axios/api-service";
import { getCookie } from "@/utils/axios/utils";
import { seo_data } from "@/utils/constants/seo_data";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.page} | KAP Tambunan & Nasafi`,
  applicationName: "KAP TNN Datatrail Website",
  creator: "KAP TNN Tech Teams",
  alternates: {
    canonical: "https://kaptnn.com/",
  },
  keywords: ["Data", "Datatrail", "Accountant", "Document", "Document Management"],
};

const DashboardPage = async () => {
  const token = await getCookie("access_token");
  if (!token) return redirect("/login");

  const currentUser = await UserApi.getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  return <Dashboard initialToken={token} isAdmin={isAdmin} currentUser={currentUser} />;
};

export default DashboardPage;
