import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PAGE_TITLES = {
  '/dashboard':     { title: 'Dashboard',       sub: 'Overview of your judging system' },
  '/projects':      { title: 'Projects',        sub: 'Manage projects' },
  '/judges':        { title: 'Judges',          sub: 'Manage evaluation judges' },
  '/criteria':      { title: 'Criteria',        sub: 'Define scoring criteria and weights' },
  '/scores/submit': { title: 'Submit Score',    sub: "Record a judge's evaluation" },
  '/leaderboard':   { title: 'Leaderboard',     sub: 'Final project rankings by weighted score' },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Match dynamic routes like /projects/:id
  const matchKey = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k)) ?? pathname
  const { title = 'Page', sub = '' } = PAGE_TITLES[matchKey] ?? {}

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10 w-full">
      <div>
        <h1 className="text-[15px] font-semibold text-slate-900">{title}</h1>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>

      {/* Right side: avatar & logout */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-800">{user.full_name}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        )}
        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-1 ring-slate-900/10">
          {user?.full_name?.charAt(0).toUpperCase() || '?'}
        </div>
        <button 
          onClick={handleLogout}
          className="ml-2 text-sm text-slate-500 hover:text-red-600 font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
