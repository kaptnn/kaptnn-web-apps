import Company from "@/components/layouts/docs-company";
import { DataType } from "@/components/layouts/docs-company/utils/table";
import { getCookie } from "@/utils/axios/utils";
import { getAllCompanies } from "@/utils/axios/company";
import { redirect } from "next/navigation";

const CompanyPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  const companies = await getAllCompanies(token);

  const formattedCompanies = companies.map((company: DataType) => ({
    ...company,
    key: company.id,
    start_audit_period: new Date(company.start_audit_period)
      .toISOString()
      .split("T")[0],

    end_audit_period: new Date(company.end_audit_period)
      .toISOString()
      .split("T")[0],
  }));

  return <Company company={formattedCompanies} />;
};

export default CompanyPage;
