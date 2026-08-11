/**
 * TypeScript tiplar — frontend va backend uchun yagona manba.
 * Backend NestJS DTO lari shu interfacelarga mos keladi.
 */

// ============================================================
// USER
// ============================================================
export type UserRole = "admin" | "user";

export interface User {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

// ============================================================
// AUTH
// ============================================================
export interface AuthTokens {
    accessToken: string;
    /** refreshToken httpOnly cookie da keladi — bu yerda faqat muddati */
    expiresIn: number;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    fullName?: string;
}

// ============================================================
// WORKSPACE — multi-tenant root
// ============================================================
export type WorkspacePlan = "free" | "pro" | "enterprise";

export interface Workspace {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    avatarUrl: string | null;
    plan: WorkspacePlan;
    accentColor: string;
    memberCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkspacePayload {
    name: string;
    slug: string;
    description?: string;
}

export interface UpdateWorkspacePayload {
    name?: string;
    description?: string;
    accentColor?: string;
}

// ============================================================
// WORKSPACE MEMBER
// ============================================================
export type MemberRole = "owner" | "admin" | "member";
export type MemberStatus = "active" | "pending" | "invited";

export interface WorkspaceMember {
    id: string;
    workspaceId: string;
    userId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: MemberRole;
    status: MemberStatus;
    joinedDate: string;
}

export interface InviteMemberPayload {
    email: string;
    role: MemberRole;
}

export interface UpdateMemberRolePayload {
    role: MemberRole;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// ============================================================
// DOCUMENT
// ============================================================
export type DocumentFileType = "pdf" | "docx" | "txt" | "md" | "xlsx";
export type DocumentStatus = "processing" | "ready" | "failed";

export interface Document {
    id: string;
    workspaceId: string;
    title: string;
    fileType: DocumentFileType;
    fileSize: number;
    status: DocumentStatus;
    /** Processing progress 0-100 (ready=100, failed=0) */
    progress: number;
    chunkCount: number;
    category: string | null;
    summary: string | null;
    uploadedById: string;
    uploadedByName: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UploadDocumentPayload {
    file: File;
    category?: string;
}

export interface DocumentQueryParams {
    search?: string;
    category?: string;
    status?: DocumentStatus;
    page?: number;
    limit?: number;
}

// ============================================================
// DOCUMENT CHUNK — RAG embeddings uchun (backend entity)
// ============================================================
export interface DocumentChunk {
    id: string;
    documentId: string;
    content: string;
    chunkIndex: number;
    /** Token count — embedding cost monitoring uchun */
    tokenCount: number;
    /** pgvector embedding (backend da, frontend ga yuborilmaydi) */
    embedding?: number[];
}

// ============================================================
// CONVERSATION + MESSAGE (Chat)
// ============================================================
export interface Conversation {
    id: string;
    workspaceId: string;
    title: string;
    lastMessage: string | null;
    messageCount: number;
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
}

export type MessageRole = "user" | "assistant";

export interface MessageSource {
    documentId: string;
    documentTitle: string;
    page: number;
    snippet: string;
    /** Similarity score 0-1 — RAG retrieval ishonchliligi */
    score: number;
}

export interface Message {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    sources: MessageSource[];
    latencyMs: number | null;
    createdAt: string;
}

export interface CreateConversationPayload {
    title?: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
}

export interface ChatResponse {
    message: Message;
    /** RAG retrieval topilgan chunklar — debugging/debug interfeys uchun */
    retrievedChunks: number;
}

// ============================================================
// NOTIFICATION
// ============================================================
export type NotificationType =
    | "document_ready"
    | "member_joined"
    | "mention"
    | "system";

export interface Notification {
    id: string;
    type: NotificationType;
    content: string;
    isRead: boolean;
    createdAt: string;
}
