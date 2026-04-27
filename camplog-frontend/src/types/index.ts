export interface User {
  id: number
  email: string
  nickname: string
  avatarType: string | null
  totalStudyTime: number // 분 단위
}

export interface AuthResponse {
  token: string
  refreshToken: string
}

export interface SessionStartResponse {
  id: number
  startedAt: string
}

export interface SessionEndResponse {
  id: number
  startedAt: string
  endedAt: string
  duration: number
  focusScore: number
  pauseCount: number
  newlyUnlockedItems: string[]
}

export interface SessionResponse {
  id: number
  startedAt: string
  endedAt: string | null
  duration: number | null
  focusScore: number | null
  pauseCount: number | null
}

export interface CampsiteItemResponse {
  itemType: string
  unlockedAt: string
}

export interface CampsiteResponse {
  totalStudyTime: number
  nextUnlockMinutes: number | null
  unlockedItems: CampsiteItemResponse[]
}

export interface RankingEntry {
  rank: number
  userId: number
  nickname: string
  avatarType: string | null
  studyMinutes: number
}