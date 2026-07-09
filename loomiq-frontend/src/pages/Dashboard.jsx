import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../lib/api";
import StatCard from "../components/ui/StatCard";
import WovenLabel from "../components/ui/WovenLabel";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "#35507A", "#C68A2E", "#6B7F5B", "#B14A3A", 
  "#5C6B73", "#9A8C98", "#8338EC", "#3A86FF"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Clickable Parameter Filter States
  const [activeMetric, setActiveMetric] = useState("revenue"); // revenue | goods | suppliers | buyers | orders
  const [chartType, setChartType] = useState("bar"); // bar | pie

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink/50 text-sm font-mono p-4">Compiling distributed ERP ledger matrices...</p>;
  if (error) return <div className="p-4 bg-rust/10 border border-rust/30 text-rust text-xs rounded-md">Error connecting to cloud server: {error}</div>;

  // Dynamically map parameters based on selected click filter
  let chartData = [];
  let parameterDescription = "";

  if (activeMetric === "revenue" && stats) {
    chartData = Object.entries(stats.total_revenue_by_currency).map(([curr, val]) => ({
      name: curr,
      value: val,
    }));
    parameterDescription = "Invoiced Ledger totals filtered directly by financial currency denomination units.";
  } else if (activeMetric === "goods" && stats) {
    chartData = stats.distribution_goods_category || [];
    parameterDescription = "Total active catalog items cataloged and grouped by their primary style category segmentation.";
  } else if (activeMetric === "suppliers" && stats) {
    chartData = stats.distribution_suppliers || [];
    parameterDescription = "Top 8 manufacturing facilities evaluated by their total apparel style contribution capacity.";
  } else if (activeMetric === "buyers" && stats) {
    chartData = stats.distribution_buyers || [];
    parameterDescription = "Top registered purchasing organizations ranked by total cumulative piece volume units ordered.";
  } else if (activeMetric === "orders" && stats) {
    chartData = stats.distribution_orders || [];
    parameterDescription = "Live supply chain pipeline conversion throughput monitored by transaction fulfillment state.";
  }

  return (
    <div>
      {/* Top Banner Row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/50 font-display">Granular Overview Ledger</p>
          <h1 className="text-3xl font-display text-ink mt-1">Executive Analytics Panel</h1>
        </div>
        <WovenLabel tone="denim">WFX BI Cluster Active</WovenLabel>
      </div>

      {/* Interactive Core Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div onClick={() => setActiveMetric("goods")} className="cursor-pointer hover:scale-[1.02] transition-transform">
          <StatCard label="Finished Goods" value={stats.total_finished_goods} accent={activeMetric === "goods" ? "rust" : "denim"} />
        </div>
        <div onClick={() => setActiveMetric("suppliers")} className="cursor-pointer hover:scale-[1.02] transition-transform">
          <StatCard label="Suppliers" value={stats.total_suppliers} accent={activeMetric === "suppliers" ? "rust" : "thread"} />
        </div>
        <div onClick={() => setActiveMetric("buyers")} className="cursor-pointer hover:scale-[1.02] transition-transform">
          <StatCard label="Buyers" value={stats.total_buyers} accent={activeMetric === "buyers" ? "rust" : "sage"} />
        </div>
        <div onClick={() => setActiveMetric("orders")} className="cursor-pointer hover:scale-[1.02] transition-transform">
          <StatCard label="Orders" value={stats.total_orders} accent={activeMetric === "orders" ? "rust" : "rust"} />
        </div>
      </div>

      {/* Advanced Distributed Visualization Canvas */}
      <div className="bg-white/70 border border-ink/10 rounded-md p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-ink/5 pb-4 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm uppercase tracking-wider text-ink">
                Distribution Factor: <span className="text-denim font-bold capitalize font-mono text-xs">[{activeMetric}]</span>
              </h3>
            </div>
            <p className="text-xs text-ink/50 mt-0.5">{parameterDescription}</p>
          </div>

          {/* PARAMETER SELECTION BADGES */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-canvas/60 p-1 rounded border border-ink/5 flex gap-1 text-xs font-mono">
              <button
                onClick={() => { setActiveMetric("revenue"); setChartType("bar"); }}
                className={`px-2.5 py-1 rounded transition-colors ${activeMetric === "revenue" ? "bg-denim text-white font-medium" : "text-ink/60 hover:text-ink"}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setActiveMetric("goods")}
                className={`px-2.5 py-1 rounded transition-colors ${activeMetric === "goods" ? "bg-denim text-white font-medium" : "text-ink/60 hover:text-ink"}`}
              >
                Goods Category
              </button>
              <button
                onClick={() => setActiveMetric("suppliers")}
                className={`px-2.5 py-1 rounded transition-colors ${activeMetric === "suppliers" ? "bg-denim text-white font-medium" : "text-ink/60 hover:text-ink"}`}
              >
                Supplier Mix
              </button>
              <button
                onClick={() => setActiveMetric("buyers")}
                className={`px-2.5 py-1 rounded transition-colors ${activeMetric === "buyers" ? "bg-denim text-white font-medium" : "text-ink/60 hover:text-ink"}`}
              >
                Buyer Share
              </button>
              <button
                onClick={() => setActiveMetric("orders")}
                className={`px-2.5 py-1 rounded transition-colors ${activeMetric === "orders" ? "bg-denim text-white font-medium" : "text-ink/60 hover:text-ink"}`}
              >
                Order Pipeline
              </button>
            </div>

            {/* BAR vs PIE RENDER TOGGLE SWITCH */}
            {activeMetric !== "revenue" && (
              <div className="bg-canvas/60 p-1 rounded border border-ink/5 flex gap-1 text-xs font-mono">
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 rounded transition-all ${chartType === "bar" ? "bg-thread text-ink font-medium shadow-2xs" : "text-ink/40"}`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setChartType("pie")}
                  className={`px-3 py-1 rounded transition-all ${chartType === "pie" ? "bg-thread text-ink font-medium shadow-2xs" : "text-ink/40"}`}
                >
                  Pie Chart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GRAPH VIEWPORT */}
        <div className="w-full h-80 font-mono text-xs mt-4">
          {chartData.length === 0 ? (
            <p className="text-center text-ink/40 pt-20">No matching tracking vectors populated for this partition state.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} stroke="#21242B" />
                  <XAxis dataKey="name" stroke="#21242B" opacity={0.7} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis stroke="#21242B" opacity={0.7} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(33,36,43,0.02)" }} contentStyle={{ backgroundColor: "#F6F3EC", borderRadius: "4px", borderColor: "rgba(33,36,43,0.1)" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: "#F6F3EC", borderRadius: "4px", borderColor: "rgba(33,36,43,0.1)" }} />
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
