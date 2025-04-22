/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType } from "@/components/layouts/docs-users/utils/table";
import { LoginUserPayload, RegisterUserPayload } from "@/utils/constants/user";
import { AxiosInstance } from "axios";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

class UserService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // USER MANAGEMENT

  public getAllUsers = async (
    params: GetAllUsersParams = {},
    token?: string,
    signal?: AbortSignal
  ): Promise<{ result: DataType[]; meta: PaginationMeta }> => {
    try {
      const response = await this.axiosInstance.get(`/v1/users`, {
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
      console.error("Error fetching users:", error);
      const msg = error?.response?.data?.message || "Failed to fetch users";
      throw new Error(msg);
    }
  };

  public getCurrentUser = async (
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    try {
      const response = await this.axiosInstance.get(`/v1/users/me`, {
        headers: this.getAuthHeaders(token),
        signal,
      });
      return response.data.result;
    } catch (error: any) {
      console.error(`Error fetching current user:`, error);
      const msg =
        error?.response?.data?.message || `Failed to fetch current user`;
      throw new Error(msg);
    }
  };

  public getUserById = async (
    userId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    if (!userId) throw new Error("User ID is required");
    try {
      const response = await this.axiosInstance.get(
        `/v1/users/user/id/${encodeURIComponent(userId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error fetching user by ID ${userId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch user with ID ${userId}`;
      throw new Error(msg);
    }
  };

  public getUserByEmail = async (
    userEmail: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    if (!userEmail) throw new Error("User email is required");
    try {
      const response = await this.axiosInstance.get(
        `/v1/users/user/email/${encodeURIComponent(userEmail)}`,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error fetching user by email ${userEmail}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch user with email ${userEmail}`;
      throw new Error(msg);
    }
  };

  public getUserByCompanyId = async (
    companyId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    if (!companyId) throw new Error("Company ID is required");
    try {
      const response = await this.axiosInstance.get(
        `/v1/users/user/company/${encodeURIComponent(companyId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response.data.result;
    } catch (error: any) {
      console.error(`Error fetching user by company ID ${companyId}:`, error);
      const msg =
        error?.response?.data?.message ||
        `Failed to fetch user with company ID ${companyId}`;
      throw new Error(msg);
    }
  };

  // AUTHENTICATION

  public registerUser = async (
    payload: RegisterUserPayload,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!payload) throw new Error("User registered data is required");
    try {
      const response = await this.axiosInstance.post(
        `/v1/auth/register`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response;
    } catch (error: any) {
      console.error("Error register user:", error);
      const msg = error?.response?.data?.message || "Failed to register user";
      throw new Error(msg);
    }
  };

  public loginUser = async (
    payload: LoginUserPayload,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!payload) throw new Error("User login data is required");
    try {
      const response = await this.axiosInstance.post(
        `/v1/auth/login`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal,
        }
      );
      return response.data.result;
    } catch (error: any) {
      console.error("Error login user:", error);
      const msg = error?.response?.data?.message || "Failed to login user";
      throw new Error(msg);
    }
  };

  public logoutUser = async (
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    try {
      const response = await this.axiosInstance.post(`/v1/auth/logout`, {
        headers: this.getAuthHeaders(token),
        signal,
      });
      return response.data.result;
    } catch (error: any) {
      console.error("Error logout user:", error);
      const msg = error?.response?.data?.message || "Failed to logout user";
      throw new Error(msg);
    }
  };

  public refreshAccessToken = async (
    refreshToken: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    try {
      const response = await this.axiosInstance.post(`/v1/auth/token/refresh`, {
        refreshToken,
        signal,
      });
      return response.data.result;
    } catch (error: any) {
      console.error("Error refreshing access token:", error);
      const msg =
        error?.response?.data?.message || "Failed to refresh access token";
      throw new Error(msg);
    }
  };
}

export default UserService;
