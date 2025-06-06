import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import * as dotenv from 'dotenv'
import path from 'path'
import { users } from './schema'
import { UserRole } from '../types'

dotenv.config()

// 초기 사용자 데이터
const initialUsers = [
  {
    name: '관리자',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '일반 사용자',
    email: 'user@example.com',
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: '게스트',
    email: 'guest@example.com',
    role: UserRole.GUEST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const runMigration = async () => {
  // SQLite 데이터베이스 연결
  const sqlite = new Database(process.env.DATABASE_URL || './data/sleep.db')

  // Drizzle 초기화
  const db = drizzle(sqlite)

  console.log('Running migrations...')

  // 마이그레이션 실행
  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../../drizzle')
  })

  console.log('Migrations completed!')

  // 데이터베이스 연결 닫기
  sqlite.close()
}

runMigration().catch(err => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})

export default runMigration
