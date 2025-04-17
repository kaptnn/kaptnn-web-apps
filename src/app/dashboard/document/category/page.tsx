import DocsCategory from "@/components/layouts/docs-category";
import { getAllDocumentCategories } from "@/utils/axios/docs/category";
import { getCurrentUser } from "@/utils/axios/user";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const CategoryPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  if (!isAdmin) redirect("/dashboard");

  const rawDocsCategoryData = await getAllDocumentCategories(token);

  return <DocsCategory docs_category={rawDocsCategoryData} />;
};

export default CategoryPage;
