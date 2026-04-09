import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../api'
import Table, { Td } from '../components/Table'
import Button   from '../components/Button'
import Modal    from '../components/Modal'
import Input    from '../components/Input'

const EMPTY = { id: null, title: '', team_name: '', description: '' }

export default function ProjectsPage() {
  const { user }              = useAuth()
  const { notify }            = useOutletContext()
  const navigate              = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  
  const [open, setOpen]         = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [errors, setErrors]     = useState({})
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    api.getProjects()
      .then((r) => {
        let items = r.data
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
      if (form.id) {
        await api.updateProject(form.id, form)
        notify('Project updated successfully!')
      } else {
        await api.createProject(form)
        notify('Project created successfully!')
      }
      setOpen(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to save project', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      await api.deleteProject(form.id)
      notify('Project deleted successfully!')
      setDeleteOpen(false)
      setForm(EMPTY)
      load()
    } catch (err) {
      notify(err.response?.data?.message ?? 'Failed to delete project', 'error')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (p) => {
    setForm(p)
    setErrors({})
    setOpen(true)
  }

  const openDelete = (p) => {
    setForm(p)
    setDeleteOpen(true)
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB')

  const title = user.role === 'author' ? 'My Projects' : 'All Projects'
  const emptyMessage = user.role === 'author' ? "You haven't submitted any projects yet." : "No projects submitted yet."

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} total</p>
        </div>
        {(user.role === 'author' || user.role === 'admin') && (
          <Button onClick={() => { setForm(EMPTY); setErrors({}); setOpen(true) }}>
            + Add Project
          </Button>
        )}
      </div>

      <Table
        columns={['Title', 'Team Name', 'Description', 'Submitted By', 'Created', 'Actions']}
        loading={loading}
        emptyMsg={emptyMessage}
      >
        {projects.map((p) => {
          const isOwnerOrAdmin = user.role === 'admin' || p.author_id === user.id
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
              <Td>
                <span className="text-sm text-slate-600 font-medium">
                  {p.author_id === user.id ? 'You' : p.author_name}
                </span>
              </Td>
              <Td className="text-slate-400 whitespace-nowrap">{fmt(p.created_at)}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate(`/projects/${p.id}`)} className="text-slate-400 hover:text-blue-600 transition" title="View details">
                    👁️
                  </button>
                  {isOwnerOrAdmin && (
                    <>
                      <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-amber-600 transition" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => openDelete(p)} className="text-slate-400 hover:text-red-600 transition" title="Delete">
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </Td>
            </tr>
          )
        })}
      </Table>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={form.id ? "Edit Project" : "New Project"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>{form.id ? "Save Changes" : "Submit Project"}</Button>
          </>
        }
      >
        <Input id="title"     label="Title *"      value={form.title}       error={errors.title}     placeholder="EcoDrive"    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}     />
        <Input id="team_name" label="Team Name *"  value={form.team_name}  error={errors.team_name} placeholder="Green Wheels" onChange={(e) => setForm((f) => ({ ...f, team_name: e.target.value }))} />
        <div className="flex flex-col gap-1">
          <label htmlFor="desc" className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            id="desc" rows={3}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Short description…"
            value={form.description || ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} loading={saving} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
              Yes, delete
            </Button>
          </>
        }
      >
        <p className="text-slate-600 mb-2">Are you sure you want to delete <strong className="text-slate-800">{form.title}</strong>?</p>
        <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">Warning: This action cannot be undone and will permanently delete all associated scores!</p>
      </Modal>
    </div>
  )
}
