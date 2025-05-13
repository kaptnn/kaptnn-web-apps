/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType } from '@/components/layouts/docs-users/utils/table'
import { UpdateUserProfilePayload } from '@/utils/constants/user'
import { AxiosInstance } from 'axios'

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface GetAllUsersParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  email?: string
  name?: string
  company_id?: string
}

class UserService {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`
    }
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
        signal
      })
      const { result, meta } = response.data
      return {
        result,
        meta: {
          currentPage: meta.current_page,
          totalPages: meta.total_pages,
          totalItems: meta.total_items
        }
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      const msg = error?.response?.data?.message || 'Failed to fetch users'
      throw new Error(msg)
    }
  }

  public getCurrentUser = async (
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    try {
      const response = await this.axiosInstance.get(`/v1/users/me`, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error(`Error fetching current user:`, error)
      const msg = error?.response?.data?.message || `Failed to fetch current user`
      throw new Error(msg)
    }
  }

  public updateCurrentUserProfile = async (
    payload: UpdateUserProfilePayload,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    try {
      const response = await this.axiosInstance.put(`/v1/users/me/profile`, payload, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error(`Error fetching current user:`, error)
      const msg = error?.response?.data?.message || `Failed to fetch current user`
      throw new Error(msg)
    }
  }

  public getUserById = async (
    userId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    if (!userId) throw new Error('User ID is required')
    try {
      const response = await this.axiosInstance.get(
        `/v1/users/${encodeURIComponent(userId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data
    } catch (error: any) {
      console.error(`Error fetching user by ID ${userId}:`, error)
      const msg =
        error?.response?.data?.message || `Failed to fetch user with ID ${userId}`
      throw new Error(msg)
    }
  }

  public updateUserById = async (
    userId: string,
    payload: UpdateUserProfilePayload,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    if (!userId) throw new Error('User ID is required')
    try {
      const response = await this.axiosInstance.put(
        `/v1/users/${encodeURIComponent(userId)}`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data.result
    } catch (error: any) {
      console.error(`Error fetching user by ID ${userId}:`, error)
      const msg =
        error?.response?.data?.message || `Failed to fetch user with ID ${userId}`
      throw new Error(msg)
    }
  }

  public deleteUserById = async (
    userId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    if (!userId) throw new Error('User ID is required')
    try {
      const response = await this.axiosInstance.delete(
        `/v1/users/${encodeURIComponent(userId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data.result
    } catch (error: any) {
      console.error(`Error fetching user by ID ${userId}:`, error)
      const msg =
        error?.response?.data?.message || `Failed to fetch user with ID ${userId}`
      throw new Error(msg)
    }
  }
}

export default UserService
