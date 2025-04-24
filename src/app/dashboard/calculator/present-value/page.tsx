import PresentValueCalculator from "@/components/layouts/calc-present-value";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { seo_data } from "@/utils/constants/seo_data";

export const metadata: Metadata = {
  title: `${seo_data.title.dashboard.calculator["present-value"]} | KAP Tambunan & Nasafi`,
  applicationName: "KAP TNN Datatrail Website",
  creator: "KAP TNN Tech Teams",
  alternates: {
    canonical: "https://kaptnn.com/",
  },
  keywords: ["Data", "Datatrail", "Accountant", "Document", "Document Management"],
};

const PresentValueCalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  return <PresentValueCalculator />;
};

export default PresentValueCalculatorPage;
