import { NavLink } from "react-router-dom";
import { LayoutDashboard, MessagesSquare, Search, Image as ImageIcon, ShoppingBag } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/nl-query", label: "Ask a question", icon: MessagesSquare },
  { to: "/search", label: "Product search", icon: Search },
  { to: "/image-search", label: "Image search", icon: ImageIcon },
  { to: "/catalog", label: "Finished goods", icon: ShoppingBag },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-denim text-canvas flex flex-col">
      <div className="px-6 py-6 border-b border-canvas/10">
        <p className="font-display text-lg tracking-wide">LoomIQ</p>
        <p className="text-[11px] uppercase tracking-widest text-canvas/50 mt-1">WFX ERP Explorer</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-thread text-ink font-medium"
                  : "text-canvas/70 hover:bg-canvas/10 hover:text-canvas"
              }`
            }
          >
            <Icon size={17} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-canvas/10">
        <p className="text-[11px] text-canvas/40">WFX Skill Test · 2026</p>
      </div>
    </aside>
  );
}
