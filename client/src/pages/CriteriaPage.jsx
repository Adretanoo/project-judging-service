import { useState, useEffect } from 'react'
import { useOutletContext }    from 'react-router-dom'
import * as api  from '../api'
import Table, { Td } from '../components/Table'
import Button    from '../components/Button'
import Modal     from '../components/Modal'
import Input     from '../components/Input'

const EMPTY = { name: '', weight: '', max_score: '' }

export default function CriteriaPage() {
  const { notify }              = useOutletContext()
  const [criteria, setCriteria] = useState([])
  const [loading, setLoading]   = useState(true)
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    api.getCriteria()
      .then((r) => setCriteria(r.data))
      .catch(() => notify('Failed to load criteria', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())                        e.name      = 'Name is required'
    if (!form.weight || isNaN(Number(form.weight))) e.weight    = 'Weight must be a number'
    else if (Number(form.weight) <= 0)              e.weight    = 'Weight must be positive'
    if (!form.max_score || isNaN(Number(form.max_score))) e.max_score = 'Max score must be a number'
    else if (Number(form.max_score) <= 0)           e.max_score = 'Max score must be positive'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.createCriteria({
        name:      form.name,
        weight:    Number(form.weight),
        max_score: Number(form.max_score),
      })
      notify('Criterion created!')
      setOpen(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to create criterion', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Total weight for the summary bar
  const totalWeight = criteria.reduce((s, c) => s + Number(c.weight), 0)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Criteria</h2>
          <p className="text-sm text-slate-500 mt-0.5">{criteria.length} defined · total weight {totalWeight.toFixed(2)}</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setErrors({}); setOpen(true) }}>
          + Add Criterion
        </Button>
      </div>

      <Table
        columns={['#', 'Name', 'Weight', 'Max Score', 'Weight %']}
        loading={loading}
        emptyMsg="No criteria defined yet."
      >
        {criteria.map((c, i) => {
          const pct = totalWeight > 0 ? Math.round((Number(c.weight) / totalWeight) * 100) : 0
          return (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
              <Td className="text-slate-400 tabular-nums w-10">{i + 1}</Td>
              <Td><span className="font-medium text-slate-900">{c.name}</span></Td>
              <Td>
                <span className="font-mono text-indigo-600 font-semibold text-sm">{Number(c.weight).toFixed(2)}</span>
              </Td>
              <Td>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {c.max_score} pts
                </span>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-20">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums">{pct}%</span>
                </div>
              </Td>
            </tr>
          )
        })}
      </Table>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="New Criterion"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>Create Criterion</Button>
          </>
        }
      >
        <Input
          id="c-name" label="Name *"
          value={form.name} error={errors.name}
          placeholder="Innovation"
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          id="c-weight" label="Weight * (e.g. 0.4 for 40%)"
          type="number" step="0.01" min="0.01"
          value={form.weight} error={errors.weight}
          placeholder="0.40"
          onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
        />
        <Input
          id="c-max" label="Max Score *"
          type="number" min="1"
          value={form.max_score} error={errors.max_score}
          placeholder="10"
          onChange={(e) => setForm((f) => ({ ...f, max_score: e.target.value }))}
        />
      </Modal>
    </div>
  )
}
