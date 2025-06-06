import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSleepRecords, createSleepRecord, updateSleepRecord } from '../api/sleep'
import { SleepRecord } from '../types/sleep'

const SleepFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    sleepHours: 8,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit) {
      const fetchRecord = async () => {
        try {
          setLoading(true)
          const records = await getSleepRecords()
          const record = records.find(r => r.id === id)
          if (record) {
            setFormData({
              date: record.date.split('T')[0],
              sleepHours: record.sleepHours,
              notes: record.notes || ''
            })
          }
        } catch (err) {
          setError('기록을 불러오는데 실패했습니다.')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchRecord()
    }
  }, [id, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (isEdit && id) {
        await updateSleepRecord({ ...formData, id })
      } else {
        await createSleepRecord(formData)
      }
      navigate('/sleep')
    } catch (err) {
      setError('저장에 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 20 }}>로딩 중...</div>
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2>수면 기록 {isEdit ? '수정' : '작성'}</h2>
      {error && <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            날짜
            <br />
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            수면 시간(시간 단위)
            <br />
            <input
              type="number"
              min={0}
              max={24}
              value={formData.sleepHours}
              onChange={e => setFormData(prev => ({ ...prev, sleepHours: Number(e.target.value) }))}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            특이사항
            <br />
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="메모(선택)"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              flex: 1
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              flex: 1
            }}
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SleepFormPage
