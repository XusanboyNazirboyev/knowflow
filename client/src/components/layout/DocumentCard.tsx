/**
 * DocumentCard — documents grid uchun karta.
 * Status, type, size, category va link to detail.
 */
import React from "react";
import { Link } from "react-router-dom";
import { FileText, Trash2 } from "lucide-react";
import { Card } from "../ui/Card";
import StatusBadge from "./StatusBadge";
import { formatBytes, relativeTime } from "../../lib/utils";
import { ROUTES } from "../../lib/constants";
import type { Document } from "../../types";

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
}

const fileTypeColors: Record<string, string> = {
  pdf: "text-red-400 bg-red-500/10",
  docx: "text-blue-400 bg-blue-500/10",
  txt: "text-zinc-400 bg-zinc-500/10",
  md: "text-emerald-400 bg-emerald-500/10",
  xlsx: "text-amber-400 bg-amber-500/10",
};

function getFileType(document: Document): string {
  const extension = document.fileName.split(".").pop()?.toLowerCase();
  return extension ?? "file";
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
}) => {
  return (
    <Card className="group relative p-4 transition-colors hover:border-amber-500/30">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${fileTypeColors[getFileType(document)] ?? "text-zinc-400 bg-zinc-500/10"
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>

        <Link
          to={ROUTES.DOCUMENT_DETAIL(document.id)}
          className="min-w-0 flex-1"
        >
          <h3 className="truncate text-sm font-medium text-zinc-100 group-hover:text-amber-400">
            {document.fileName}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-600">
            {getFileType(document).toUpperCase()} · {formatBytes(document.fileSize)}
          </p>
        </Link>

        {onDelete && (
          <button
            onClick={() => onDelete(document.id)}
            className="opacity-0 transition-opacity group-hover:opacity-100 text-zinc-500 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-3">
        <StatusBadge status={document.status} />
        <span className="text-[10px] text-zinc-600">
          {relativeTime(document.createdAt)}
        </span>
      </div>

    </Card>
  );
};

export default DocumentCard;
