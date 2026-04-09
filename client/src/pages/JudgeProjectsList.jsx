import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../api'
import Table, { Td } from '../components/Table'

export default function JudgeProjectsList() {
  const { user }              = useAuth()
  const { notify }            = useOutletContext()
  const navigate              = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.getProjects()
      .then((r) => setProjects(r.data))
      .catch(() => notify('Failed to load projects', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB')

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Projects pending evaluation</h2>
        <p className="text-sm text-slate-500 mt-0.5">Select a project to submit your scores</p>
      </div>

      <Table
        columns={['Title', 'Team Name', 'Description', 'Submitted', 'Action']}
        loading={loading}
        emptyMsg="No projects to evaluate right now."
      >
        {projects.map((p) => {
          return (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <Td><span className="font-medium text-slate-900">{p.title}</span></Td>
              <Td>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {p.team_name}
                </span>
              </Td>
              <Td className="max-w-xs">
                <span className="truncate block text-slate-500">
                  {p.description || <span className="italic text-slate-300">—</span>}
                </span>
              </Td>
              <Td className="text-slate-400 whitespace-nowrap">{fmt(p.created_at)}</Td>
              <Td>
                <button
                  onClick={() => navigate(`/scores/submit?project_id=${p.id}`)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded hover:bg-emerald-100 transition whitespace-nowrap"
                >
                  Evaluate →
                </button>
              </Td>
            </tr>
          )
        })}
      </Table>
    </div>
  )
}
