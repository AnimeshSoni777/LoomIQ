import { Download } from "lucide-react";

/* ── CRM-style result list ──────────────────────────────────────
   No vertical borders, generous padding, hairline row dividers,
   pill badges for short categorical values.                       */
const PILL_KEYS = ["category", "season", "fabric", "color", "print", "status", "currency"];
const PILL_TONES = [
  "bg-purple-50 text-purple-700",
  "bg-blue-50 text-blue-700",
  "bg-amber-50 text-amber-700",
  "bg-emerald-50 text-emerald-700",
  "bg-gray-100 text-gray-700",
];

function isPillColumn(col) {
  return PILL_KEYS.some((k) => col.toLowerCase().includes(k));
}

function toneFor(col) {
  const idx = PILL_KEYS.findIndex((k) => col.toLowerCase().includes(k));
  return PILL_TONES[(idx >= 0 ? idx : PILL_KEYS.length) % PILL_TONES.length];
}

function isNumeric(value) {
  return typeof value === "number" || (!isNaN(parseFloat(value)) && isFinite(value));
}

export default function ResultTable({ columns, rows }) {
  if (!columns || !rows || rows.length === 0) return null;
  // ⚡ Browser-native CSV Export Logic
  const handleDownload = () => {
    const header = columns.join(",");
    const csvRows = rows.map((row) => {
      return columns
        .map((col) => {
          let val = row[col];
          if (val === null || val === undefined) val = "";
          val = String(val).replace(/"/g, '""');
          if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
          return val;
        })
        .join(",");
    });
    const csvContent = [header, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LoomIQ_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 bg-slate-50/60">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                >
                  {col.replaceAll("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-purple-50/30">
                {columns.map((col) => {
                  const value = row[col];
                  return (
                    <td key={col} className="whitespace-nowrap px-6 py-3.5">
                      {isPillColumn(col) && value !== null && value !== undefined && String(value) !== "" ? (
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${toneFor(col)}`}>
                          {String(value)}
                        </span>
                      ) : (
                        <span className={`text-slate-700 ${isNumeric(value) ? "tabular-nums font-medium" : ""}`}>
                          {String(value)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 bg-slate-50/40 px-6 py-2.5">
        <span className="text-[12px] text-slate-500">
          {rows.length} record{rows.length === 1 ? "" : "s"}
        </span>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-medium text-slate-600 transition-colors hover:bg-slate-200/60 hover:text-slate-900 cursor-pointer"
        >
          <Download size={13} strokeWidth={2.5} />
          Export CSV
        </button>
      </div>
    </div>
  );
}
