/**
 * Member API — workspace membership va invite
 */
import apiClient from "./client";
import type {
    WorkspaceMember,
    InviteMemberPayload,
    UpdateMemberRolePayload,
} from "../types";

export const memberApi = {
    async list(workspaceId: string): Promise<WorkspaceMember[]> {
        return await apiClient.get<WorkspaceMember[]>(
            `/workspaces/${workspaceId}/members`,
        );
    },

    async invite(
        workspaceId: string,
        payload: InviteMemberPayload,
    ): Promise<WorkspaceMember> {
        return await apiClient.post<WorkspaceMember>(
            `/workspaces/${workspaceId}/members/invite`,
            payload,
        );
    },

    async updateRole(
        workspaceId: string,
        memberId: string,
        payload: UpdateMemberRolePayload,
    ): Promise<WorkspaceMember> {
        return await apiClient.patch<WorkspaceMember>(
            `/workspaces/${workspaceId}/members/${memberId}`,
            payload,
        );
    },

    async remove(workspaceId: string, memberId: string): Promise<void> {
        await apiClient.delete(
            `/workspaces/${workspaceId}/members/${memberId}`,
        );
    },
};
