import Register from "@/components/layouts/auth/register";
import { getAllCompanies } from "@/utils/axios/company";


const RegisterPage = async () => {
  const companies = await getAllCompanies()

  return <Register companies={companies}/>;
};

export default RegisterPage;
