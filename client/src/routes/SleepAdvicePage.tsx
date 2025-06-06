import React, { useEffect, useState } from 'react'
import { getSleepAdvice } from '../api/sleep'

const SleepAdvicePage: React.FC = () => {
  const [advice, setAdvice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: 사용자 ID는 실제 로그인 기능 구현 시 동적으로 가져와야 합니다.
  const userId = 'user1'

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true)
        const aiAdvice = await getSleepAdvice(userId)
        setAdvice(aiAdvice)
        setError(null)
      } catch (err) {
        console.error('Error fetching sleep advice:', err)
        setError('AI 수면 조언을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdvice()
  }, [userId])

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-carrot-orange">AI 수면 조언</h1>

      {loading && <p className="text-center mt-8">조언을 생성하는 중입니다...</p>}
      {error && <p className="text-center mt-8 text-red-500">오류: {error}</p>}

      {advice && (
        <div className="bg-white shadow rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">수면 건강을 위한 조언</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>') }}
          ></div>
        </div>
      )}

      {!loading && !error && !advice && (
        <p className="text-center text-gray-600 mt-8">
          아직 수면 조언이 없습니다. 기록을 추가해보세요.
        </p>
      )}
    </div>
  )
}

export default SleepAdvicePage
