import React, { useEffect, useState } from 'react'
import { getRecentSleepStats, getMonthlySleepAverages } from '../api/sleep'
import { SleepRecord } from '../types/sleep'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Link } from 'react-router-dom'

const SleepStatsPage: React.FC = () => {
  const [recentRecords, setRecentRecords] = useState<SleepRecord[]>([])
  const [monthlyAverages, setMonthlyAverages] = useState<{
    avgSleepHours: number
    avgSleepScore: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: 사용자 ID는 실제 로그인 기능 구현 시 동적으로 가져와야 합니다.
  const userId = 'user1'
  const recentLimit = 7 // 최근 7일 데이터

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 최근 기록 가져오기
        const recentData = await getRecentSleepStats(userId, recentLimit)
        // 날짜를 기준으로 오름차순 정렬 (그래프 표시를 위해)
        const sortedRecentData = recentData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        setRecentRecords(sortedRecentData)

        // 월간 평균 가져오기
        const monthlyData = await getMonthlySleepAverages(userId)
        setMonthlyAverages(monthlyData)

        setError(null)
      } catch (err) {
        console.error('Error fetching sleep stats:', err)
        setError('수면 통계를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId, recentLimit])

  if (loading) {
    return <div className="text-center mt-8">통계 정보를 불러오는 중...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">오류: {error}</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">수면 통계</h1>

      {/* 최근 수면 점수 그래프 */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">최근 {recentLimit}일간 수면 점수 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={recentRecords}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sleepScore" stroke="#8884d8" name="수면 점수" />
          </LineChart>
        </ResponsiveContainer>
        {recentRecords.length === 0 && (
          <p className="text-center text-gray-600">최근 기록이 없습니다.</p>
        )}
      </div>

      {/* 최근 1개월 평균 통계 */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">최근 1개월 평균</h2>
        {monthlyAverages ? (
          <div>
            <p className="text-lg mb-2">
              평균 수면 시간:{' '}
              <span className="font-bold text-carrot-orange">
                {monthlyAverages.avgSleepHours} 시간
              </span>
            </p>
            <p className="text-lg">
              평균 수면 점수:{' '}
              <span className="font-bold text-carrot-orange">
                {monthlyAverages.avgSleepScore} 점
              </span>
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600">최근 1개월 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  )
}

export default SleepStatsPage
