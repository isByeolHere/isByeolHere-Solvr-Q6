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
}
