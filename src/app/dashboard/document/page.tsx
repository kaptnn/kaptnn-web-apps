import AllDocsManager from "@/components/layouts/docs";
import { getAllDocumentRequests } from "@/utils/axios/docs/request";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const DocumentManagementPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  const rawDocsRequestData = await getAllDocumentRequests(token);

  return <AllDocsManager docs_request={rawDocsRequestData} />;
};

export default DocumentManagementPage;
