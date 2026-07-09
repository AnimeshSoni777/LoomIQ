export default function ResultTable({ columns, rows }) {
  if (!columns || !rows || rows.length === 0) return null;

  return (
    <div className="overflow-x-auto border border-ink/10 rounded-md">
      <table className="min-w-full text-xs font-mono">
        <thead className="bg-ink/5">
          <tr>
            {columns.map((col) => (
              <th key={col} className="text-left px-3 py-2 text-ink/60 uppercase tracking-wide font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white/40" : "bg-transparent"}>
              {columns.map((col) => (
                <td key={col} className="px-3 py-2 text-ink/85 whitespace-nowrap">
                  {String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}