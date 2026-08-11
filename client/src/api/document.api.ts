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
        params?: DocumentQueryParams,
    ): Promise<PaginatedResult<Document>> {
        return await apiClient.get<PaginatedResult<Document>>(
            `/workspaces/${workspaceId}/documents`,
            { params },
        );
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
            `/workspaces/${workspaceId}/documents/${id}/download`,
        );
        return res.url;
    },
};
