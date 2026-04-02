/**
 * Generic table component.
 *
 * @param {string[]}   columns   – header labels
 * @param {ReactNode}  children  – <tr> elements for the body
 * @param {string}     emptyMsg  – shown when no rows
 * @param {boolean}    loading
 */
export default function Table({ columns, children, emptyMsg = 'No records found.', loading }) {
  const hasRows = !!children && (Array.isArray(children) ? children.length > 0 : true)

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            // Skeleton rows
            [...Array(4)].map((_, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c} className="px-5 py-3.5">
                    <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : !hasRows ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-sm text-slate-400"
              >
                {emptyMsg}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}

/** Convenience: styled <td> */
export function Td({ children, className = '' }) {
  return (
    <td className={`px-5 py-3.5 text-sm text-slate-700 ${className}`}>{children}</td>
  )
}
