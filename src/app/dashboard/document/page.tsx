import AllDocsManager from "@/components/layouts/docs";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { seo_data } from "@/utils/constants/seo_data";

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.document.request} | KAP Tambunan & Nasafi`,
  applicationName: "KAP TNN Datatrail Website",
  creator: "KAP TNN Tech Teams",
  alternates: {
    canonical: "https://kaptnn.com/",
  },
  keywords: ["Data", "Datatrail", "Accountant", "Document", "Document Management"],
};

const DocumentManagementPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <AllDocsManager initialToken={token} />;
};

export default DocumentManagementPage;
