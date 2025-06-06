import { v4 as uuidv4 } from 'uuid'
import query from '../db'

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

export const sleepService = {
  async getAllRecords(): Promise<SleepRecord[]> {
    const records = await query.all(
      'SELECT id, userId, date, sleepHours, mood, sleepScore, created_at, updated_at FROM sleep_records ORDER BY date DESC'
    )
    return records as SleepRecord[]
  },

  async getRecordById(id: string): Promise<SleepRecord | null> {
    const record = await query.get('SELECT * FROM sleep_records WHERE id = ?', [id])
    return (record as SleepRecord) || null
  },

  async createRecord(
    record: Omit<SleepRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<SleepRecord> {
    const id = uuidv4()
    const now = new Date().toISOString()

    const newRecord: SleepRecord = {
      ...record,
      id,
      createdAt: now,
      updatedAt: now
    }

    await query.run(
      'INSERT INTO sleep_records (id, userId, date, sleepHours, mood, sleepScore, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        newRecord.id,
        newRecord.userId,
        newRecord.date,
        newRecord.sleepHours,
        newRecord.mood,
        newRecord.sleepScore,
        newRecord.createdAt,
        newRecord.updatedAt
      ]
    )

    return newRecord
  },

  async updateRecord(
    id: string,
    record: Partial<Omit<SleepRecord, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<SleepRecord | null> {
    const existingRecord = await this.getRecordById(id)
    if (!existingRecord) return null

    const updatedRecord = {
      ...existingRecord,
      ...record,
      updatedAt: new Date().toISOString()
    }

    await query.run(
      'UPDATE sleep_records SET userId = ?, date = ?, sleepHours = ?, mood = ?, sleepScore = ?, updated_at = ? WHERE id = ?',
      [
        updatedRecord.userId,
        updatedRecord.date,
        updatedRecord.sleepHours,
        updatedRecord.mood,
        updatedRecord.sleepScore,
        updatedRecord.updatedAt,
        id
      ]
    )

    return updatedRecord
  },

  async deleteRecord(id: string): Promise<boolean> {
    const result = await query.run('DELETE FROM sleep_records WHERE id = ?', [id])
    return result.changes > 0
  }
}
