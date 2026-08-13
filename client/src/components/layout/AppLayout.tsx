/**
 * AppLayout — autentifikatsiya qilingan app uchun tashqi skelet.
 * Sidebar + Header + <Outlet /> (content area).
 */
import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Search, Bell, LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../store/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "../../api/workspace.api";
import { relativeTime } from "../../lib/utils";
// import { ROUTES } from "../lib/constants";

export const AppLayout: React.FC = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const lastNotificationId = useRef<string | null>(null);
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: workspaceApi.listNotifications,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
  const markRead = useMutation({
    mutationFn: workspaceApi.markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    const newestUnread = notifications.find((notification) => !notification.isRead);
    if (newestUnread && newestUnread.id !== lastNotificationId.current) {
      lastNotificationId.current = newestUnread.id;
      setToast(newestUnread.content);
      const timeout = window.setTimeout(() => setToast(null), 5000);
      return () => window.clearTimeout(timeout);
    }
  }, [notifications]);

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
            <button
              onClick={() => setIsNotificationsOpen((open) => !open)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              aria-label="Bildirishnomalar"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-zinc-950">{unreadCount}</span>}
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

        {isNotificationsOpen && (
          <div className="absolute right-4 top-16 z-50 w-96 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="border-b border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-100">Bildirishnomalar</div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? <p className="p-4 text-sm text-zinc-500">Hozircha xabarlar yo‘q.</p> : notifications.map((notification) => (
                <button key={notification.id} onClick={() => !notification.isRead && markRead.mutate(notification.id)} className={`block w-full border-b border-zinc-800/60 px-4 py-3 text-left hover:bg-zinc-900 ${notification.isRead ? "" : "bg-amber-500/5"}`}>
                  <p className="text-sm text-zinc-200">{notification.content}</p>
                  <p className="mt-1 text-xs text-zinc-600">{relativeTime(notification.createdAt)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {toast && <button onClick={() => setIsNotificationsOpen(true)} className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-amber-500/30 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-100 shadow-xl">{toast}</button>}

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
