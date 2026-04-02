import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/dashboard':     { title: 'Dashboard',       sub: 'Overview of your judging system' },
  '/projects':      { title: 'Projects',        sub: 'Manage all submitted projects' },
  '/judges':        { title: 'Judges',          sub: 'Manage evaluation judges' },
  '/criteria':      { title: 'Criteria',        sub: 'Define scoring criteria and weights' },
  '/scores/submit': { title: 'Submit Score',    sub: "Record a judge's evaluation" },
  '/leaderboard':   { title: 'Leaderboard',     sub: 'Final project rankings by weighted score' },
}

export default function Topbar() {
  const { pathname } = useLocation()

  // Match dynamic routes like /projects/:id
  const matchKey = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k)) ?? pathname
  const { title = 'Page', sub = '' } = PAGE_TITLES[matchKey] ?? {}

  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200">
      <div>
        <h1 className="text-[15px] font-semibold text-slate-900">{title}</h1>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>

      {/* Right side: avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-slate-800">Admin</p>
          <p className="text-xs text-slate-400">admin@judging.io</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
          A
        </div>
      </div>
    </header>
  )
}
