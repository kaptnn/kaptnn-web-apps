import Dashboard from "@/components/layouts/dashboard";
import { getCookie } from "@/utils/axios/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "",
  description: "",
  applicationName: "",
  creator: "",
  alternates: {
    canonical: "",
  },
  keywords: [],
};

const DashboardPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <Dashboard initialToken={token} />;
};

export default DashboardPage;
