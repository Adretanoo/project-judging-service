import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'

import DashboardLayout     from './layout/DashboardLayout'
import DashboardPage       from './pages/DashboardPage'
import ProjectsPage        from './pages/ProjectsPage'
import ProjectDetailPage   from './pages/ProjectDetailPage'
import JudgesPage          from './pages/JudgesPage'
import CriteriaPage        from './pages/CriteriaPage'
import ScoreSubmissionPage from './pages/ScoreSubmissionPage'
import LeaderboardPage     from './pages/LeaderboardPage'
import JudgeProjectsList   from './pages/JudgeProjectsList'

// Protected Route wrapper checking authentication and arbitrary role array
function RequireAuth({ children, roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    // If authenticated but unauthorized, drop to their default dashboard
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Layout */}
      <Route path="/" element={ <RequireAuth><DashboardLayout /></RequireAuth> }>
        
        {/* Conditional Dashboard (renders different things based on role inside) */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Global/Shared */}
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />

        {/* Role: Author (and Admin can peek) */}
        <Route path="projects" element={
          <RequireAuth roles={['author', 'admin']}><ProjectsPage /></RequireAuth> 
        } />

        {/* Role: Judge (and Admin explicitly acting as judge) */}
        <Route path="evaluate" element={
          <RequireAuth roles={['judge', 'admin']}><JudgeProjectsList /></RequireAuth>
        } />
        <Route path="scores/submit" element={
          <RequireAuth roles={['judge', 'admin']}><ScoreSubmissionPage /></RequireAuth>
        } />

        {/* Role: Admin */}
        <Route path="judges" element={
          <RequireAuth roles={['admin']}><JudgesPage /></RequireAuth> 
        } />
        <Route path="criteria" element={
          <RequireAuth roles={['admin']}><CriteriaPage /></RequireAuth> 
        } />

      </Route>
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
