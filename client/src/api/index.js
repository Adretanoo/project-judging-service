import axios from 'axios'

/**
 * Axios instance that targets Vite's dev proxy (/api → http://localhost:3000).
 * All exports correspond 1-to-1 with backend endpoints.
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

// ── Judges ───────────────────────────────────────────────────────────────────
export const getJudges     = ()     => api.get('/judges')
export const getJudgeById  = (id)   => api.get(`/judges/${id}`)
export const createJudge   = (data) => api.post('/judges', data)

// ── Projects ─────────────────────────────────────────────────────────────────
export const getProjects    = ()     => api.get('/projects')
export const getProjectById = (id)   => api.get(`/projects/${id}`)
export const createProject  = (data) => api.post('/projects', data)

// ── Criteria ─────────────────────────────────────────────────────────────────
export const getCriteria   = ()     => api.get('/criteria')
export const createCriteria = (data) => api.post('/criteria', data)

// ── Scores ───────────────────────────────────────────────────────────────────
export const createScore         = (data) => api.post('/scores', data)
export const getScoresByProject  = (id)   => api.get(`/scores/project/${id}`)

// ── Leaderboard ──────────────────────────────────────────────────────────────
export const getLeaderboard = () => api.get('/leaderboard')

export default api
