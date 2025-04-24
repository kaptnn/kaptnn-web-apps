import AllUsers from "@/components/layouts/docs-users";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { seo_data } from "@/utils/constants/seo_data";

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.user.users} | KAP Tambunan & Nasafi`,
  applicationName: "KAP TNN Datatrail Website",
  creator: "KAP TNN Tech Teams",
  alternates: {
    canonical: "https://kaptnn.com/",
  },
  keywords: ["Data", "Datatrail", "Accountant", "Document", "Document Management"],
};

const AllUsersPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <AllUsers initialToken={token} />;
};

export default AllUsersPage;
