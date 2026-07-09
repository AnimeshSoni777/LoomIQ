import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessagesSquare,
  Search,
  Image as ImageIcon,
  ShoppingBag,
  Layers,
  Settings,
  LifeBuoy,
} from "lucide-react";

/* Grouped navigation — enterprise CRM information architecture */
/* Order mirrors the route table in App.jsx:
   "/" → "/nl-query" → "/search" → "/image-search" → "/catalog"   */
const NAV_GROUPS = [
  {
    heading: "Workspace",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Intelligence",
    items: [
      { to: "/search", label: "Product Search", icon: MessagesSquare, badge: "AI" },
      { to: "/image-search", label: "Visual Search", icon: ImageIcon, badge: "AI" },
    ],
  },
  {
    heading: "Catalog",
    items: [
      { to: "/nl-query", label: "Ask a Question", icon: Search },
      { to: "/catalog", label: "Finished Goods", icon: ShoppingBag },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-[#1C1C21] text-slate-300">
      {/* ── Product identity ────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 pb-5 pt-5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#6B21A8] shadow-[0_0_16px_rgba(107,33,168,0.45)]">
          <Layers size={16} className="text-white" strokeWidth={2} />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[14px] font-semibold text-white">LoomIQ</p>
          <p className="truncate text-[11px] text-slate-500">WFX ERP Explorer</p>
        </div>
      </div>

      {/* ── Grouped navigation ──────────────────────────────────── */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-[#6B21A8] text-white shadow-[0_1px_8px_rgba(107,33,168,0.4)]"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={16}
                          strokeWidth={1.9}
                          className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}
                        />
                        <span className="flex-1 truncate">{label}</span>
                        {badge && (
                          <span
                            className={`rounded px-1.5 py-px text-[9px] font-bold tracking-wide ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-[#6B21A8]/25 text-[#C084FC]"
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Bottom utility rail ─────────────────────────────────── */}
      <div className="space-y-0.5 border-t border-white/[0.07] px-3 py-3">
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100 cursor-pointer">
          <LifeBuoy size={16} strokeWidth={1.9} className="text-slate-500" />
          Support
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100 cursor-pointer">
          <Settings size={16} strokeWidth={1.9} className="text-slate-500" />
          Settings
        </button>
      </div>

      {/* ── Org / plan card ─────────────────────────────────────── */}
      <div className="border-t border-white/[0.07] p-3">
        <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-2.5 py-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#6B21A8] to-[#9333EA] text-[10px] font-bold text-white">
            AS
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[12px] font-medium text-slate-200">Built by Animesh Soni</p>
            <p className="truncate text-[10px] text-slate-500">Enterprise · 2026</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
