import { v4 as uuidv4 } from 'uuid'
import { initializeDatabase, closeDatabase, query } from '../src/db'

const generateDummyData = async () => {
  await initializeDatabase()
  console.log('데이터베이스 초기화 완료')

  const userId = 'user1'
  const now = new Date()
  const recordsToGenerate = 30 // 약 1개월치 데이터

  console.log(`${recordsToGenerate}개의 더미 데이터 생성 중...`)

  for (let i = 0; i < recordsToGenerate; i++) {
    const date = new Date(now.setDate(now.getDate() - i))
    const dateString = date.toISOString().split('T')[0]
    const id = uuidv4()
    const createdAt = date.toISOString()
    const updatedAt = date.toISOString()

    // 랜덤 수면 시간 (6시간 ~ 10시간 사이)
    const sleepHours = parseFloat((Math.random() * 4 + 6).toFixed(1))

    // 랜덤 수면 점수 (1점 ~ 5점 사이)
    const sleepScore = Math.floor(Math.random() * 5) + 1

    // 랜덤 기분
    const moods = ['매우 좋음', '좋음', '보통', '나쁨', '매우 나쁨']
    const mood = moods[Math.floor(Math.random() * moods.length)]

    const newRecord = {
      id,
      userId,
      date: dateString,
      sleepHours,
      mood,
      sleepScore,
      createdAt,
      updatedAt
    }

    try {
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
      // console.log(`Inserted record for ${dateString}`)
    } catch (error) {
      console.error(`Error inserting record for ${dateString}:`, error)
    }
  }

  console.log('더미 데이터 생성 완료.')

  await closeDatabase()
  console.log('데이터베이스 연결 종료')
}

generateDummyData().catch(console.error)
