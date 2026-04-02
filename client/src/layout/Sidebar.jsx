import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  // Base items everyone sees
  let navItems = [
    {
      to: '/dashboard', label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      to: '/leaderboard', label: 'Leaderboard',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    }
  ]

  // Role-specific items
  if (user?.role === 'author' || user?.role === 'admin') {
    navItems.splice(1, 0, {
      to: '/projects', label: user?.role === 'author' ? 'My Projects' : 'All Projects',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
    })
  }

  if (user?.role === 'judge' || user?.role === 'admin') {
    navItems.splice(2, 0, {
      to: '/scores/submit', label: 'Submit Score',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
        </svg>
      ),
    })
  }

  if (user?.role === 'admin') {
    navItems.push({
      to: '/judges', label: 'Manage Judges',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      ),
    })
    navItems.push({
      to: '/criteria', label: 'Manage Criteria',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    })
  }

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col w-64 bg-slate-900 z-20 transition-all duration-300">
      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/60">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-sm shrink-0">
          PJ
        </div>
        <div className="leading-tight">
          <p className="text-white text-sm font-semibold">Project Judging</p>
          <p className="text-slate-400 text-xs tracking-wider uppercase mt-1">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
              user?.role === 'judge' ? 'bg-amber-500/20 text-amber-400'   :
              'bg-blue-500/20 text-blue-400'
            }`}>{user?.role}</span>
          </p>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="px-5 py-4 border-t border-slate-700/60">
        <p className="text-xs text-slate-500">
          API:{' '}
          <span className="text-slate-400 font-mono">localhost:3000</span>
        </p>
      </div>
    </aside>
  )
}
