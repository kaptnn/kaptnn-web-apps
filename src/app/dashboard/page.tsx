import Dashboard from "@/components/layouts/dashboard/sections/Dashboard";
import { getCompanyById } from "@/utils/axios/company";
import { getCurrentUser } from "@/utils/axios/user";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  const rawCurrentUserData = await getCurrentUser(token);
  const rawCompanyByIdData = await getCompanyById(
    rawCurrentUserData.company_id,
    token
  );

  const currentUserData = {
    ...rawCurrentUserData,
    company_name: rawCompanyByIdData.company_name,
  };

  return <Dashboard currentUser={currentUserData} />;
};

export default DashboardPage;
