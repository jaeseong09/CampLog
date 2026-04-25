import client from './client'
import type { CampsiteResponse } from '../types'

export const campsiteApi = {
  get: () => client.get<CampsiteResponse>('/api/campsite'),
}
