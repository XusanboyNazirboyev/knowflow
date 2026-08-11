/**
 * Workspace API — workspace CRUD + context management
 */
import apiClient from "./client";
import type {
    Workspace,
    CreateWorkspacePayload,
    UpdateWorkspacePayload,
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
};
