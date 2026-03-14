import { NavLink } from "react-router-dom";
import { LayoutDashboard, Kanban, Users, BarChart3, Settings } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipeline", icon: Kanban, label: "Pipeline" },
  { to: "/team", icon: Users, label: "Csapat" },
  { to: "/capacity", icon: BarChart3, label: "Kapacitás" },
  { to: "/settings", icon: Settings, label: "Beáll." },
];

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1F2E] border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors min-w-[3.5rem] ${
                isActive ? "text-[#C8A951]" : "text-gray-400"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
