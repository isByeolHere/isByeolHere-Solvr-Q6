import { SleepRecord, CreateSleepRecordInput, UpdateSleepRecordInput } from '../types/sleep'

const API_URL = 'http://localhost:3000/api'

export const getSleepRecords = async (): Promise<SleepRecord[]> => {
  const response = await fetch(`${API_URL}/sleep-records`, {
    credentials: 'same-origin'
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: any[] = await response.json()
  return data.map(record => ({
    ...record,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
    date: record.date
  }))
}

export const createSleepRecord = async (data: CreateSleepRecordInput): Promise<SleepRecord> => {
  const response = await fetch(`${API_URL}/sleep-records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const record: any = await response.json()
  return {
    ...record,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
    date: record.date
  }
}

export const updateSleepRecord = async (
  id: string,
  data: UpdateSleepRecordInput
): Promise<SleepRecord> => {
  const response = await fetch(`${API_URL}/sleep-records/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const record: any = await response.json()
  return {
    ...record,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
    date: record.date
  }
}

export const deleteSleepRecord = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/sleep-records/${id}`, {
    method: 'DELETE',
    credentials: 'same-origin'
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

export const getSleepRecordById = async (id: string): Promise<SleepRecord> => {
  const response = await fetch(`${API_URL}/sleep-records/${id}`, {
    credentials: 'same-origin'
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const record: any = await response.json()

  if (!record) {
    throw new Error('Record not found')
  }

  return {
    ...record,
    createdAt: new Date(record.created_at),
    updatedAt: new Date(record.updated_at),
    date: record.date
  }
}

export interface CreateSleepRecordInput {
  userId: string
  date: string
  sleepHours: number
  mood: string
  sleepScore: number
}

export type UpdateSleepRecordInput = Partial<Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>>
