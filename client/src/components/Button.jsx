const VARIANTS = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:bg-blue-300',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm disabled:text-slate-400',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:bg-red-300',
  ghost:     'text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

/**
 * Reusable button.
 * @param {string} variant – primary | secondary | danger | ghost
 * @param {string} size    – sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
        </svg>
      )}
      {children}
    </button>
  )
}
