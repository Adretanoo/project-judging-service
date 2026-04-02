import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../api'
import Table, { Td } from '../components/Table'
import Button   from '../components/Button'
import Modal    from '../components/Modal'
import Input    from '../components/Input'

const EMPTY = { title: '', team_name: '', description: '' }

export default function ProjectsPage() {
  const { user }              = useAuth()
  const { notify }            = useOutletContext()
  const navigate              = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [open, setOpen]         = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    api.getProjects()
      .then((r) => {
        let items = r.data
        // Authors only see their own projects
        if (user.role === 'author') {
          items = items.filter(p => p.author_id === user.id)
        }
        setProjects(items)
      })
      .catch(() => notify('Failed to load projects', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [user])

  const validate = () => {
    const e = {}
    if (!form.title.trim())     e.title     = 'Title is required'
    if (!form.team_name.trim()) e.team_name = 'Team name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await api.createProject(form)
      notify('Project created successfully!')
      setOpen(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to create project', 'error')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  // Authors specific messages
  const title = user.role === 'author' ? 'My Projects' : 'All Projects'
  const emptyMessage = user.role === 'author' ? "You haven't submitted any projects yet." : "No projects submitted yet."

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} total</p>
        </div>
        {user.role === 'author' && (
          <Button onClick={() => { setForm(EMPTY); setErrors({}); setOpen(true) }}>
            + Add Project
          </Button>
        )}
      </div>

      {/* Table */}
      <Table
        columns={['Title', 'Team Name', 'Description', 'Submitted By', 'Created', '']}
        loading={loading}
        emptyMsg={emptyMessage}
      >
        {projects.map((p) => (
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
            <Td>
              <span className="text-sm text-slate-600 font-medium">
                {p.author_id === user.id ? 'You' : p.author_name}
              </span>
            </Td>
            <Td className="text-slate-400 whitespace-nowrap">{fmt(p.created_at)}</Td>
            <Td>
              <button
                onClick={() => navigate(`/projects/${p.id}`)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View →
              </button>
            </Td>
          </tr>
        ))}
      </Table>

      {/* Modal - only an Author should trigger this */}
      {user.role === 'author' && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="New Project"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} loading={saving}>Submit Project</Button>
            </>
          }
        >
          <Input id="title"     label="Title *"      value={form.title}       error={errors.title}     placeholder="EcoDrive"    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}     />
          <Input id="team_name" label="Team Name *"  value={form.team_name}  error={errors.team_name} placeholder="Green Wheels" onChange={(e) => setForm((f) => ({ ...f, team_name: e.target.value }))} />
          <div className="flex flex-col gap-1">
            <label htmlFor="desc" className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="desc"
              rows={3}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Short description…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}
