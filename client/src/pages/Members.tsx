/**
 * Members — workspace a'zolari ro'yxati va invite.
 */
import React, { useState } from "react";
import { UserPlus, Users, Mail, X, Trash2 } from "lucide-react";
import { memberApi } from "../api/member.api";
import { useWorkspace } from "../store/workspaceContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import EmptyState from "../components/layout/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { MEMBER_ROLES } from "../lib/constants";
import type { MemberRole, WorkspaceMember } from "../types";

export const Members: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const workspaceId = activeWorkspace?.id ?? "";
  const qc = useQueryClient();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("member");

  const { data: members, isLoading } = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => memberApi.list(workspaceId),
    enabled: !!workspaceId,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const inviteMutation = useMutation({
    mutationFn: () =>
      memberApi.invite(workspaceId, { email: inviteEmail, role: inviteRole }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members", workspaceId] });
      setShowInvite(false);
      setInviteEmail("");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => memberApi.remove(workspaceId, memberId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["members", workspaceId] }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: MemberRole;
    }) => memberApi.updateRole(workspaceId, memberId, { role }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["members", workspaceId] }),
  });

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-zinc-100">
            A'zolar
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {members?.length ?? 0} ta a'zo ·{" "}
            {members?.filter((m) => m.status === "active").length ?? 0} faol
          </p>
        </div>
        <Button
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => setShowInvite(true)}
        >
          Taklif etish
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (members?.length ?? 0) > 0 ? (
        <Card className="divide-y divide-zinc-800/60">
          {members!.map((m: WorkspaceMember) => (
            <div
              key={m.id}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              <Avatar name={m.name} email={m.email} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {m.name}
                </p>
                <p className="truncate text-xs text-zinc-500">{m.email}</p>
              </div>
              {m.status === "pending" && (
                <Badge variant="processing">Pending</Badge>
              )}
              <select
                value={m.role}
                onChange={(e) =>
                  updateRoleMutation.mutate({
                    memberId: m.id,
                    role: e.target.value as MemberRole,
                  })
                }
                disabled={m.role === "owner"}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 focus:outline-none disabled:opacity-50"
              >
                {MEMBER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {m.role !== "owner" && (
                <button
                  onClick={() => removeMutation.mutate(m.id)}
                  className="text-zinc-600 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState
          icon={<Users className="h-7 w-7 text-zinc-600" />}
          title="A'zolar yo'q"
          description="Jamoa a'zolarini workspace ga taklif qiling"
        />
      )}

      {/* Invite modal */}
      {showInvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => !inviteMutation.isPending && setShowInvite(false)}
        >
          <Card
            className="w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">
                Workspace ga taklif etish
              </h2>
              <button
                onClick={() => !inviteMutation.isPending && setShowInvite(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Email
                </label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="ali@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Rol
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as MemberRole)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50"
                >
                  {MEMBER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              isLoading={inviteMutation.isPending}
              onClick={() => inviteMutation.mutate()}
              disabled={!inviteEmail}
            >
              Taklif yuborish
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Members;
