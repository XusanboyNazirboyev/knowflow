/**
 * Sidebar — app ichki navigatsiya.
 * Dark Academia: qattiq qora fon, amber active state.
 * Workspace switcher + nav items + user footer.
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { NAV_ITEMS } from "../../lib/constants";
import { useWorkspace } from "../../store/workspaceContext";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../store/AuthContext";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Settings,
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { activeWorkspace, workspaces } = useWorkspace();
  const { user } = useAuth();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-zinc-800/60 bg-zinc-950/60">
      {/* Workspace switcher */}
      <div className="border-b border-zinc-800/60 p-3">
        <div className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
            <FileText className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-200">
              {activeWorkspace?.name ?? "No workspace"}
            </p>
            <p className="text-[10px] text-zinc-600">
              {activeWorkspace?.plan ?? "free"} plan
            </p>
          </div>
          {workspaces.length > 1 && (
            <ChevronDown className="h-4 w-4 text-zinc-600" />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-zinc-800/60 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <Avatar
            name={user?.fullName ?? user?.email ?? "U"}
            email={user?.email}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-200">
              {user?.fullName ?? "User"}
            </p>
            <p className="truncate text-[10px] text-zinc-600">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;