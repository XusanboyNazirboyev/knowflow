/**
 * SourceCitation — AI javobidagi manba ko'rsatkich.
 * Clickable: document detail ga olib boradi.
 */
import React from "react";
import { Link } from "react-router-dom";
import { FileText, Quote } from "lucide-react";
import type { MessageSource } from "../../types";
import { ROUTES } from "../../lib/constants";

interface SourceCitationProps {
  source: MessageSource;
}

export const SourceCitation: React.FC<SourceCitationProps> = ({ source }) => {
  return (
    <Link
      to={ROUTES.DOCUMENT_DETAIL(source.documentId)}
      className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 transition-colors hover:border-amber-500/30 hover:bg-zinc-900/60"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
        <FileText className="h-4 w-4 text-amber-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-xs font-medium text-zinc-200">
            {source.documentTitle}
          </p>
          {source.page > 0 && (
            <span className="text-[10px] text-zinc-600">p. {source.page}</span>
          )}
          {source.score > 0 && (
            <span className="ml-auto text-[10px] text-emerald-500/70">
              {Math.round(source.score * 100)}% match
            </span>
          )}
        </div>
        <div className="mt-1 flex items-start gap-1.5">
          <Quote className="mt-0.5 h-3 w-3 shrink-0 text-zinc-700" />
          <p className="line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
            {source.snippet}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SourceCitation;
