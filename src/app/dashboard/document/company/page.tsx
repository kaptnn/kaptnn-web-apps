import Company from "@/components/layouts/docs-company";
import { getCurrentUser } from "@/utils/axios/user";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const CompanyPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  if (!isAdmin) redirect("/dashboard");

  return <Company initialToken={token} />;
};

export default CompanyPage;
