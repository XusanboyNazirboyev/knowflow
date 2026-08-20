/**
 * Workspace context — faol workspace ni saqlaydi.
 * Multi-tenant: faqat bitta workspace bir vaqtda faol bo'ladi.
 * Sidebar da tanlanadi, barcha API chaqiruvlar shu workspace id ga bog'lanadi.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { workspaceApi } from "../api/workspace.api";
import { useAuth } from "./AuthContext";
import type { Workspace } from "../types";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (ws: Workspace) => void;
  isLoading: boolean;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, slug: string) => Promise<Workspace>;   // ← bu qator bormi?
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  interface WorkspaceContextValue {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    setActiveWorkspace: (ws: Workspace) => void;
    isLoading: boolean;
    refreshWorkspaces: () => Promise<void>;
    createWorkspace: (name: string, slug: string) => Promise<Workspace>;   // ← yangi
  }
  
  const loadWorkspaces = useCallback(async () => {
    if (!isAuthenticated) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      return;
    }
    setIsLoading(true);
    try {
      const list = await workspaceApi.list();
      setWorkspaces(list);

      const savedId = localStorage.getItem("active_workspace_id");   // ← QAYTARILDI
      const saved = savedId ? list.find((w) => w.id === savedId) : null;
      const nextWorkspace = saved || list[0] || null;
      if (!nextWorkspace) localStorage.removeItem("active_workspace_id");
      setActiveWorkspace(nextWorkspace);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = window.setInterval(() => void loadWorkspaces(), 5000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, loadWorkspaces]);

  useEffect(() => {
    const refresh = () => void loadWorkspaces();
    window.addEventListener("focus", refresh);
    window.addEventListener("workspace-access-revoked", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("workspace-access-revoked", refresh);
    };
  }, [loadWorkspaces]);

  const switchWorkspace = useCallback((ws: Workspace) => {
    setActiveWorkspace(ws);
    localStorage.setItem("active_workspace_id", ws.id);
  }, []);


  const createWorkspace = useCallback(async (name: string, slug: string) => {
    const newWorkspace = await workspaceApi.create({ name, slug });
    await loadWorkspaces();
    switchWorkspace(newWorkspace);
    return newWorkspace;
  }, [loadWorkspaces, switchWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        setActiveWorkspace: switchWorkspace,
        isLoading,
        refreshWorkspaces: loadWorkspaces,
        createWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
