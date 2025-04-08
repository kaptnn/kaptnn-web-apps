import Login from "@/components/layouts/auth/login";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const token = await getCookie("access_token");
  if (token) {
    redirect("/dashboard");
  }

  return <Login />;
};

export default LoginPage;
