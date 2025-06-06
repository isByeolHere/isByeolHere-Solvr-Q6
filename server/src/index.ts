import fastify from 'fastify'
import cors from '@fastify/cors'
import { createTables } from './db'
import { sleepRoutes } from './routes/sleepRoutes'

const server = fastify({
  logger: true
})

// CORS 설정
server.register(cors, {
  origin: ['http://localhost:5173'], // Vite의 기본 포트
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})

// 수면 기록 라우트 등록
server.register(sleepRoutes, { prefix: '/api' })

// 서버 시작
const start = async () => {
  try {
    // 데이터베이스 테이블 생성
    await createTables()
    console.log('Database tables created successfully')

    // 서버 시작
    await server.listen({
      port: 3000, // 포트를 3000으로 강제 설정
      host: process.env.HOST || '0.0.0.0'
    })
    console.log('Server is running on port 3000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
