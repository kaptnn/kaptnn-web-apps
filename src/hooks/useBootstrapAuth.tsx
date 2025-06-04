import { useState, useEffect } from 'react'
import axiosInstance from '@/utils/axios'
import useAuthStore from '@/stores/AuthStore'

export function useBootstrapAuth() {
  const [ready, setReady] = useState(false)
  const { setAuth, clearAuth, refreshToken } = useAuthStore()

  useEffect(() => {
    const config = {
      withCredentials: true,
      params: refreshToken ? { refresh_token: refreshToken } : undefined
    }

    axiosInstance
      .post('v1/auth/token/refresh', null, config)
      .then(({ data }) => {
        const { access_token, refresh_token } = data.result
        setAuth(access_token, refresh_token)
      })
      .catch(err => {
        clearAuth()
        console.error('Failed to bootstrap auth', err)
      })
      .finally(() => {
        setReady(true)
      })
  }, [setAuth, clearAuth, refreshToken])

  return ready
}
