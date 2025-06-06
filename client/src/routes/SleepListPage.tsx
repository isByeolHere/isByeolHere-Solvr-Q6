import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SleepRecord } from '../types/sleep'
import { getSleepRecords, deleteSleepRecord } from '../api/sleep'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const SleepListPage: React.FC = () => {
  const [records, setRecords] = useState<SleepRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const data = await getSleepRecords()
      setRecords(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching records:', err)
      setError('수면 기록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 기록을 삭제하시겠습니까?')) {
      try {
        await deleteSleepRecord(id)
        setRecords(records.filter(record => record.id !== id))
      } catch (err) {
        console.error('Error deleting record:', err)
        alert('기록 삭제에 실패했습니다.')
      }
    }
  }

  const getMoodEmoji = (mood: string) => {
    const moodMap: { [key: string]: string } = {
      '매우 좋음': '😊',
      좋음: '🙂',
      보통: '😐',
      나쁨: '😔',
      '매우 나쁨': '😢'
    }
    return moodMap[mood] || '😐'
  }

  if (loading) {
    return <div className="text-center mt-8">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">오류: {error}</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">수면 기록</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center mb-4">
          <Link
            to="/sleep/stats"
            className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 mr-4"
          >
            통계 보기
          </Link>
          <Link
            to="/sleep/advice"
            className="bg-green-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600"
          >
            AI 수면 조언 받기
          </Link>
        </div>
        <Link
          to="/sleep/new"
          className="bg-carrot-orange text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-orange-700"
        >
          새 기록 추가
        </Link>
      </div>

      {records.length === 0 ? (
        <p className="text-center text-gray-600">기록된 수면 기록이 없습니다.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {records.map(record => (
            <li key={record.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-lg font-semibold">{record.date}</p>
                  <p className="text-gray-700">{record.sleepHours}시간 수면</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/sleep/edit/${record.id}`}
                    className="text-carrot-orange hover:text-orange-700"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{getMoodEmoji(record.mood)}</span>
                  <span className="text-gray-600">{record.mood}</span>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">수면 만족도</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        backgroundColor: '#049B58',
                        width: `${(record.sleepScore / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{record.sleepScore}/5</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SleepListPage
