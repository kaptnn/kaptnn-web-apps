/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataType } from '@/components/layouts/docs/utils/table'
import { AxiosInstance } from 'axios'

const VERSION = '/v1'
const API_PATH = `${VERSION}/document-requests`

export interface DocumentRequestProps {
  id?: string
  request_title: string
  request_desc: string
  admin_id?: string
  target_user_id: string
  category_id: string
  due_date: Date | string
  upload_date?: Date | string
  status?: string
  created_at?: Date
  updated_at?: Date
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface GetAllDocumentRequestParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  status?: string
  admin_id?: string
  target_user_id?: string
  category_id?: string
  name?: string
}

class DocsRequestService {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`
    }
  }

  public getAllDocsRequest = async (
    params: GetAllDocumentRequestParams = {},
    token?: string,
    signal?: AbortSignal
  ): Promise<{ result: DataType[]; meta: PaginationMeta }> => {
    try {
      const response = await this.axiosInstance.get(`${API_PATH}`, {
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
      console.error('Error fetching companies:', error)
      const msg = error?.response?.data?.message || 'Failed to fetch companies'
      throw new Error(msg)
    }
  }

  public getDocsRequestSummary = async (token?: string, signal?: AbortSignal) => {
    try {
      const response = await this.axiosInstance.get(`${API_PATH}/summary`, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error('Error fetching companies:', error)
      const msg = error?.response?.data?.message || 'Failed to fetch companies'
      throw new Error(msg)
    }
  }

  public getDocsRequestStatusSummary = async (token?: string, signal?: AbortSignal) => {
    try {
      const response = await this.axiosInstance.get(`${API_PATH}/summary/status`, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error('Error fetching companies:', error)
      const msg = error?.response?.data?.message || 'Failed to fetch companies'
      throw new Error(msg)
    }
  }

  public createDocsRequest = async (
    payload: any,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!payload) throw new Error('Document request is required')
    try {
      const response = await this.axiosInstance.post(`${API_PATH}`, payload, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error('Error creating company:', error)
      const msg = error?.response?.data?.message || 'Failed to create company'
      throw new Error(msg)
    }
  }

  public getDocsRequestById = async (
    docsReqId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DocumentRequestProps> => {
    if (!docsReqId) throw new Error('Document request ID is required')
    try {
      const response = await this.axiosInstance.get(
        `${API_PATH}/${encodeURIComponent(docsReqId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data.result
    } catch (error: any) {
      console.error(`Error fetching company by ID ${docsReqId}:`, error)
      const msg =
        error?.response?.data?.message || `Failed to fetch company with ID ${docsReqId}`
      throw new Error(msg)
    }
  }

  public updateDocsRequest = async (
    docsReqId: string,
    payload: DocumentRequestProps,
    token?: string,
    signal?: AbortSignal
  ): Promise<DocumentRequestProps> => {
    if (!docsReqId) throw new Error('Document request ID is required')
    try {
      const response = await this.axiosInstance.put(
        `${API_PATH}/${encodeURIComponent(docsReqId)}`,
        payload,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data.result
    } catch (error: any) {
      console.error(`Error updating company ${docsReqId}:`, error)
      const msg =
        error?.response?.data?.message ||
        `Failed to update company with ID ${docsReqId}`
      throw new Error(msg)
    }
  }

  public deleteDocsRequest = async (
    docsReqId: string,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!docsReqId) throw new Error('Document request ID is required')
    try {
      const response = await this.axiosInstance.delete(
        `${API_PATH}/${encodeURIComponent(docsReqId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data.result
    } catch (error: any) {
      console.error(`Error deleting company ${docsReqId}:`, error)
      const msg =
        error?.response?.data?.message ||
        `Failed to delete company with ID ${docsReqId}`
      throw new Error(msg)
    }
  }
}

export default DocsRequestService
