import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createSleepRecord, updateSleepRecord, getSleepRecordById } from '../api/sleep'
import {
  CreateSleepRecordInput,
  UpdateSleepRecordInput,
  SleepRecord,
  SleepRecordFormState
} from '../types/sleep'

const SleepRecordForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<SleepRecordFormState>({
    date: new Date().toISOString().split('T')[0],
    sleepHours: 8,
    mood: '보통',
    sleepScore: 3
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecordToEdit = async () => {
      if (id) {
        setLoading(true)
        try {
          const record = await getSleepRecordById(id)
          setFormData({
            date: record.date,
            sleepHours: record.sleepHours,
            mood: record.mood,
            sleepScore: record.sleepScore
          })
        } catch (error) {
          console.error('Error fetching record for editing:', error)
          setError('기록을 불러오는 데 실패했습니다.')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchRecordToEdit()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'sleepHours' || name === 'sleepScore' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const userId = 'user1'

    try {
      if (id) {
        const updateData: UpdateSleepRecordInput = {
          sleepHours: formData.sleepHours,
          mood: formData.mood,
          sleepScore: formData.sleepScore
        }
        await updateSleepRecord(id, updateData)
        alert('기록이 성공적으로 수정되었습니다.')
      } else {
        await createSleepRecord({
          ...(formData as CreateSleepRecordInput),
          userId
        })
        alert('기록이 성공적으로 추가되었습니다.')
      }
      navigate('/sleep')
    } catch (error) {
      console.error('Error saving sleep record:', error)
      setError('기록 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const moodOptions = [
    { value: '매우 좋음', label: '😊 매우 좋음' },
    { value: '좋음', label: '🙂 좋음' },
    { value: '보통', label: '😐 보통' },
    { value: '나쁨', label: '😔 나쁨' },
    { value: '매우 나쁨', label: '😢 매우 나쁨' }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-carrot-orange">
        {id ? '수면 기록 수정' : '새 수면 기록 추가'}
      </h2>
      {loading && <p className="text-center text-carrot-orange">로딩 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            날짜:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sleepHours">
            수면 시간 (시간):
          </label>
          <input
            type="number"
            id="sleepHours"
            name="sleepHours"
            value={formData.sleepHours}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            min="0"
            max="24"
            step="0.5"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mood">
            기분:
          </label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {moodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sleepScore">
            수면 만족도 (1-5):
          </label>
          <input
            type="range"
            id="sleepScore"
            name="sleepScore"
            value={formData.sleepScore}
            onChange={handleChange}
            className="w-full"
            min="1"
            max="5"
            step="1"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <p className="text-center text-gray-700 mt-2">{formData.sleepScore}점</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-carrot-orange hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {id ? '수정 완료' : '기록 추가'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/sleep')}
            className="inline-block align-baseline font-bold text-sm text-carrot-orange hover:text-orange-700"
            disabled={loading}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default SleepRecordForm
