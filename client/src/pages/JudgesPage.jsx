import { useState, useEffect } from 'react'
import { useOutletContext }    from 'react-router-dom'
import * as api  from '../api'
import Table, { Td } from '../components/Table'
import Button    from '../components/Button'
import Modal     from '../components/Modal'
import Input     from '../components/Input'

const EMPTY = { full_name: '', email: '' }

export default function JudgesPage() {
  const { notify }          = useOutletContext()
  const [judges, setJudges] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)

  const load = () => {
    setLoading(true)
    api.getJudges()
      .then((r) => setJudges(r.data))
      .catch(() => notify('Failed to load judges', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.email.trim())     e.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.createJudge(form)
      notify('Judge added successfully!')
      setOpen(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to create judge', 'error')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Judges</h2>
          <p className="text-sm text-slate-500 mt-0.5">{judges.length} registered</p>
        </div>
        <Button onClick={() => { setForm(EMPTY); setErrors({}); setOpen(true) }}>
          + Add Judge
        </Button>
      </div>

      <Table
        columns={['#', 'Full Name', 'Email', 'Registered']}
        loading={loading}
        emptyMsg="No judges registered yet."
      >
        {judges.map((j, i) => (
          <tr key={j.id} className="hover:bg-slate-50 transition-colors">
            <Td className="text-slate-400 tabular-nums w-10">{i + 1}</Td>
            <Td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {j.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-900">{j.full_name}</span>
              </div>
            </Td>
            <Td className="text-slate-500">{j.email}</Td>
            <Td className="text-slate-400 whitespace-nowrap">{fmt(j.created_at)}</Td>
          </tr>
        ))}
      </Table>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add Judge"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>Add Judge</Button>
          </>
        }
      >
        <Input
          id="full_name" label="Full Name *"
          value={form.full_name} error={errors.full_name}
          placeholder="Jane Doe"
          onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
        />
        <Input
          id="email" label="Email Address *" type="email"
          value={form.email} error={errors.email}
          placeholder="jane@example.com"
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </Modal>
    </div>
  )
}
