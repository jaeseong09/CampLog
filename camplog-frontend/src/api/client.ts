import axios from 'axios'
import type { AuthResponse } from '../types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 동시에 여러 401이 와도 refresh는 한 번만 호출
let refreshPromise: Promise<AuthResponse> | null = null

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<AuthResponse>(
              `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/auth/refresh`,
              { refreshToken }
            )
            .then(res => res.data)
            .finally(() => { refreshPromise = null })
        }

        const data = await refreshPromise
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        original.headers.Authorization = `Bearer ${data.token}`
        return client(original)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default client
