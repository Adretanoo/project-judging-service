import { useState, useEffect } from 'react'
import { useParams, Link }    from 'react-router-dom'
import * as api  from '../api'
import Card      from '../components/Card'
import Table, { Td } from '../components/Table'
import Loader    from '../components/Loader'

export default function ProjectDetailPage() {
  const { id }                = useParams()
  const [project, setProject] = useState(null)
  const [scores, setScores]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    Promise.all([api.getProjectById(id), api.getScoresByProject(id)])
      .then(([p, s]) => { setProject(p.data); setScores(s.data) })
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader fullScreen />

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-500 font-medium">{error}</p>
        <Link to="/projects" className="mt-4 inline-block text-blue-600 text-sm hover:underline">← Back to projects</Link>
      </div>
    )
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  // Group scores by criteria for a cleaner view
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
        ← All Projects
      </Link>

      {/* Project card */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{project.title}</h2>
            <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
              {project.team_name}
            </span>
            {project.description && (
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{project.description}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400">Submitted</p>
            <p className="text-sm font-medium text-slate-700 mt-0.5">{fmt(project.created_at)}</p>
          </div>
        </div>

        {/* Score summary */}
        {scores.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Evaluations</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{scores.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Unique Judges</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {new Set(scores.map((s) => s.judge_id)).size}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Criteria Covered</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {new Set(scores.map((s) => s.criteria_id)).size}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Scores table */}
      <div>
        <h3 className="text-base font-semibold text-slate-800 mb-3">Score Breakdown</h3>
        <Table
          columns={['Judge', 'Criterion', 'Weight', 'Score', 'Max', 'Comment']}
          emptyMsg="No scores submitted for this project yet."
        >
          {scores.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50 transition-colors">
              <Td><span className="font-medium text-slate-800">{s.judge_name}</span></Td>
              <Td>{s.criteria_name}</Td>
              <Td>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  ×{Number(s.criteria_weight).toFixed(2)}
                </span>
              </Td>
              <Td>
                <span className={`font-bold tabular-nums ${Number(s.score_value) >= Number(s.criteria_max_score) * 0.8 ? 'text-green-600' : 'text-slate-900'}`}>
                  {Number(s.score_value).toFixed(1)}
                </span>
              </Td>
              <Td className="text-slate-400">{s.criteria_max_score}</Td>
              <Td className="max-w-xs">
                <span className="truncate block text-slate-500 text-xs">
                  {s.comment || <span className="italic text-slate-300">—</span>}
                </span>
              </Td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  )
}
