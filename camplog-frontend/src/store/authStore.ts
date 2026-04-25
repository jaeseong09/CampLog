import { create } from 'zustand'
import type { User } from '../types'
import { authApi } from '../api/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  initAuth: () => Promise<void>
  setTokens: (token: string, refreshToken: string) => void
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // 앱 시작 시 localStorage 토큰으로 유저 정보 복원
  initAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const { data } = await authApi.me()
      set({ user: data, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  setTokens: (token, refreshToken) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // 서버 오류여도 클라이언트는 로그아웃
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    set({ user: null, isAuthenticated: false })
  },
}))
