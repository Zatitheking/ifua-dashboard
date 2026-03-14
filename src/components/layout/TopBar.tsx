import { useState, useRef, useEffect } from "react";
import { Bell, Search, X, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { useAppStore } from "../../store/appStore";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const demoNotifications = [
  { id: 1, text: "Richter Supply Chain projekt megnyerve", time: "2 órája", read: false },
  { id: 2, text: "Coca-Cola Data Platform — szerződés aláírva", time: "5 órája", read: false },
  { id: 3, text: "Wizz Air tárgyalás holnap 10:00-kor", time: "Ma", read: true },
  { id: 4, text: "Ericsson SAFe — Q1 mérföldkő teljesítve", time: "Tegnap", read: true },
  { id: 5, text: "K&H ESG ajánlat beadási határidő: péntekig", time: "2 napja", read: true },
];

export function TopBar({ title, subtitle }: TopBarProps) {
  const { projects, persons, clients } = useAppStore();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = searchQuery.toLowerCase();
  const searchResults = searchQuery.length >= 2
    ? [
        ...projects.filter((p) => p.company.toLowerCase().includes(q) || p.projectName.toLowerCase().includes(q)).slice(0, 4).map((p) => ({
          type: "projekt" as const, label: `${p.company} — ${p.projectName}`, action: () => { navigate("/pipeline"); setSearchOpen(false); setSearchQuery(""); },
        })),
        ...persons.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3).map((p) => ({
          type: "személy" as const, label: p.name, action: () => { navigate("/team"); setSearchOpen(false); setSearchQuery(""); },
        })),
        ...(clients ?? []).filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3).map((c) => ({
          type: "ügyfél" as const, label: c.name, action: () => { navigate("/clients"); setSearchOpen(false); setSearchQuery(""); },
        })),
      ]
    : [];

  const unreadCount = demoNotifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="lg:hidden w-8 h-8 rounded-lg bg-[#C8A951] flex items-center justify-center text-white font-bold text-xs shrink-0">
          IH
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 m-0">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div ref={searchRef} className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Keresés..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8A951]/30 focus:border-[#C8A951] w-56"
          />
          {searchOpen && searchQuery.length >= 2 && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {searchResults.length === 0 ? (
                <div className="p-4 text-sm text-gray-400 text-center">Nincs találat</div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={r.action}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="text-sm text-gray-900">{r.label}</div>
                      <div className="text-[10px] text-gray-400 uppercase">{r.type}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Értesítések</span>
                <span className="text-[10px] text-[#C8A951] font-medium cursor-pointer hover:underline">Mind olvasott</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {demoNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!n.read ? "bg-amber-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-2 h-2 bg-[#C8A951] rounded-full mt-1.5 shrink-0" />}
                      <div>
                        <div className="text-sm text-gray-900">{n.text}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="cursor-pointer"
          >
            <Avatar name="Admin User" size="sm" className="sm:hidden" />
            <Avatar name="Admin User" size="md" className="hidden sm:flex" />
          </button>
          {profileOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-900">Admin User</div>
                <div className="text-[10px] text-gray-400">admin@demo.hu</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Settings size={14} className="text-gray-400" /> Beállítások
                </button>
                <button
                  onClick={() => { navigate("/team"); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} className="text-gray-400" /> Profilom
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer border-t border-gray-100">
                  <LogOut size={14} className="text-gray-400" /> Kijelentkezés
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
