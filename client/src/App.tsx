import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './routes/HomePage'
import MainLayout from './layouts/MainLayout'
import SleepListPage from './routes/SleepListPage'
import SleepRecordForm from './routes/SleepRecordForm'
import NotFoundPage from './routes/NotFoundPage'
import SleepStatsPage from './routes/SleepStatsPage'

function App() {
  return (
    <Routes>
      {/* MainLayout을 사용하는 라우트들 */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/sleep" replace />} />
        {/* <Route path="/users" element={<UserManagementPage />} /> */}
        {/* 수면 기록 목록 라우트 */}
        <Route path="/sleep" element={<SleepListPage />} />
        {/* 수면 통계 라우트 추가 */}
        <Route path="/sleep/stats" element={<SleepStatsPage />} />
        {/* NotFound 페이지도 MainLayout 안에 포함 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 수면 기록 추가/수정 라우트는 독립적으로 설정 */}
      <Route path="/sleep/new" element={<SleepRecordForm />} />
      <Route path="/sleep/edit/:id" element={<SleepRecordForm />} />
    </Routes>
  )
}

export default App
