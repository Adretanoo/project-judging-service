/**
 * Styled text input with optional label and error message.
 */
export default function Input({
  label,
  error,
  id,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
          ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'}
          disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}
