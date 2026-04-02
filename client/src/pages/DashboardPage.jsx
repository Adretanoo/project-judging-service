import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import Card from '../components/Card'

function StatCard({ label, value, icon, bg, loading }) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="h-7 w-12 bg-slate-100 animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        )}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const [stats, setStats]         = useState({ projects: 0, judges: 0, criteria: 0 })
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([api.getProjects(), api.getJudges(), api.getCriteria(), api.getLeaderboard()])
      .then(([p, j, c, lb]) => {
        setStats({ projects: p.data.length, judges: j.data.length, criteria: c.data.length })
        setLeaderboard(lb.data.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const maxScore = Number(leaderboard[0]?.final_score) || 1

  const STATS = [
    { label: 'Projects',    value: stats.projects,  icon: '📁', bg: 'bg-blue-50' },
    { label: 'Judges',      value: stats.judges,    icon: '👥', bg: 'bg-violet-50' },
    { label: 'Criteria',    value: stats.criteria,  icon: '📋', bg: 'bg-emerald-50' },
    { label: 'Rankings',    value: leaderboard.length, icon: '🏆', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, Admin 👋</h1>
        <p className="text-slate-500 mt-1 text-sm">Here's an overview of your judging system.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((s) => <StatCard key={s.label} {...s} loading={loading} />)}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Leaderboard preview */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">🏆 Top Projects</h2>
            <Link to="/leaderboard" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View full leaderboard →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-slate-400">No scores submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((item) => {
                const pct    = Math.round((Number(item.final_score) / maxScore) * 100)
                const medal  = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`
                return (
                  <div key={item.project_id} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center shrink-0">{medal}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-slate-800 truncate">{item.title}</span>
                        <span className="text-blue-600 font-mono tabular-nums shrink-0 ml-2">
                          {Number(item.final_score).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{item.team_name}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <Card>
          <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <nav className="space-y-1">
            {[
              { to: '/projects',      icon: '📁', label: 'Manage Projects' },
              { to: '/judges',        icon: '👥', label: 'Manage Judges' },
              { to: '/criteria',      icon: '📋', label: 'Manage Criteria' },
              { to: '/scores/submit', icon: '✏️', label: 'Submit a Score' },
              { to: '/leaderboard',   icon: '🏆', label: 'View Leaderboard' },
            ].map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors group"
              >
                <span className="text-base">{icon}</span>
                <span className="flex-1">{label}</span>
                <span className="text-slate-300 group-hover:text-slate-500 text-xs">→</span>
              </Link>
            ))}
          </nav>
        </Card>
      </div>
    </div>
  )
}
