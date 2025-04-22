import AllDocsManager from "@/components/layouts/docs";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const DocumentManagementPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  return <AllDocsManager initialToken={token} />;
};

export default DocumentManagementPage;
