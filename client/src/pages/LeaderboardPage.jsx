import { useState, useEffect } from 'react'
import * as api  from '../api'
import Table, { Td } from '../components/Table'
import Card      from '../components/Card'

const MEDALS = ['🥇', '🥈', '🥉']

function RankBadge({ rank }) {
  if (rank <= 3) return <span className="text-xl">{MEDALS[rank - 1]}</span>
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
      {rank}
    </span>
  )
}

export default function LeaderboardPage() {
  const [rows, setRows]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getLeaderboard()
      .then((r) => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const maxScore = Number(rows[0]?.final_score) || 1

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Leaderboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Rankings calculated as{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-700">
            SUM(score_value × weight)
          </code>
        </p>
      </div>

      {/* Podium cards for top 3 */}
      {!loading && rows.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {rows.slice(0, 3).map((r) => (
            <Card key={r.project_id} className={`text-center ${r.rank === 1 ? 'ring-2 ring-yellow-400' : ''}`}>
              <div className="text-3xl mb-2">{MEDALS[r.rank - 1]}</div>
              <p className="font-bold text-slate-900 text-sm truncate">{r.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{r.team_name}</p>
              <p className="text-2xl font-bold text-blue-600 mt-3 tabular-nums">
                {Number(r.final_score).toFixed(2)}
              </p>
              <p className="text-xs text-slate-400">weighted score</p>
            </Card>
          ))}
        </div>
      )}

      {/* Full table */}
      <Table
        columns={['Rank', 'Project', 'Team', 'Final Score', 'Bar']}
        loading={loading}
        emptyMsg="No scores submitted yet. The leaderboard will appear here once judges begin scoring."
      >
        {rows.map((r) => {
          const pct = Math.round((Number(r.final_score) / maxScore) * 100)
          return (
            <tr
              key={r.project_id}
              className={`transition-colors ${r.rank <= 3 ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-slate-50'}`}
            >
              <Td className="w-14">
                <RankBadge rank={Number(r.rank)} />
              </Td>
              <Td><span className="font-semibold text-slate-900">{r.title}</span></Td>
              <Td>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {r.team_name}
                </span>
              </Td>
              <Td>
                <span className="text-lg font-bold text-blue-600 tabular-nums">
                  {Number(r.final_score).toFixed(2)}
                </span>
              </Td>
              <Td className="w-40">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.rank === 1 ? 'bg-yellow-400' : r.rank === 2 ? 'bg-slate-400' : r.rank === 3 ? 'bg-amber-600' : 'bg-blue-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Td>
            </tr>
          )
        })}
      </Table>
    </div>
  )
}
