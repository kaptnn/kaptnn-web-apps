import { seo_data } from "@/utils/constants/seo_data";
import { Flex, Spin } from "antd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${seo_data.title.loading} | KAP Tambunan & Nasafi`,
  applicationName: "KAP TNN Datatrail Website",
  creator: "KAP TNN Tech Teams",
  alternates: {
    canonical: "https://kaptnn.com/",
  },
  keywords: ["Data", "Datatrail", "Accountant", "Document", "Document Management"],
};

const Loading = () => {
  return (
    <main className="h-screen w-full items-center justify-center">
      <Flex className="h-screen w-full" justify="center" align="center">
        <Spin />
      </Flex>
    </main>
  );
};

export default Loading;
