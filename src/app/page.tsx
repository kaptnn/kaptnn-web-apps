import Home from "@/components/layouts/home";
import { seo_data } from "@/utils/constants/seo_data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${seo_data.title.page} | KAP Tambunan & Nasafi`,
  applicationName: "KAP TNN Datatrail Website",
  creator: "KAP TNN Tech Teams",
  alternates: {
    canonical: "https://kaptnn.com/",
  },
  keywords: ["Data", "Datatrail", "Accountant", "Document", "Document Management"],
};

export default function HomePage() {
  return <Home />;
}
