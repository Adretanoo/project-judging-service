/**
 * Centered fullscreen loader OR inline spinner.
 * @param {boolean} fullScreen – wrap in a centered flex container
 */
export default function Loader({ fullScreen = false, size = 8 }) {
  const spinner = (
    <svg
      className={`animate-spin text-blue-500 w-${size} h-${size}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="3"
        strokeDasharray="60" strokeDashoffset="20"
      />
    </svg>
  )

  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] gap-3">
        {spinner}
        <p className="text-sm text-slate-400">Loading…</p>
      </div>
    )
  }

  return spinner
}
