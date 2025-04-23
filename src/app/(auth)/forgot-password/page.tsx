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

const ForgotPasswordPage = async () => {
  const token = await getCookie("access_token");
  if (!token || token) redirect("/");

  return <main></main>;
};

export default ForgotPasswordPage;
