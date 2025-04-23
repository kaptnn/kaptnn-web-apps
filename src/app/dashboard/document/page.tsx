import AllDocsManager from "@/components/layouts/docs";
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

const DocumentManagementPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <AllDocsManager initialToken={token} />;
};

export default DocumentManagementPage;
