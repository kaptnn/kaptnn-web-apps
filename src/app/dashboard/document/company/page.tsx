import Company from "@/components/layouts/docs-company";
import { UserApi } from "@/utils/axios/api-service";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";
import { Metadata } from "next";

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

const CompanyPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await UserApi.getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  if (!isAdmin) redirect("/dashboard");

  return <Company initialToken={token} />;
};

export default CompanyPage;
