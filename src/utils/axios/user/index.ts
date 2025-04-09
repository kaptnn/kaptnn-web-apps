import axiosInstance from "..";

export interface CompanyProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export async function getAllUsers(token?: string, filters = {}) {
  try {
    const response = await axiosInstance.get("/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filters,
    });

    return response.data?.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getUserById(user_id: string, token: string) {
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

export async function getUserByEmail(user_email: string, token: string) {
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

export async function getUserByCompanyId(company_id: string, token: string) {
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
