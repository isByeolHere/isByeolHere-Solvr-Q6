// 사용자 타입 정의
export type User = {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'USER' | 'GUEST'
  createdAt: string
  updatedAt: string
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUser = Partial<Omit<User, 'id' | 'createdAt'>>

// 수면 기록 타입 정의
export type SleepRecord = {
  id: string
  userId: string
  date: string
  sleepHours: number
  mood: string
  sleepScore: number
  createdAt: Date
  updatedAt: Date
}

export type NewSleepRecord = Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSleepRecord = Partial<Omit<SleepRecord, 'id' | 'createdAt'>>
