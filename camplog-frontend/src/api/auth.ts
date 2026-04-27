import client from './client'
import type { AuthResponse, User } from '../types'

export const authApi = {
  login: (email: string, password: string) =>
    client.post<AuthResponse>('/api/auth/login', { email, password }),

  signup: (email: string, password: string, nickname: string, avatarType?: string) =>
    client.post<string>('/api/auth/signup', { email, password, nickname, avatarType }),

  me: () => client.get<User>('/api/auth/me'),

  refresh: (refreshToken: string) =>
    client.post<AuthResponse>('/api/auth/refresh', { refreshToken }),

  logout: () => client.post('/api/auth/logout'),

  googleLogin: (credential: string) =>
    client.post<AuthResponse>('/api/auth/google', { credential }),

  updateProfile: (nickname: string) =>
    client.patch<User>('/api/auth/profile', { nickname }),
}
