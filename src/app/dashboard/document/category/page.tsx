import DocsCategory from "@/components/layouts/docs-category";
import { DocsCategoryApi, UserApi } from "@/utils/axios/api-service";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const CategoryPage = async () => {
  const token = await getCookie("access_token");
  if (!token) redirect("/login");

  const currentUser = await UserApi.getCurrentUser(token);
  const isAdmin = currentUser.profile.role === "admin";

  if (!isAdmin) redirect("/dashboard");

  const rawDocsCategoryData = await DocsCategoryApi.getAllDocsCategory(
    {},
    token
  );

  return <DocsCategory docs_category={rawDocsCategoryData.result} />;
};

export default CategoryPage;
