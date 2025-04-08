import AllCalculator from "@/components/layouts/calculator";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const CalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  return <AllCalculator />;
};

export default CalculatorPage;
