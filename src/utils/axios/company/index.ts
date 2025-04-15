import axiosInstance from "..";

export interface CompanyProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export async function getAllCompanies(token?: string, filters = {}) {
  try {
    const response = await axiosInstance.get("/v1/companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
    });
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getCompanyById(company_id: string, token: string) {
  try {
    const response = await axiosInstance.get(
      `/v1/companies/company/id/${company_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return null;
  }
}

export async function getCompanyByCompanyName(
  company_name: string,
  token: string
) {
  try {
    const response = await axiosInstance.get(
      `/v1/companies/company/name/${encodeURIComponent(company_name)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data?.result;
  } catch (error) {
    console.error("Error fetching company by name:", error);
    return null;
  }
}
