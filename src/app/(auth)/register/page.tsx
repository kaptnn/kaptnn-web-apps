import Register from "@/components/layouts/auth/register";
import { CompanyApi } from "@/utils/axios/api-service";
import { CompanyProps } from "@/utils/axios/company";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const token = await getCookie("access_token");
  if (token) {
    redirect("/dashboard");
  }

  const rawCompanies = await CompanyApi.getAllCompanies({}, token);

  const companies = rawCompanies.result.map((company: CompanyProps) => ({
    value: company.id,
    label: company.company_name,
  }));

  return <Register companies={companies} />;
};

export default RegisterPage;
