import Home from "@/components/layouts/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda | KAP Tambunan & Nasafi",
  description: "Beranda aplikasi website dari KAP Tambunan & Nasafi",
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
