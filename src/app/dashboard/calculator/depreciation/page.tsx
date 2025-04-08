import DepreciationCalculator from "@/components/layouts/calc-depreciation";
import { getCookie } from "@/utils/axios/utils";
import { redirect } from "next/navigation";

const DepreciationCalculatorPage = async () => {
  const token = await getCookie("access_token");
  if (!token) {
    redirect("/login");
  }

  return <DepreciationCalculator />;
};

export default DepreciationCalculatorPage;
