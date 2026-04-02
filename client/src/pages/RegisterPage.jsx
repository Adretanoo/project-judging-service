import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../api'
import Input from '../components/Input'
import Select from '../components/Select'
import Button from '../components/Button'

export default function RegisterPage() {
  const [form, setForm]     = useState({ full_name: '', email: '', password: '', role: 'author' })
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const res = await api.register(form)
      login(res.data.user, res.data.token) // Update Context immediately upon register
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-2xl border border-slate-100 sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}
            
            <Input
              id="full_name" label="Full Name" required placeholder="Jane Doe"
              value={form.full_name}
              onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
            />

            <Input
              id="email" label="Email address" type="email" required placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            />
            
            <Input
              id="password" label="Password (min 6 chars)" type="password" required
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            />

            <Select 
              id="role" label="I am a..." required value={form.role} 
              onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option value="author">Project Author</option>
              <option value="judge">Competition Judge</option>
              <option value="admin">System Admin</option>
            </Select>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
