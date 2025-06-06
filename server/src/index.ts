import fastify from 'fastify'
import cors from '@fastify/cors'
import sleepRoutes from './routes/sleepRoutes'
import { initializeDatabase, closeDatabase } from './db'

const server = fastify({
  logger: true
})

// CORS 설정
server.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

// 라우트 등록
server.register(sleepRoutes, { prefix: '/api' })

// 서버 시작
const start = async () => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase()

    await server.listen({ port: 3000, host: '0.0.0.0' })
    console.log('서버가 3000번 포트에서 실행 중입니다.')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// 서버 종료 시 데이터베이스 연결 종료
process.on('SIGINT', async () => {
  await closeDatabase()
  process.exit(0)
})

start()
