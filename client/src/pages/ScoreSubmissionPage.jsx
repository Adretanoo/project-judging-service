import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../api'
import Card        from '../components/Card'
import Button      from '../components/Button'
import Input       from '../components/Input'
import Select      from '../components/Select'
import Loader      from '../components/Loader'

const INITIAL = { judge_id: '', project_id: '', criteria_id: '', score_value: '', comment: '' }

export default function ScoreSubmissionPage() {
  const { user }                = useAuth()
  const { notify }              = useOutletContext()
  const navigate                = useNavigate()
  const [judges, setJudges]     = useState([])
  const [projects, setProjects] = useState([])
  const [criteria, setCriteria] = useState([])
  const [form, setForm]         = useState(INITIAL)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    Promise.all([
      user.role === 'admin' ? api.getJudges() : Promise.resolve({data: []}), 
      api.getProjects(), 
      api.getCriteria()
    ])
      .then(([j, p, c]) => { setJudges(j.data); setProjects(p.data); setCriteria(c.data) })
      .catch(() => notify('Failed to load data', 'error'))
      .finally(() => setLoading(false))
  }, [user])

  const selectedCriteria = criteria.find((c) => String(c.id) === String(form.criteria_id))
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (user.role === 'admin' && !form.judge_id) e.judge_id = 'Select a judge'
    if (!form.project_id)  e.project_id  = 'Select a project'
    if (!form.criteria_id) e.criteria_id = 'Select a criterion'
    
    if (!form.score_value) {
      e.score_value = 'Score is required'
    } else {
      const v = Number(form.score_value)
      if (isNaN(v) || v < 0) e.score_value = 'Score must be ≥ 0'
      if (selectedCriteria && v > selectedCriteria.max_score) {
        e.score_value = `Max permitted score is ${selectedCriteria.max_score}`
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    
    try {
      const payload = {
        project_id:  Number(form.project_id),
        criteria_id: Number(form.criteria_id),
        score_value: Number(form.score_value),
        comment:     form.comment || undefined,
      }
      
      // Send judge_id only if admin. The backend automatically extracts the judge_id for standard judges.
      if (user.role === 'admin') {
        payload.judge_id = Number(form.judge_id)
      }

      await api.createScore(payload)
      notify('Score submitted successfully! 🎉')
      setForm(INITIAL)
      setErrors({})
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Failed to submit score'
      notify(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader fullScreen />

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Evaluate Project</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {user.role === 'admin' ? "Admins can submit scores on behalf of judges." : "You can score a project against a specific criterion once."}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Judge selection is Admin-only */}
          {user.role === 'admin' && (
            <Select id="judge" label="Select Judge *" value={form.judge_id} error={errors.judge_id} onChange={set('judge_id')}>
              <option value="">— Choose a judge —</option>
              {judges.map((j) => (
                <option key={j.id} value={j.id}>{j.full_name}</option>
              ))}
            </Select>
          )}

          {/* Project */}
          <Select id="project" label="Project *" value={form.project_id} error={errors.project_id} onChange={set('project_id')}>
            <option value="">— Select project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title} — {p.team_name}</option>
            ))}
          </Select>

          {/* Criterion */}
          <Select id="criteria" label="Criterion *" value={form.criteria_id} error={errors.criteria_id} onChange={set('criteria_id')}>
            <option value="">— Select criterion —</option>
            {criteria.map((c) => (
              <option key={c.id} value={c.id}>{c.name} (weight: {Number(c.weight).toFixed(2)}, max: {c.max_score})</option>
            ))}
          </Select>

          {/* Score */}
          <div>
            <Input
              id="score"
              label={`Score *${selectedCriteria ? ` (0 – ${selectedCriteria.max_score})` : ''}`}
              type="number"
              step="0.1" min="0"
              max={selectedCriteria?.max_score ?? undefined}
              value={form.score_value}
              error={errors.score_value}
              placeholder="e.g. 8.5"
              onChange={set('score_value')}
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <label htmlFor="comment" className="text-sm font-medium text-slate-700">Comment</label>
            <textarea
              id="comment" rows={3}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Optional remarks…"
              value={form.comment}
              onChange={set('comment')}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={saving}>
            Submit Evaluation
          </Button>
        </form>
      </Card>
    </div>
  )
}
