import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

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
export const sleepRecords = sqliteTable('sleep_records', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // UUID 대신 TEXT 사용, 기본값 설정
  userId: text('userId').notNull(),
  date: text('date').notNull(), // 날짜는 TEXT로 저장
  sleepHours: real('sleepHours').notNull(), // 수면 시간은 실수형으로 저장
  mood: text('mood').notNull(),
  sleepScore: integer('sleepScore').notNull(), // 만족도는 정수형으로 저장
  createdAt: text('createdAt')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
    .notNull(), // ISO 8601 형식의 UTC 시간
  updatedAt: text('updatedAt')
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
    .notNull()
})

export type SleepRecord = typeof sleepRecords.$inferSelect
export type InsertSleepRecord = typeof sleepRecords.$inferInsert

export type NewSleepRecord = Omit<SleepRecord, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateSleepRecord = Partial<Omit<SleepRecord, 'id' | 'createdAt'>>
