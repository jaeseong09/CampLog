import client from './client'
import type { RankingEntry } from '../types'

export const rankingApi = {
  weekly:   () => client.get<RankingEntry[]>('/api/rankings/weekly'),
  lastWeek: () => client.get<RankingEntry[]>('/api/rankings/last-week'),
  monthly:  () => client.get<RankingEntry[]>('/api/rankings/monthly'),
  allTime:  () => client.get<RankingEntry[]>('/api/rankings/all-time'),
}