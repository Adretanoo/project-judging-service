import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout    from './layout/DashboardLayout'
import DashboardPage      from './pages/DashboardPage'
import ProjectsPage       from './pages/ProjectsPage'
import ProjectDetailPage  from './pages/ProjectDetailPage'
import JudgesPage         from './pages/JudgesPage'
import CriteriaPage       from './pages/CriteriaPage'
import ScoreSubmissionPage from './pages/ScoreSubmissionPage'
import LeaderboardPage    from './pages/LeaderboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"      element={<DashboardPage />} />
        <Route path="projects"       element={<ProjectsPage />} />
        <Route path="projects/:id"   element={<ProjectDetailPage />} />
        <Route path="judges"         element={<JudgesPage />} />
        <Route path="criteria"       element={<CriteriaPage />} />
        <Route path="scores/submit"  element={<ScoreSubmissionPage />} />
        <Route path="leaderboard"    element={<LeaderboardPage />} />
      </Route>
    </Routes>
  )
}
