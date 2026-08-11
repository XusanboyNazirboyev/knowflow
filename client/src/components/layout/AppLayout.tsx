/**
 * AppLayout — autentifikatsiya qilingan app uchun tashqi skelet.
 * Sidebar + Header + <Outlet /> (content area).
 */
import React from "react";
import { Outlet } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../store/AuthContext";
// import { ROUTES } from "../lib/constants";

export const AppLayout: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b border-zinc-800/60 bg-zinc-950/80 px-5">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input
              placeholder="Search documents, chats..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-1.5 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-amber-500/40 focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
            </button>
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;