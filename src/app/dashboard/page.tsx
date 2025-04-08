import Dashboard from "@/components/layouts/dashboard/sections/Dashboard";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  return <Dashboard />;
};

export default DashboardPage;
