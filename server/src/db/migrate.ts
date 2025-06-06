import { drizzle } from 'drizzle-orm/pg-core'
import { migrate } from 'drizzle-orm/pg-core/migrator'
import { Pool } from 'pg'
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
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  const db = drizzle(pool)

  console.log('Running migrations...')

  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../../drizzle')
  })

  console.log('Migrations completed!')

  await pool.end()
}

runMigration().catch(err => {
  console.error('Migration failed!')
  console.error(err)
  process.exit(1)
})

export default runMigration
