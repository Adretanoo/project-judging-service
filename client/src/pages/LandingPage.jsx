import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

export default function LandingPage() {
  const { user } = useAuth()

  // If already logged in, skip landing page
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs shrink-0">
            PJ
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Project Judging</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
            Log in
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
          Now supporting multi-role evaluations
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          Evaluate hackathon projects <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">with precision</span>
        </h1>
        
        <p className="mt-6 text-lg text-slate-500 max-w-2xl">
          A fully integrated judging platform for authors, judges, and admins. Submit your projects, score them using custom metrics, and automatically generate real-time leaderboards.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="px-8">Create an Account</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="px-8 bg-white">Sign In</Button>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Automated Project Judging Service.
      </footer>
    </div>
  )
}
