import { SleepRecord, CreateSleepRecordInput, UpdateSleepRecordInput } from '../types/sleep'

// 메모리 데이터베이스
const sleepRecords: SleepRecord[] = []

export const getSleepRecords = (userId: string): SleepRecord[] => {
  return sleepRecords
    .filter(record => record.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export const getSleepRecordById = (id: string): SleepRecord | null => {
  return sleepRecords.find(record => record.id === id) || null
}

export const createSleepRecord = (input: CreateSleepRecordInput): SleepRecord => {
  const now = new Date().toISOString()
  const id = crypto.randomUUID()

  const record: SleepRecord = {
    id,
    ...input,
    createdAt: now,
    updatedAt: now
  }

  sleepRecords.push(record)
  return record
}

export const updateSleepRecord = (
  id: string,
  input: UpdateSleepRecordInput
): SleepRecord | null => {
  const index = sleepRecords.findIndex(record => record.id === id)

  if (index === -1) {
    return null
  }

  const updatedRecord: SleepRecord = {
    ...sleepRecords[index],
    ...input,
    updatedAt: new Date().toISOString()
  }

  sleepRecords[index] = updatedRecord
  return updatedRecord
}

export const deleteSleepRecord = (id: string): boolean => {
  const index = sleepRecords.findIndex(record => record.id === id)

  if (index === -1) {
    return false
  }

  sleepRecords.splice(index, 1)
  return true
}
