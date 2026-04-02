import { useState, useCallback } from 'react'

let _id = 0

/**
 * Manages a stack of toast notifications.
 * Returns { notifications, notify, dismiss }.
 * Call notify(message, 'success' | 'error' | 'info') from any page.
 * Auto-dismisses after 4 s.
 */
export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = ++_id
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return { notifications, notify, dismiss }
}
