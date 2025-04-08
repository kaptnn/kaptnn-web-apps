import DocsCategory from "@/components/layouts/docs-category";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const CategoryPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  return <DocsCategory />;
};

export default CategoryPage;
