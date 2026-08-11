/**
 * Dashboard — workspace statistikasi + so'nggi activity.
 */
import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Users,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import { useConversations } from "../hooks/useChat";
import { useWorkspace } from "../store/workspaceContext";
import { Card } from "../components/ui/Card";
import StatusBadge from "../components//layout/StatusBadge";
import EmptyState from "../components/layout/EmptyState";
import { Button } from "../components/ui/Button";
import { relativeTime } from "../lib/utils";
import { ROUTES } from "../lib/constants";

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}> = ({ icon, label, value, hint }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-xl font-semibold text-zinc-100">{value}</p>
        {hint && <p className="text-[10px] text-zinc-600">{hint}</p>}
      </div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { activeWorkspace } = useWorkspace();
  const { data: docsData } = useDocuments();
  const { data: conversations } = useConversations();

  const docs = docsData?.items ?? [];
  const readyCount = docs.filter((d: any) => d.status === "ready").length;
  const processingCount = docs.filter((d: any) => d.status === "processing").length;
  const recentDocs = [...docs].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  ).slice(0, 4);
  const recentConvs = [...(conversations ?? [])].slice(0, 4);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-xl font-bold text-zinc-100">
          {activeWorkspace?.name ?? "Workspace"}
        </h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Umumiy ko'rinish va so'nggi faollik
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Hujjatlar"
          value={docs.length}
          hint={`${readyCount} ready · ${processingCount} processing`}
        />
        <StatCard
          icon={<MessageSquare className="h-5 w-5" />}
          label="Suhbatlar"
          value={conversations?.length ?? 0}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="A'zolar"
          value={activeWorkspace?.memberCount ?? 1}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Indexed chunks"
          value={docs.reduce((s: any, d: any) => s + d.chunkCount, 0)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent documents */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">
              So'nggi hujjatlar
            </h2>
            <Link
              to={ROUTES.DOCUMENTS}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Barchasi
            </Link>
          </div>
          {recentDocs.length > 0 ? (
            <div className="space-y-2">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  to={ROUTES.DOCUMENT_DETAIL(doc.id)}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 px-3 py-2.5 hover:border-amber-500/30"
                >
                  <FileText className="h-4 w-4 shrink-0 text-zinc-500" />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                    {doc.title}
                  </span>
                  <StatusBadge status={doc.status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="h-7 w-7 text-zinc-600" />}
              title="Hujjatlar yo'q"
              description="Birinchi hujjatingizni yuklang"
              action={
                <Link to={ROUTES.DOCUMENTS}>
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Yuklash
                  </Button>
                </Link>
              }
            />
          )}
        </div>

        {/* Recent conversations */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">
              So'nggi suhbatlar
            </h2>
            <Link
              to={ROUTES.CHAT}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Barchasi
            </Link>
          </div>
          {recentConvs.length > 0 ? (
            <div className="space-y-2">
              {recentConvs.map((conv) => (
                <Link
                  key={conv.id}
                  to={ROUTES.CHAT_DETAIL(conv.id)}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/30 px-3 py-2.5 hover:border-amber-500/30"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                    {conv.title}
                  </span>
                  <span className="text-[10px] text-zinc-600">
                    {relativeTime(conv.updatedAt)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-7 w-7 text-zinc-600" />}
              title="Suhbatlar yo'q"
              description="Knowledge base ga savol bering"
              action={
                <Link to={ROUTES.CHAT}>
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Yangi suhbat
                  </Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;