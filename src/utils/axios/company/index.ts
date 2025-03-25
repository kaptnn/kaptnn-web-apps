import axiosInstance from "..";

export interface CompanyProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export async function getAllCompanies() {
  try {
    const response = await axiosInstance.get("/v1/companies", {
      headers: {
        Authorization: `Bearer TOKEN`,
      },
    });

    return response.data?.data?.map((company: CompanyProps) => ({
      value: company.id,
      label: company.company_name,
    }));
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}
