/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import packageJson from '../../../package.json'
import useAuthStore from '@/stores/AuthStore'

const isServer = typeof window === 'undefined'
const APP_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL: isServer ? `${APP_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-App-Version': packageJson.version
  },
  timeout: 5 * 1000,
  withCredentials: true
})

axiosInstance.interceptors.request.use(
  config => {
    const token = useAuthStore.getState().accessToken
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err)
)

let isRefreshing = false
let queue: Array<{
  resolve: (tok: string) => void
  reject: (err: any) => void
}> = []

function processQueue(error: any, token: string | null = null) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token!)))
  queue = []
}

axiosInstance.interceptors.response.use(
  res => res,
  error => {
    const { response, config: originalReq } = error
    if (response?.status === 401 && !originalReq._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then(newToken => {
          if (originalReq.headers) {
            originalReq.headers['Authorization'] = `Bearer ${newToken}`
          }
          return axiosInstance(originalReq)
        })
      }

      originalReq._retry = true
      isRefreshing = true

      return new Promise((resolve, reject) => {
        axiosInstance
          .post('/v1/auth/token/refresh', {}, { withCredentials: true })
          .then(({ data }) => {
            const { access_token, refresh_token } = data.result
            useAuthStore.getState().setAuth(access_token, refresh_token)
            processQueue(null, access_token)
            originalReq.headers.Authorization = `Bearer ${access_token}`
            resolve(axiosInstance(originalReq))
          })
          .catch(err => {
            processQueue(err, null)
            useAuthStore.getState().clearAuth()
            reject(err)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
