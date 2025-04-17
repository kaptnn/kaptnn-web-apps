import { getCompanyById } from "@/utils/axios/company";
import { getDocumentByCompanyId } from "@/utils/axios/docs/manager";
import { getDocumentRequestByCompanyId } from "@/utils/axios/docs/request";
import { getCurrentUser, getUserByCompanyId } from "@/utils/axios/user";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const CompanyByIdPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  if (!isAdmin) redirect("/dashboard");

  // Fetch Company By Id
  const rawCompanyData = getCompanyById("", token);
  console.log("Company By Id", rawCompanyData);

  // Fetch User By Company Id
  const rawUserDataByCompanyId = getUserByCompanyId("", token);
  console.log("User By Company Id", rawUserDataByCompanyId);

  // Fetch Document By Company Id
  const rawDocumentDataByCompanyId = getDocumentByCompanyId("", token);
  console.log("Document By Company Id", rawDocumentDataByCompanyId);

  // Fetch Document Request By Company Id
  const rawDocumentRequestDataByCompanyId = getDocumentRequestByCompanyId(
    "",
    token
  );
  console.log(
    "Document Request By Company Id",
    rawDocumentRequestDataByCompanyId
  );

  return <div>CompanyByIdPage</div>;
};

export default CompanyByIdPage;
