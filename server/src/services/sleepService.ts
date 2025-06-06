import { v4 as uuidv4 } from 'uuid'
import query from '../db'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini API 키를 환경 변수에서 가져옵니다.
const API_KEY = process.env.GEMINI_API_KEY

// API 키가 없으면 오류 발생
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.')
}

// GoogleGenerativeAI 인스턴스 생성
const genAI = new GoogleGenerativeAI(API_KEY)

// 사용할 모델 설정 (예: gemini-1.5-flash 또는 gemini-pro)
// 가볍고 빠른 응답을 위해 gemini-1.5-flash 사용
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

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
  },

  // 특정 사용자의 최근 N개 수면 기록 조회
  async getRecentRecords(userId: string, limit: number): Promise<SleepRecord[]> {
    const records = await query.all(
      'SELECT id, userId, date, sleepHours, mood, sleepScore, created_at AS createdAt, updated_at AS updatedAt FROM sleep_records WHERE userId = ? ORDER BY date DESC LIMIT ?',
      [userId, limit]
    )
    return records as SleepRecord[]
  },

  // 특정 사용자의 최근 1개월간 평균 수면 시간 및 평균 수면 점수 계산
  async getMonthlyAverages(
    userId: string
  ): Promise<{ avgSleepHours: number; avgSleepScore: number } | null> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0]

    const records = await query.all(
      'SELECT sleepHours, sleepScore FROM sleep_records WHERE userId = ? AND date >= ? ORDER BY date DESC',
      [userId, thirtyDaysAgoString]
    )

    if (records.length === 0) {
      return null // 최근 1개월 데이터가 없을 경우
    }

    const totalSleepHours = records.reduce((sum, record: any) => sum + record.sleepHours, 0)
    const totalSleepScore = records.reduce((sum, record: any) => sum + record.sleepScore, 0)

    const avgSleepHours = parseFloat((totalSleepHours / records.length).toFixed(1))
    const avgSleepScore = parseFloat((totalSleepScore / records.length).toFixed(1))

    return { avgSleepHours, avgSleepScore }
  },

  // 사용자의 수면 기록을 바탕으로 AI 조언 생성
  async getSleepAdvice(userId: string): Promise<string> {
    // 최근 7일간의 기록을 가져옵니다.
    const recentRecords = await this.getRecentRecords(userId, 7)

    if (recentRecords.length === 0) {
      return '최근 수면 기록이 부족하여 정확한 조언을 드리기 어렵습니다. 몇 개의 기록을 더 추가해주세요.'
    }

    // 기록을 바탕으로 AI에게 전달할 프롬프트 생성
    let prompt = `다음은 사용자의 최근 수면 기록입니다. 이 데이터를 바탕으로 사용자의 수면 패턴을 진단하고, 수면 건강을 개선하기 위한 구체적이고 실용적인 조언을 3-5가지 제공해주세요. 응답은 한국어로 해주세요.\n\n`

    recentRecords.forEach(record => {
      prompt += `날짜: ${record.date}, 수면 시간: ${record.sleepHours}시간, 기분: ${record.mood}, 수면 만족도: ${record.sleepScore}/5\n`
    })

    prompt += `\n진단 및 조언:`

    try {
      // Gemini 모델 호출
      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()
      return text
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      return 'AI 조언 생성 중 오류가 발생했습니다.'
    }
  }
}
