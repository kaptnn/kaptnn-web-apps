/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from "axios";

export interface getDocumentRequestProps {
  id: string;
  company_name: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface DocumentCategoryProps {
  id: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface GetAllDocumentCategoryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  name?: string;
}

class DocsCategoryService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  public getAllDocsCategory = async (
    params: GetAllDocumentCategoryParams = {},
    token?: string,
    signal?: AbortSignal,
  ): Promise<{ result: []; meta: PaginationMeta }> => {
    try {
      const response = await this.axiosInstance.get(`/v1/document-categories`, {
        params,
        headers: this.getAuthHeaders(token),
        signal,
      });
      const { result, meta } = response.data;
      return {
        result,
        meta: {
          currentPage: meta.current_page,
          totalPages: meta.total_pages,
          totalItems: meta.total_items,
        },
      };
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      const msg = error?.response?.data?.message || "Failed to fetch companies";
      throw new Error(msg);
    }
  };

  public createDocsCategory = async (
    payload: any,
    token?: string,
    signal?: AbortSignal,
  ): Promise<DocumentCategoryProps> => {
    if (!payload.name) throw new Error("Document category name is required");
    try {
      const response = await this.axiosInstance.post(
        `/v1/document-categories`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal,
        },
      );
      return response.data.result;
    } catch (error: any) {
      console.error("Error creating company:", error);
      const msg = error?.response?.data?.message || "Failed to create company";
      throw new Error(msg);
    }
  };

  public getDocsCategoryById = async (
    docsCategoryId: string,
    token?: string,
    signal?: AbortSignal,
  ): Promise<DocumentCategoryProps> => {
    if (!docsCategoryId) throw new Error("Document category ID is required");
    try {
      const response = await this.axiosInstance.get(
        `/v1/document-categories/${encodeURIComponent(docsCategoryId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal,
        },
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error fetching company by ID ${docsCategoryId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch company with ID ${docsCategoryId}`;
      throw new Error(msg);
    }
  };

  public updateDocsCategory = async (
    docsCategoryId: string,
    payload: any,
    token?: string,
    signal?: AbortSignal,
  ): Promise<DocumentCategoryProps> => {
    if (!docsCategoryId) throw new Error("Document category ID is required");
    try {
      const response = await this.axiosInstance.put(
        `/v1/document-categories/${encodeURIComponent(docsCategoryId)}`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal,
        },
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error updating company ${docsCategoryId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to update company with ID ${docsCategoryId}`;
      throw new Error(msg);
    }
  };

  public deleteDocsCategory = async (
    docsCategoryId: string,
    token?: string,
    signal?: AbortSignal,
  ) => {
    if (!docsCategoryId) throw new Error("Company ID is required");
    try {
      const response = await this.axiosInstance.delete(
        `/v1/document-categories/${encodeURIComponent(docsCategoryId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal,
        },
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error deleting company ${docsCategoryId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to delete company with ID ${docsCategoryId}`;
      throw new Error(msg);
    }
  };
}

export default DocsCategoryService;
