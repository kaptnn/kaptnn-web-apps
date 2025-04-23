import AllCalculator from "@/components/layouts/calculator";
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

const CalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <AllCalculator />;
};

export default CalculatorPage;
