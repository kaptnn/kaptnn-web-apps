/* eslint-disable @typescript-eslint/no-explicit-any */
import AllUsers from "@/components/layouts/docs-users";
import { getAllCompanies } from "@/utils/axios/company";
import { getCurrentUser } from "@/utils/axios/user";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const AllUsersPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";
  const currentCompanyId = currentUser.company_id;

  const rawCompanies = await getAllCompanies(token);
  const companyOptions = rawCompanies.map((c: any) => ({
    value: c.id,
    label: c.company_name,
  }));

  return (
    <AllUsers
      initialToken={token}
      isAdmin={isAdmin}
      currentCompanyId={currentCompanyId}
      companyOptions={companyOptions}
    />
  );
};

export default AllUsersPage;
