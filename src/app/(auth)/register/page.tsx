import Register from "@/components/layouts/auth/register";
import { getAllCompanies } from "@/utils/axios/company";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const token = await getCookie("access_token");
  if (token) {
    redirect("/dashboard");
  }

  const companies = await getAllCompanies();

  return <Register companies={companies} />;
};

export default RegisterPage;
