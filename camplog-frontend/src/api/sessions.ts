import client from './client'
import type { SessionStartResponse, SessionEndResponse, SessionResponse } from '../types'

export const sessionsApi = {
  start: () =>
    client.post<SessionStartResponse>('/api/sessions/start'),

  end: (id: number, focusScore: number, pauseCount: number) =>
    client.patch<SessionEndResponse>(`/api/sessions/${id}/end`, { focusScore, pauseCount }),

  today: () =>
    client.get<SessionResponse[]>('/api/sessions/today'),

  weekly: () =>
    client.get<SessionResponse[]>('/api/sessions/weekly'),

  getActive: () =>
    client.get<SessionStartResponse | null>('/api/sessions/active'),
}
