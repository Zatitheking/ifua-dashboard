import { NavLink } from "react-router-dom";
import { LayoutDashboard, Kanban, Users, BarChart3, Settings, ChevronLeft, ChevronRight, RotateCcw, Eye, Briefcase, UserCheck, Building2 } from "lucide-react";
import { useAppStore } from "../../store/appStore";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipeline", icon: Kanban, label: "Pipeline" },
  { to: "/clients", icon: Building2, label: "Ügyfelek" },
  { to: "/team", icon: Users, label: "Csapat" },
  { to: "/capacity", icon: BarChart3, label: "Kapacitás" },
];

const viewItems = [
  { to: "/views/sponsor", icon: Eye, label: "Szponzor nézet" },
  { to: "/views/pm", icon: Briefcase, label: "PM nézet" },
  { to: "/views/member", icon: UserCheck, label: "Csapattag nézet" },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, resetToSeed } = useAppStore();

  return (
    <aside
      className={`${
        sidebarCollapsed ? "w-16" : "w-60"
      } bg-[#1A1F2E] h-screen flex flex-col transition-all duration-300 shrink-0 overflow-y-auto`}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-[#C8A951] flex items-center justify-center text-white font-bold text-sm shrink-0">
          IH
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-semibold text-sm whitespace-nowrap">IFUA Horváth</div>
            <div className="text-gray-400 text-[10px] whitespace-nowrap">Pipeline Dashboard</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#C8A951]/20 text-[#C8A951]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Views separator */}
        <div className="pt-3 pb-1">
          {!sidebarCollapsed && (
            <div className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Nézetek</div>
          )}
          {sidebarCollapsed && <div className="border-t border-white/10 mx-2" />}
        </div>

        {viewItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#C8A951]/20 text-[#C8A951]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#C8A951]/20 text-[#C8A951]"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`
          }
        >
          <Settings size={20} className="shrink-0" />
          {!sidebarCollapsed && <span>Beállítások</span>}
        </NavLink>
      </nav>

      {/* Reset button */}
      <div className="px-2 pb-2">
        <button
          onClick={resetToSeed}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors w-full cursor-pointer`}
          title="Adatok visszaállítása"
        >
          <RotateCcw size={18} className="shrink-0" />
          {!sidebarCollapsed && <span>Visszaállítás</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
