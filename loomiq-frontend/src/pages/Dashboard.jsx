import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Package, Factory, Users, ClipboardList, TrendingUp, BarChart3, PieChart as PieIcon, AlertTriangle,
} from "lucide-react";

const COLORS = [
  "#6B21A8", "#9333EA", "#C084FC", "#7C3AED",
  "#A855F7", "#6366F1", "#8B5CF6", "#D8B4FE",
];

/* ── KPI Skeleton Component ────────────────────────────────────── */
function KpiSkeleton() {
  return (
    <div className="h-32 w-full animate-pulse rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="h-8 w-16 rounded bg-slate-100" />
          <div className="h-3 w-24 rounded bg-slate-100" />
        </div>
        <div className="h-8 w-8 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

/* ── CRM-style KPI card ─────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, delta, progress, barColor, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all cursor-pointer ${
        active
          ? "border-[#6B21A8]/40 ring-2 ring-[#6B21A8]/15"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="p-5 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[28px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">{value}</p>
            <p className="mt-2 text-[13px] font-medium text-slate-500">{label}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${active ? "bg-[#6B21A8] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
              <Icon size={15} strokeWidth={1.9} />
            </span>
            <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600">
              <TrendingUp size={11} /> {delta}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-100">
        <div className="h-full rounded-r-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: barColor }} />
      </div>
    </button>
  );
}

const METRIC_TABS = [
  { key: "revenue", label: "Revenue" },
  { key: "goods", label: "Categories" },
  { key: "suppliers", label: "Suppliers" },
  { key: "buyers", label: "Buyers" },
  { key: "orders", label: "Pipeline" },
];

/* ── Dynamic greeting helpers (Asia/Kolkata) ─────────────────────── */
const TZ = "Asia/Kolkata";
function getKolkataHour(date) { return parseInt(new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false }).format(date), 10) % 24; }
function getGreeting(date) { const hour = getKolkataHour(date); if (hour < 12) return "Good morning"; if (hour < 18) return "Good afternoon"; return "Good evening"; }
function formatKolkataTime(date) { return new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(date); }
function formatKolkataDate(date) { return new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date); }

function RevenueBreakdown({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-4 sm:px-8">
      {data.map(({ name, value }) => {
        const pct = total > 0 ? (value / total) * 100 : 0;
        return (
          <div key={name} className="flex items-center gap-4">
            <span className="w-12 shrink-0 text-[13px] font-semibold text-slate-700">{name}</span>
            <div className="bg-gray-100 h-2 rounded-full w-full overflow-hidden">
              <div className="bg-purple-700 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, 0.75)}%` }} />
            </div>
            <div className="w-40 shrink-0 text-right">
              <span className="text-[13px] font-semibold tabular-nums text-slate-900">{value.toLocaleString()}</span>
              <span className="ml-2 text-[11.5px] tabular-nums text-slate-400">{pct.toFixed(1)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [chartType, setChartType] = useState("bar");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (error)
    return (
      <div className="mx-auto mt-16 max-w-md rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
        <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle size={18} />
        </span>
        <p className="text-sm font-medium text-slate-800">Couldn't reach the data service</p>
        <p className="mt-1 text-[13px] text-slate-500">{error}</p>
      </div>
    );

  let chartData = [];
  let parameterDescription = "Gathering operational metrics across infrastructure nodes...";

  if (!loading && stats) {
    if (activeMetric === "revenue") {
      chartData = Object.entries(stats.total_revenue_by_currency || {}).map(([curr, val]) => ({ name: curr, value: val }));
      parameterDescription = "Invoiced totals grouped by settlement currency.";
    } else if (activeMetric === "goods") {
      chartData = stats.distribution_goods_category || [];
      parameterDescription = "Active catalog items grouped by style category.";
    } else if (activeMetric === "suppliers") {
      chartData = stats.distribution_suppliers || [];
      parameterDescription = "Top manufacturing partners by style contribution.";
    } else if (activeMetric === "buyers") {
      chartData = stats.distribution_buyers || [];
      parameterDescription = "Top purchasing organizations by ordered volume.";
    } else if (activeMetric === "orders") {
      chartData = stats.distribution_orders || [];
      parameterDescription = "Order pipeline throughput by fulfilment state.";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-gray-900">{getGreeting(now)} 👋</h1>
          <p className="mt-1 text-[13.5px] font-medium text-gray-600">It is currently {formatKolkataTime(now)} on {formatKolkataDate(now)}.</p>
          <p className="mt-0.5 text-[13px] text-gray-500">Here's what's moving across your apparel supply chain today.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All systems operational
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard icon={Package} label="Finished Goods" value={stats?.total_finished_goods || 0} delta="12.4%" progress={82} barColor="#6B21A8" active={activeMetric === "goods"} onClick={() => setActiveMetric("goods")} />
            <KpiCard icon={Factory} label="Suppliers" value={stats?.total_suppliers || 0} delta="3.1%" progress={58} barColor="#10B981" active={activeMetric === "suppliers"} onClick={() => setActiveMetric("suppliers")} />
            <KpiCard icon={Users} label="Buyers" value={stats?.total_buyers || 0} delta="7.8%" progress={66} barColor="#6B21A8" active={activeMetric === "buyers"} onClick={() => setActiveMetric("buyers")} />
            <KpiCard icon={ClipboardList} label="Orders" value={stats?.total_orders || 0} delta="9.2%" progress={74} barColor="#10B981" active={activeMetric === "orders"} onClick={() => setActiveMetric("orders")} />
          </>
        )}
      </div>

      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">Distribution insights</h2>
            <p className="mt-0.5 text-[12.5px] text-slate-500">{parameterDescription}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-gray-200 bg-slate-50 p-0.5">
              {METRIC_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  disabled={loading}
                  onClick={() => {
                    setActiveMetric(key);
                    if (key === "revenue") setChartType("bar");
                  }}
                  className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer disabled:opacity-50 ${
                    activeMetric === key
                      ? "bg-white text-[#6B21A8] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeMetric !== "revenue" && !loading && (
              <div className="flex rounded-lg border border-gray-200 bg-slate-50 p-0.5">
                <button
                  onClick={() => setChartType("bar")}
                  title="Bar chart"
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${chartType === "bar" ? "bg-white text-[#6B21A8] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <BarChart3 size={15} />
                </button>
                <button
                  onClick={() => setChartType("pie")}
                  title="Donut chart"
                  className={`rounded-md p-1.5 transition-colors cursor-pointer ${chartType === "pie" ? "bg-white text-[#6B21A8] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <PieIcon size={15} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-[360px] px-4 py-5 text-[12px] relative overflow-hidden">
          {loading ? (
            <div className="flex h-full w-full items-end gap-6 px-6 pb-4 pt-10 animate-pulse">
              <div className="h-[45%] w-full rounded-t bg-slate-100" />
              <div className="h-[75%] w-full rounded-t bg-slate-200/70" />
              <div className="h-[30%] w-full rounded-t bg-slate-100" />
              <div className="h-[90%] w-full rounded-t bg-slate-200/70" />
              <div className="h-[60%] w-full rounded-t bg-slate-100" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="grid h-full place-items-center text-[13px] text-slate-400">
              No data available for this view yet.
            </div>
          ) : activeMetric === "revenue" ? (
            <RevenueBreakdown data={chartData} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 28 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} interval={0} angle={-14} textAnchor="end" height={52} />
                  <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "rgba(107,33,168,0.04)" }} contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)", fontSize: "12px" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)", fontSize: "12px" }} />
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}