import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
  const { user } = useAuth()
  const [stats, setStats]         = useState({ projects: 0, judges: 0, criteria: 0 })
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      user.role === 'admin' ? api.getJudges() : Promise.resolve({data: []}), 
      api.getCriteria(), 
      api.getLeaderboard(),
      user.role === 'author' || user.role === 'admin' ? api.getProjects() : Promise.resolve({data: []})
    ])
      .then(([j, c, lb, p]) => {
        let pCount = p.data.length
        if (user.role === 'author') {
           pCount = p.data.filter(x => x.author_id === user.id).length
        }
        setStats({ projects: pCount, judges: j.data.length, criteria: c.data.length })
        setLeaderboard(lb.data.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const maxScore = Number(leaderboard[0]?.final_score) || 1

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.full_name} 👋</h1>
        <p className="text-slate-500 mt-1 text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded inline-block font-medium">
          Role: {user.role.toUpperCase()}
        </p>
      </div>

      {/* Role specific quick-actions / stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {(user.role === 'author' || user.role === 'admin') && (
           <StatCard label={user.role === 'author' ? 'My Projects' : 'Total Projects'} value={stats.projects} icon="📁" bg="bg-blue-50" loading={loading} />
        )}
        {user.role === 'admin' && (
           <StatCard label="Total Judges" value={stats.judges} icon="👥" bg="bg-violet-50" loading={loading} />
        )}
        {(user.role === 'admin' || user.role === 'judge') && (
          <StatCard label="Active Criteria" value={stats.criteria} icon="📋" bg="bg-emerald-50" loading={loading} />
        )}
        <StatCard label="Rankings" value={leaderboard.length} icon="🏆" bg="bg-amber-50" loading={loading} />
      </div>

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
                  <div key={item.project_id} className="flex items-center gap-3 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors">
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

        {/* Quick actions by role */}
        <Card>
          <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <nav className="space-y-1 as-nav items-stretch">
            {user.role === 'author' && (
              <Link to="/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 text-blue-700 text-sm font-medium transition-colors">
                <span className="text-base">🚀</span><span className="flex-1">Submit New Project</span>
              </Link>
            )}
            {user.role === 'judge' && (
              <Link to="/scores/submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-emerald-700 text-sm font-medium transition-colors">
                <span className="text-base">✏️</span><span className="flex-1">Evaluate a Project</span>
              </Link>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"><span className="text-base">📁</span><span className="flex-1">Manage All Projects</span></Link>
                <Link to="/judges" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"><span className="text-base">👥</span><span className="flex-1">Manage Judges</span></Link>
                <Link to="/criteria" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"><span className="text-base">📋</span><span className="flex-1">Manage Criteria</span></Link>
              </>
            )}
            <Link to="/leaderboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-amber-50 text-amber-700 text-sm font-medium transition-colors">
              <span className="text-base">🏆</span><span className="flex-1">View Full Leaderboard</span>
            </Link>
          </nav>
        </Card>
      </div>
    </div>
  )
}
