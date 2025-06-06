export interface SleepRecord {
  id: string
  userId: string
  date: string
  sleepHours: number
  mood: string
  sleepScore: number
  createdAt: string
  updatedAt: string
}

export interface CreateSleepRecordInput {
  userId: string
  date: string
  sleepHours: number
  mood: string
  sleepScore: number
}

export interface UpdateSleepRecordInput {
  sleepHours?: number
  mood?: string
  sleepScore?: number
}

export interface SleepRecordFormState {
  date: string
  sleepHours: number
  mood: string
  sleepScore: number
}
