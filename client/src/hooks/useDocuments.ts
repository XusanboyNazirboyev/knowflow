/**
 * useDocuments — React Query hook: list + upload + delete
 * Components faqat shu hook ni ishlatadi, to'g'ridan-to'g'ri apiClient chaqirmaydi.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentApi } from "../api/document.api";
import { useWorkspace } from "../store/workspaceContext";
import type { DocumentQueryParams, UploadDocumentPayload } from "../types";

export function useDocuments(params?: DocumentQueryParams) {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";

    return useQuery({
        queryKey: ["documents", workspaceId, params],
        queryFn: () => documentApi.list(workspaceId, params),
        enabled: !!workspaceId,
        // Processing documentlar uchun refetch har 5 soniyada
        refetchInterval: (query) =>
            query.state.data?.items.some(
                (d) => d.status === "PENDING" || d.status === "PROCESSING",
            )
                ? 5000
                : false,
    });
}

export function useDocument(documentId: string) {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";

    return useQuery({
        queryKey: ["document", workspaceId, documentId],
        queryFn: () => documentApi.get(workspaceId, documentId),
        enabled: !!workspaceId && !!documentId,
    });
}

export function useUploadDocument() {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: UploadDocumentPayload) =>
            documentApi.upload(workspaceId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["documents", workspaceId] });
        },
    });
}

export function useDeleteDocument() {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) =>
            documentApi.delete(workspaceId, documentId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["documents", workspaceId] });
        },
    });
}
