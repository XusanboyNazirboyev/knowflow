/**
 * useChat — React Query hook: conversations + messages + AI send
 * Optimistic update bilan — user xabar darhol ekranda, AI javob keyin keladi.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat.api";
import { useWorkspace } from "../store/workspaceContext";
import type { SendMessagePayload } from "../types";

export function useConversations() {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";

    return useQuery({
        queryKey: ["conversations", workspaceId],
        queryFn: () => chatApi.listConversations(workspaceId),
        enabled: !!workspaceId,
    });
}

export function useMessages(conversationId: string | undefined) {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";

    return useQuery({
        queryKey: ["messages", workspaceId, conversationId],
        queryFn: () => chatApi.getMessages(workspaceId, conversationId!),
        enabled: !!workspaceId && !!conversationId,
    });
}

export function useCreateConversation() {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";
    const qc = useQueryClient();

    return useMutation({
        mutationFn: () => chatApi.createConversation(workspaceId, {}),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["conversations", workspaceId] });
        },
    });
}

export function useSendMessage() {
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id ?? "";
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: SendMessagePayload) =>
            chatApi.sendMessage(workspaceId, payload),
        // Optimistic: user xabarni darhol qo'shamiz, AI javob keyin
        onMutate: async (payload) => {
            await qc.cancelQueries({
                queryKey: ["messages", workspaceId, payload.conversationId],
            });
            const previous = qc.getQueryData([
                "messages",
                workspaceId,
                payload.conversationId,
            ]);
            return { previous, payload };
        },
        onSuccess: (data) => {
            qc.invalidateQueries({
                queryKey: [
                    "messages",
                    workspaceId,
                    data.message.conversationId,
                ],
            });
            qc.invalidateQueries({ queryKey: ["conversations", workspaceId] });
        },
    });
}
