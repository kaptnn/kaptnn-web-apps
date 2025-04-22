/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "axios";

export interface getDocumentRequestProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface CompanyProps {
  id: string;
  company_name: string;
  year_of_assignment: number;
  start_audit_period: Date;
  end_audit_period: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface GetAllCompaniesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

class DocsManagerService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public getAllDocsManager = async (
    params: GetAllCompaniesParams = {},
    token?: string,
    signal?: AbortSignal
  ): Promise<{ result: CompanyProps[]; meta: PaginationMeta }> => {
    try {
      const response = await this.axiosInstance.get(`/v1/companies`, {
        params,
        headers: this.getAuthHeaders(token),
        signal,
      });
      const { result, pagination } = response.data;
      return {
        result,
        meta: {
          currentPage: pagination.current_page,
          totalPages: pagination.total_pages,
          totalItems: pagination.total_items,
        },
      };
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      const msg = error?.response?.data?.message || "Failed to fetch companies";
      throw new Error(msg);
    }
  };

  public getDocsManagerById = async (
    companyId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<CompanyProps> => {
    if (!companyId) throw new Error("Company ID is required");
    try {
      const response = await this.axiosInstance.get(
        `/v1/companies/company/id/${encodeURIComponent(companyId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error fetching company by ID ${companyId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch company with ID ${companyId}`;
      throw new Error(msg);
    }
  };

  public createDocsManager = async (
    payload: any,
    token?: string,
    signal?: AbortSignal
  ): Promise<CompanyProps> => {
    if (!payload.company_name) throw new Error("Company name is required");
    try {
      const response = await this.axiosInstance.post(`/v1/companies`, payload, {
        headers: this.getAuthHeaders(token),
        signal,
      });
      return response.data.result;
    } catch (error: any) {
      console.error("Error creating company:", error);
      const msg = error?.response?.data?.message || "Failed to create company";
      throw new Error(msg);
    }
  };

  public updateDocsManager = async (
    companyId: string,
    payload: any,
    token?: string,
    signal?: AbortSignal
  ): Promise<CompanyProps> => {
    if (!companyId) throw new Error("Company ID is required");
    try {
      const response = await this.axiosInstance.put(
        `/v1/companies/company/id/${encodeURIComponent(companyId)}`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error updating company ${companyId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to update company with ID ${companyId}`;
      throw new Error(msg);
    }
  };

  public deleteDocsManager = async (
    companyId: string,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!companyId) throw new Error("Company ID is required");
    try {
      const response = await this.axiosInstance.delete<{
        message: string;
        result: { id: string };
      }>(`/v1/companies/company/id/${encodeURIComponent(companyId)}`, {
        headers: this.getAuthHeaders(token),
        signal,
      });
      return response.data.result;
    } catch (error: any) {
      console.error(`Error deleting company ${companyId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to delete company with ID ${companyId}`;
      throw new Error(msg);
    }
  };
}

export default DocsManagerService;
