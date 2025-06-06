import initSqlJs, { Database } from 'sql.js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = path.join(__dirname, '../../data/sleep.db')

let db: Database

// 데이터베이스 초기화
export const initializeDatabase = async () => {
  const SQL = await initSqlJs()

  // 데이터베이스 파일이 존재하면 로드, 없으면 새로 생성
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(filebuffer)
  } else {
    db = new SQL.Database()
  }

  // 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS sleep_records (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      date TEXT NOT NULL,
      sleepHours INTEGER NOT NULL,
      mood TEXT NOT NULL,
      sleepScore INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  console.log('데이터베이스 연결 성공')
}

// 쿼리 실행 함수들
export const query = {
  all: (sql: string, params: any[] = []) => {
    const stmt = db.prepare(sql)
    stmt.bind(params)
    const results = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  },
  get: (sql: string, params: any[] = []) => {
    const stmt = db.prepare(sql)
    stmt.bind(params)
    const result = stmt.step() ? stmt.getAsObject() : null
    stmt.free()
    return result
  },
  run: (sql: string, params: any[] = []) => {
    const stmt = db.prepare(sql)
    stmt.run(params)
    stmt.free()
    return { changes: db.getRowsModified() }
  }
}

// 데이터베이스 저장 및 종료
export const closeDatabase = () => {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
  db.close()
}

export default query
