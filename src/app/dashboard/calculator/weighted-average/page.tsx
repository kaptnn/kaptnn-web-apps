import WeightedAverageCalculator from "@/components/layouts/calc-weighted-average";
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

const WeightedAverageCalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <WeightedAverageCalculator />;
};

export default WeightedAverageCalculatorPage;
