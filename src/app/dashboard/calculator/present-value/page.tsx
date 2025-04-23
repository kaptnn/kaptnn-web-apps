import PresentValueCalculator from "@/components/layouts/calc-present-value";
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

const PresentValueCalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <PresentValueCalculator />;
};

export default PresentValueCalculatorPage;
