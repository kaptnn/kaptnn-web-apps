/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios'

export interface DocumentManagerProps {
  id: string
  request_id?: string
  uploaded_by?: string
  company_id?: string
  document_name?: string
  document_path?: string
  file_size?: number
  mime_type?: string
  created_at?: Date
  updated_at?: Date
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface GetAllDocumentManagerParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  name?: string
}

export interface CreateDocMetadata {
  request_id: string
}

export interface UpdateDocMetadata {
  document_name?: string
}

class DocsManagerService {
  private axiosInstance: AxiosInstance

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  private getAuthHeaders(token?: string) {
    return {
      Authorization: `Bearer ${token}`
    }
  }

  public getAllDocsManager = async (
    params: GetAllDocumentManagerParams = {},
    token?: string,
    signal?: AbortSignal
  ): Promise<{ result: DocumentManagerProps[]; meta: PaginationMeta }> => {
    try {
      const response = await this.axiosInstance.get(`/v1/documents`, {
        params,
        headers: this.getAuthHeaders(token),
        signal
      })
      const { result, pagination } = response.data
      return {
        result,
        meta: {
          currentPage: pagination.current_page,
          totalPages: pagination.total_pages,
          totalItems: pagination.total_items
        }
      }
    } catch (error: any) {
      console.error('Error fetching companies:', error)
      const msg = error?.response?.data?.message || 'Failed to fetch companies'
      throw new Error(msg)
    }
  }

  public getDocsManagerById = async (
    docsId: string,
    token?: string,
    signal?: AbortSignal
  ): Promise<DocumentManagerProps> => {
    if (!docsId) throw new Error('Company ID is required')
    try {
      const response = await this.axiosInstance.get(
        `/v1/documents/${encodeURIComponent(docsId)}`,
        {
          headers: this.getAuthHeaders(token),
          signal
        }
      )
      return response.data.result
    } catch (error: any) {
      console.error(`Error fetching company by ID ${docsId}:`, error)
      const msg =
        error?.response?.data?.message || `Failed to fetch company with ID ${docsId}`
      throw new Error(msg)
    }
  }

  public createDocsManager = async (
    metadata: CreateDocMetadata,
    file: File,
    token?: string,
    signal?: AbortSignal
  ): Promise<DocumentManagerProps> => {
    if (!file) throw new Error('File is required for upload')

    const formData = new FormData()
    formData.append('request_id', metadata.request_id)
    formData.append('file', file, file.name)

    try {
      const response = await this.axiosInstance.post(`/v1/documents`, formData, {
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

  public updateDocsManager = async (
    docsId: string,
    metadata: UpdateDocMetadata,
    file?: File,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!docsId) throw new Error('Document ID is required')
    if (file) {
      const formData = new FormData()
      if (metadata.document_name) {
        formData.append('document_name', metadata.document_name)
      }
      formData.append('file', file, file.name)

      try {
        const response = await this.axiosInstance.put(
          `/v1/documents/${encodeURIComponent(docsId)}`,
          formData,
          {
            headers: this.getAuthHeaders(token),
            signal
          }
        )
        return response.data.result
      } catch (error: any) {
        console.error(`Error updating company ${docsId}:`, error)
        const msg =
          error?.response?.data?.message || `Failed to update company with ID ${docsId}`
        throw new Error(msg)
      }
    }
  }

  public deleteDocsManager = async (
    docsId: string,
    token?: string,
    signal?: AbortSignal
  ) => {
    if (!docsId) throw new Error('Document ID is required')
    try {
      const response = await this.axiosInstance.delete<{
        message: string
        result: { id: string }
      }>(`/v1/documents/${encodeURIComponent(docsId)}`, {
        headers: this.getAuthHeaders(token),
        signal
      })
      return response.data.result
    } catch (error: any) {
      console.error(`Error deleting company ${docsId}:`, error)
      const msg =
        error?.response?.data?.message || `Failed to delete company with ID ${docsId}`
      throw new Error(msg)
    }
  }
}

export default DocsManagerService
