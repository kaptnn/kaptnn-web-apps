import axiosInstance from "..";

export interface CompanyProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export async function getAllDocuments(token?: string) {
  try {
    const response = await axiosInstance.get("/v1/companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getDocumentById(
  doc_id: string,
  token: string
) {
  try {
    const response = await axiosInstance.get("/v1/companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}
