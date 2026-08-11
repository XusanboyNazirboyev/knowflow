/**
 * Chat API — conversations, messages, AI send (RAG)
 */
import apiClient from "./client";
import type {
    Conversation,
    Message,
    CreateConversationPayload,
    SendMessagePayload,
    ChatResponse,
} from "../types";

export const chatApi = {
    // --- Conversations ---
    async listConversations(workspaceId: string): Promise<Conversation[]> {
        return await apiClient.get<Conversation[]>(
            `/workspaces/${workspaceId}/conversations`,
        );
    },

    async createConversation(
        workspaceId: string,
        payload?: CreateConversationPayload,
    ): Promise<Conversation> {
        return await apiClient.post<Conversation>(
            `/workspaces/${workspaceId}/conversations`,
            payload || {},
        );
    },

    async deleteConversation(
        workspaceId: string,
        conversationId: string,
    ): Promise<void> {
        await apiClient.delete(
            `/workspaces/${workspaceId}/conversations/${conversationId}`,
        );
    },

    async togglePin(
        workspaceId: string,
        conversationId: string,
    ): Promise<Conversation> {
        return await apiClient.patch<Conversation>(
            `/workspaces/${workspaceId}/conversations/${conversationId}/pin`,
        );
    },

    // --- Messages ---
    async getMessages(
        workspaceId: string,
        conversationId: string,
    ): Promise<Message[]> {
        return await apiClient.get<Message[]>(
            `/workspaces/${workspaceId}/conversations/${conversationId}/messages`,
        );
    },

    /** Asosiy RAG endpoint — savol yuborib AI javob + sources olish */
    async sendMessage(
        workspaceId: string,
        payload: SendMessagePayload,
    ): Promise<ChatResponse> {
        return await apiClient.post<ChatResponse>(
            `/workspaces/${workspaceId}/chat`,
            payload,
        );
    },
};
