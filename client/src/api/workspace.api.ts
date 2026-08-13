/**
 * Workspace API — workspace CRUD + context management
 */
import apiClient from "./client";
import type {
    Workspace,
    CreateWorkspacePayload,
    UpdateWorkspacePayload,
    WorkspaceInvitation,
    Notification,
} from "../types";

export const workspaceApi = {
    async list(): Promise<Workspace[]> {
        return await apiClient.get<Workspace[]>("/workspaces");
    },

    async get(id: string): Promise<Workspace> {
        return await apiClient.get<Workspace>(`/workspaces/${id}`);
    },

    async getBySlug(slug: string): Promise<Workspace> {
        return await apiClient.get<Workspace>(`/workspaces/slug/${slug}`);
    },

    async create(payload: CreateWorkspacePayload): Promise<Workspace> {
        return await apiClient.post<Workspace>("/workspaces", payload);
    },

    async update(
        id: string,
        payload: UpdateWorkspacePayload,
    ): Promise<Workspace> {
        return await apiClient.put<Workspace>(`/workspaces/${id}`, payload);
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/workspaces/${id}`);
    },

    async listMyInvitations(): Promise<WorkspaceInvitation[]> {
        const invitations = await apiClient.get<
            Array<{
                id: string;
                role: "OWNER" | "ADMIN" | "MEMBER";
                createdAt: string;
                workspace: { id: string; name: string; slug: string };
            }>
        >("/workspaces/invitations/mine");
        return invitations.map((invitation) => ({
            ...invitation,
            role: invitation.role.toLowerCase() as WorkspaceInvitation["role"],
        }));
    },

    async acceptInvitation(invitationId: string): Promise<void> {
        await apiClient.post(`/workspaces/invitations/${invitationId}/accept`, {});
    },

    async declineInvitation(invitationId: string): Promise<void> {
        await apiClient.post(`/workspaces/invitations/${invitationId}/decline`, {});
    },

    async listNotifications(): Promise<Notification[]> {
        return apiClient.get<Notification[]>("/workspaces/notifications");
    },

    async markNotificationRead(notificationId: string): Promise<void> {
        await apiClient.patch(`/workspaces/notifications/${notificationId}/read`, {});
    },
};
