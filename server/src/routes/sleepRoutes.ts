import { FastifyInstance } from 'fastify'
import {
  getSleepRecords,
  getSleepRecordById,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord
} from '../services/sleepService'

export const sleepRoutes = async (fastify: FastifyInstance) => {
  // 수면 기록 목록 조회
  fastify.get('/sleep-records', async (request, reply) => {
    const { userId } = request.query as { userId: string }
    const records = getSleepRecords(userId)
    return records
  })

  // 수면 기록 상세 조회
  fastify.get('/sleep-records/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const record = getSleepRecordById(id)

    if (!record) {
      reply.code(404)
      return { error: '수면 기록을 찾을 수 없습니다.' }
    }

    return record
  })

  // 수면 기록 생성
  fastify.post('/sleep-records', async (request, reply) => {
    const record = createSleepRecord(request.body as any)
    reply.code(201)
    return record
  })

  // 수면 기록 수정
  fastify.put('/sleep-records/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const updatedRecord = updateSleepRecord(id, request.body as any)

    if (!updatedRecord) {
      reply.code(404)
      return { error: '수면 기록을 찾을 수 없습니다.' }
    }

    return updatedRecord
  })

  // 수면 기록 삭제
  fastify.delete('/sleep-records/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const success = deleteSleepRecord(id)

    if (!success) {
      reply.code(404)
      return { error: '수면 기록을 찾을 수 없습니다.' }
    }

    return { success: true }
  })
}
