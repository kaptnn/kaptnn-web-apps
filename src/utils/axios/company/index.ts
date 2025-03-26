import axiosInstance from "..";

export interface CompanyProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export async function getAllCompanies() {
  try {
    const response = await axiosInstance.get("/v1/companies");

    return response.data?.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}
