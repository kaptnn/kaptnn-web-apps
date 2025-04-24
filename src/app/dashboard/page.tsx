import Dashboard from "@/components/layouts/dashboard";
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
  if (!token) redirect("/login");

  return <Dashboard initialToken={token} />;
};

export default DashboardPage;
