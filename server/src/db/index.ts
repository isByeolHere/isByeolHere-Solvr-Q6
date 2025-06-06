import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import env from '../config/env'
import * as schema from './schema'
import { Database as DrizzleDatabase } from '../types/database'
import * as dotenv from 'dotenv'

dotenv.config()

let db: ReturnType<typeof drizzle>

// PostgreSQL 연결 풀 생성
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function initializeDatabase() {
  db = drizzle(pool, { schema })
}

export async function getDb() {
  if (!db) {
    await initializeDatabase()
  }
  return db
}

export type { Database }

export default { initializeDatabase, getDb }

// 테이블 생성 쿼리
export const createTables = async () => {
  const client = await pool.connect()
  try {
    // 기존 테이블 삭제
    await client.query(`DROP TABLE IF EXISTS sleep_records;`)

    // 새 테이블 생성
    await client.query(`
      CREATE TABLE IF NOT EXISTS sleep_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        sleep_hours INTEGER NOT NULL,
        mood TEXT NOT NULL,
        sleep_score INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  } finally {
    client.release()
  }
}

// 수면 기록 관련 쿼리
export const sleepRecords = {
  async create(data: {
    userId: string
    date: string
    sleepHours: number
    mood: string
    sleepScore: number
  }) {
    const { userId, date, sleepHours, mood, sleepScore } = data
    const result = await pool.query(
      `INSERT INTO sleep_records (id, user_id, date, sleep_hours, mood, sleep_score)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, date, sleepHours, mood, sleepScore]
    )
    return result.rows[0]
  },

  async findAll(userId: string) {
    const result = await pool.query(
      'SELECT * FROM sleep_records WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    )
    return result.rows
  },

  async findById(id: string) {
    const result = await pool.query('SELECT * FROM sleep_records WHERE id = $1', [id])
    return result.rows[0]
  },

  async update(id: string, data: { sleepHours?: number; mood?: string; sleepScore?: number }) {
    const { sleepHours, mood, sleepScore } = data
    const result = await pool.query(
      `UPDATE sleep_records 
       SET sleep_hours = COALESCE($1, sleep_hours),
           mood = COALESCE($2, mood),
           sleep_score = COALESCE($3, sleep_score),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [sleepHours, mood, sleepScore, id]
    )
    return result.rows[0]
  },

  async delete(id: string) {
    await pool.query('DELETE FROM sleep_records WHERE id = $1', [id])
  }
}
