import Login from "@/components/layouts/auth/login";
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

const LoginPage = async () => {
  const token = await getCookie("access_token");
  if (token) redirect("/dashboard");

  return <Login />;
};

export default LoginPage;
