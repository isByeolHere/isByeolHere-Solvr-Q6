import { FastifyInstance } from 'fastify'
import { sleepService } from '../services/sleepService'

export default async function sleepRoutes(fastify: FastifyInstance) {
  // 모든 수면 기록 조회
  fastify.get('/sleep-records', async (request, reply) => {
    try {
      const records = await sleepService.getAllRecords()
      return records
    } catch (error) {
      reply.code(500).send({ error: '수면 기록을 가져오는데 실패했습니다.' })
    }
  })

  // 특정 수면 기록 조회
  fastify.get('/sleep-records/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const record = await sleepService.getRecordById(id)

      if (!record) {
        return reply.code(404).send({ error: '수면 기록을 찾을 수 없습니다.' })
      }

      return record
    } catch (error) {
      reply.code(500).send({ error: '수면 기록을 가져오는데 실패했습니다.' })
    }
  })

  // 새로운 수면 기록 생성
  fastify.post('/sleep-records', async (request, reply) => {
    try {
      const record = await sleepService.createRecord(request.body as any)
      reply.code(201).send(record)
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: '수면 기록 생성에 실패했습니다.' })
    }
  })

  // 수면 기록 수정
  fastify.put('/sleep-records/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const record = await sleepService.updateRecord(id, request.body as any)

      if (!record) {
        return reply.code(404).send({ error: '수면 기록을 찾을 수 없습니다.' })
      }

      return record
    } catch (error) {
      reply.code(500).send({ error: '수면 기록 수정에 실패했습니다.' })
    }
  })

  // 수면 기록 삭제
  fastify.delete('/sleep-records/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const success = await sleepService.deleteRecord(id)

      if (!success) {
        return reply.code(404).send({ error: '수면 기록을 찾을 수 없습니다.' })
      }

      return { message: '수면 기록이 삭제되었습니다.' }
    } catch (error) {
      reply.code(500).send({ error: '수면 기록 삭제에 실패했습니다.' })
    }
  })

  // 특정 사용자의 최근 N개 수면 기록 조회 라우트
  fastify.get('/sleep-records/stats/recent/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      const { limit } = request.query as { limit?: number }
      const recordLimit = limit ? Number(limit) : 7 // 기본값 7개

      const records = await sleepService.getRecentRecords(userId, recordLimit)
      return records
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: '최근 수면 기록을 가져오는데 실패했습니다.' })
    }
  })

  // 특정 사용자의 최근 1개월 평균 수면 통계 조회 라우트
  fastify.get('/sleep-records/stats/monthly/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      const averages = await sleepService.getMonthlyAverages(userId)

      if (!averages) {
        return reply.code(404).send({ error: '최근 1개월간의 수면 기록이 없습니다.' })
      }

      return averages
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: '월간 평균 수면 통계를 가져오는데 실패했습니다.' })
    }
  })

  // 특정 사용자의 수면 기록 기반 AI 조언 조회 라우트
  fastify.get('/sleep-records/advice/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      const advice = await sleepService.getSleepAdvice(userId)
      return { advice }
    } catch (error) {
      fastify.log.error(error)
      reply.code(500).send({ error: 'AI 수면 조언을 가져오는데 실패했습니다.' })
    }
  })
}
