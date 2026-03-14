import { Bell, Search } from "lucide-react";
import { Avatar } from "../ui/Avatar";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="lg:hidden w-8 h-8 rounded-lg bg-[#C8A951] flex items-center justify-center text-white font-bold text-xs shrink-0">
          IH
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 m-0">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Keresés..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951] w-56"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <Avatar name="Admin User" size="sm" className="sm:hidden" />
        <Avatar name="Admin User" size="md" className="hidden sm:flex" />
      </div>
    </header>
  );
}
