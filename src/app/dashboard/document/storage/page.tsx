import { UserApi } from "@/utils/axios/api-service";
import { getCookie } from "@/utils/axios/utils";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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

const DocumentStoragePage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await UserApi.getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  console.log(isAdmin);

  return <div>DocumentStoragePage</div>;
};

export default DocumentStoragePage;
