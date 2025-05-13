/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType } from '@/components/layouts/docs-users/utils/table'
import { LoginUserPayload, RegisterUserPayload } from '@/utils/constants/user'
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

class AuthService {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`
    }
  }

  // AUTHENTICATION
  public registerUser = async (
    payload: RegisterUserPayload,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!payload) throw new Error('User registered data is required')
    try {
      const response = await this.axiosInstance.post(`/v1/auth/register`, payload, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response
    } catch (error: any) {
      console.error('Error register user:', error)
      const msg = error?.response?.data?.message || 'Failed to register user'
      throw new Error(msg)
    }
  }

  public loginUser = async (
    payload: LoginUserPayload,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!payload) throw new Error('User login data is required')
    try {
      const response = await this.axiosInstance.post(`/v1/auth/login`, payload, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error('Error login user:', error)
      const msg = error?.response?.data?.message || 'Failed to login user'
      throw new Error(msg)
    }
  }

  public logoutUser = async (
    token?: string,
    signal?: AbortSignal
  ): Promise<DataType> => {
    try {
      const response = await this.axiosInstance.post(`/v1/auth/logout`, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error('Error logout user:', error)
      const msg = error?.response?.data?.message || 'Failed to logout user'
      throw new Error(msg)
    }
  }

  public refreshAccessToken = async (refreshToken: string, signal?: AbortSignal) => {
    try {
      const response = await this.axiosInstance.post(`/v1/auth/token/refresh`, {
        refreshToken,
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error('Error refreshing access token:', error)
      const msg = error?.response?.data?.message || 'Failed to refresh access token'
      throw new Error(msg)
    }
  }
}

export default AuthService
