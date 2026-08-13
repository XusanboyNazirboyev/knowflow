/**
 * Document API — upload (multipart), list, get, delete, download
 */
import apiClient from "./client";
import type {
    Document,
    DocumentQueryParams,
    UploadDocumentPayload,
    PaginatedResult,
} from "../types";

export const documentApi = {
    async list(
        workspaceId: string,
        _params?: DocumentQueryParams,
    ): Promise<PaginatedResult<Document>> {
        const items = await apiClient.get<Document[]>(
            `/workspaces/${workspaceId}/documents`,
        );
        return { items, total: items.length, page: 1, limit: items.length, hasMore: false };
    },

    async get(workspaceId: string, id: string): Promise<Document> {
        return await apiClient.get<Document>(
            `/workspaces/${workspaceId}/documents/${id}`,
        );
    },

    async upload(
        workspaceId: string,
        payload: UploadDocumentPayload,
    ): Promise<Document> {
        const formData = new FormData();
        formData.append("file", payload.file);
        if (payload.category) formData.append("category", payload.category);

        return await apiClient.post<Document>(
            `/workspaces/${workspaceId}/documents/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
    },

    async delete(workspaceId: string, id: string): Promise<void> {
        await apiClient.delete(`/workspaces/${workspaceId}/documents/${id}`);
    },

    async downloadUrl(workspaceId: string, id: string): Promise<string> {
        const res = await apiClient.get<{ url: string }>(
            `/workspaces/${workspaceId}/documents/${id}/download-url`,
        );
        return res.url;
    },
};
