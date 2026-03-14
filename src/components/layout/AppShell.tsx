import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 lg:pb-0">
        <Outlet />
      </main>
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
