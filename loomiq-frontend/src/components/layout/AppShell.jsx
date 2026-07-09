import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bell, ChevronDown } from "lucide-react";

/* Route → header meta (breadcrumb trail) */
const ROUTE_META = {
  "/": { section: "Workspace", title: "Dashboard" },
  "/nl-query": { section: "Intelligence", title: "Ask a Question" },
  "/search": { section: "Catalog", title: "Product Search" },
  "/image-search": { section: "Intelligence", title: "Visual Search" },
  "/catalog": { section: "Catalog", title: "Finished Goods" },
};

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] ?? { section: "Workspace", title: "LoomIQ" };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 antialiased">
      {/* ── Fixed full-height charcoal rail ─────────────────────── */}
      <Sidebar />

      {/* ── Right column: header + scrollable canvas ────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Clean white top header bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6">
          {/* Left: breadcrumb trail */}
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-slate-400">{meta.section}</span>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-800">{meta.title}</span>
          </div>

          {/* Right: minimal utility cluster */}
          <div className="flex items-center gap-1">
            {/* Notification bell with purple badge */}
            <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
              <Bell size={16} />
              <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#6B21A8] px-1 text-[9px] font-semibold leading-none text-white">
                3
              </span>
            </button>

            {/* Account chip */}
            <button className="ml-1 flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-slate-100 cursor-pointer">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#6B21A8] text-[11px] font-semibold text-white">
                AS
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Soft off-white main canvas */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
