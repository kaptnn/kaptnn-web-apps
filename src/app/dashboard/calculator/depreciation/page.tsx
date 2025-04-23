import DepreciationCalculator from "@/components/layouts/calc-depreciation";
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

const DepreciationCalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <DepreciationCalculator />;
};

export default DepreciationCalculatorPage;
