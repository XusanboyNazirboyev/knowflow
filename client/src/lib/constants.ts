/**
 * Constants — route paths, file types, roles, limits
 * Bitta joyda — agar URL o'zgarsa faqat shu yerdan o'zgartiriladi.
 */

export const ROUTES = {
    LANDING: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/app/dashboard",
    DOCUMENTS: "/app/documents",
    DOCUMENT_DETAIL: (id: string) => `/app/documents/${id}`,
    CHAT: "/app/chat",
    CHAT_DETAIL: (id: string) => `/app/chat/${id}`,
    MEMBERS: "/app/members",
    SETTINGS: "/app/settings",
} as const;

export const DOCUMENT_TYPES = ["pdf", "docx", "txt", "md", "xlsx"] as const;

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const MEMBER_ROLES = ["owner", "admin", "member"] as const;

/** Sidebar navigation config */
export const NAV_ITEMS = [
    { label: "Dashboard", path: "/app/dashboard", icon: "LayoutDashboard" },
    { label: "Documents", path: "/app/documents", icon: "FileText" },
    { label: "Chat", path: "/app/chat", icon: "MessageSquare" },
    { label: "Members", path: "/app/members", icon: "Users" },
    { label: "Settings", path: "/app/settings", icon: "Settings" },
] as const;
