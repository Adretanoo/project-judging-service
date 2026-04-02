import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'
import Notification from '../components/Notification'
import { useNotification } from '../hooks/useNotification'

/**
 * Root layout: fixed sidebar + topbar + scrollable main content.
 * Provides { notify } via Outlet context so every page can show toasts.
 */
export default function DashboardLayout() {
  const { notifications, notify, dismiss } = useNotification()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      {/* Main panel pushed right of sidebar */}
      <div className="flex flex-col flex-1 ml-64 min-h-screen">
        <Topbar />

        <main className="flex-1 p-8 overflow-auto">
          <Outlet context={{ notify }} />
        </main>
      </div>

      {/* Toast stack – fixed top-right */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <Notification key={n.id} {...n} onDismiss={dismiss} />
        ))}
      </div>
    </div>
  )
}
