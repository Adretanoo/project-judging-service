const STYLES = {
  success: 'bg-green-600 text-white',
  error:   'bg-red-600   text-white',
  info:    'bg-blue-600  text-white',
}

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
}

/**
 * Single toast notification.
 * Rendered by DashboardLayout's notification stack.
 *
 * @param {number}   id
 * @param {string}   message
 * @param {string}   type      success | error | info
 * @param {Function} onDismiss
 */
export default function Notification({ id, message, type = 'success', onDismiss }) {
  return (
    <div
      role="alert"
      className={`notification-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-sm ${STYLES[type]}`}
    >
      <span className="text-sm font-bold opacity-90 shrink-0">{ICONS[type]}</span>
      <p className="text-sm font-medium flex-1 leading-snug">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 opacity-75 hover:opacity-100 text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
