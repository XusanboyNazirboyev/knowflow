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
        const members = await apiClient.get<
            Array<{
                id: string;
                workspaceId: string;
                userId: string;
                role: "OWNER" | "ADMIN" | "MEMBER";
                joinedAt: string;
                user: { email: string; fullName: string };
            }>
        >(
            `/workspaces/${workspaceId}/members`,
        );
        return members.map((member) => ({
            id: member.id,
            workspaceId: member.workspaceId,
            userId: member.userId,
            name: member.user.fullName,
            email: member.user.email,
            avatarUrl: null,
            role: member.role.toLowerCase() as WorkspaceMember["role"],
            status: "active",
            joinedDate: member.joinedAt,
        }));
    },

    async invite(
        workspaceId: string,
        payload: InviteMemberPayload,
    ): Promise<WorkspaceMember> {
        const role = payload.role.toUpperCase();
        return await apiClient.post<WorkspaceMember>(`/workspaces/${workspaceId}/members`, {
            ...payload,
            role,
        });
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
