/* eslint-disable @typescript-eslint/no-explicit-any */
import AllUsers from "@/components/layouts/docs-users";
import { getAllCompanies } from "@/utils/axios/company";
import { getAllUsers } from "@/utils/axios/user";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const AllUsersPage = async ({ searchParams }: { searchParams: any }) => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  const filters = {
    sort: searchParams.sort || "id",
    order: searchParams.order || "asc",
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.limit) || 20,
    company_name: searchParams.company_name || undefined,
    role: searchParams.role || undefined,
  };

  const rawAllUsersData = await getAllUsers(token, filters);
  const rawAllCompaniesData = await getAllCompanies(token);

  const companyMapping = rawAllCompaniesData.reduce(
    (
      map: Record<string, string>,
      company: { id: string | number; company_name: string }
    ) => {
      map[company.id] = company.company_name;
      return map;
    },
    {} as Record<string, string>
  );

  const usersWithCompanyName = rawAllUsersData.map(
    (user: { company_id: string | number }) => ({
      ...user,
      company_name: companyMapping[user.company_id] || "Unknown Company",
    })
  );

  const formattedCompanies = rawAllCompaniesData.map(
    (company: { id: any; company_name: any }) => ({
      value: company.id,
      label: company.company_name,
    })
  );

  return <AllUsers users={usersWithCompanyName} company={formattedCompanies} />;
};

export default AllUsersPage;
