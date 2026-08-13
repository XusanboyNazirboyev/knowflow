/**
 * Documents — list, search, filter, upload.
 */
import React, { useState, useRef } from "react";
import {
  FileText,
  Search,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import {
  useDocuments,
  useUploadDocument,
  useDeleteDocument,
} from "../hooks/useDocuments";
import DocumentCard from "../components/layout/DocumentCard";
import EmptyState from "../components/layout/EmptyState";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { MAX_FILE_SIZE, DOCUMENT_TYPES } from "../lib/constants";

export const Documents: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useDocuments(
    search ? { search } : undefined
  );
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const docs = data?.items ?? [];

  const handleFile = async (file: File) => {
    setError("");
    if (file.size > MAX_FILE_SIZE) {
      setError("Fayl hajmi 20MB dan oshmasligi kerak");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!DOCUMENT_TYPES.includes(ext as (typeof DOCUMENT_TYPES)[number])) {
      setError(`${ext} format qo'llab-quvvatlanmaydi`);
      return;
    }
    setUploading(true);
    try {
      await uploadMutation.mutateAsync({ file, category: "" });
      setShowUpload(false);
    } catch {
      setError("Yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-zinc-100">
            Hujjatlar
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Knowledge base ga yuklangan hujjatlar
          </p>
        </div>
        <Button
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => setShowUpload(true)}
        >
          Yuklash
        </Button>
      </div>

      <div className="relative max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hujjat qidirish..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : docs.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc:any) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="h-7 w-7 text-zinc-600" />}
          title={search ? "Natija topilmadi" : "Hujjatlar yo'q"}
          description={
            search
              ? "Boshqa kalit so'z bilan urinib ko'ring"
              : "Birinchi hujjatingizni yuklang — AI uni avtomatik indekslaydi"
          }
          action={
            !search && (
              <Button
                leftIcon={<Upload className="h-4 w-4" />}
                onClick={() => setShowUpload(true)}
              >
                Yuklash
              </Button>
            )
          }
        />
      )}

      {/* Upload modal */}
      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => !uploading && setShowUpload(false)}
        >
          <Card
            className="w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-100">
                Hujjat yuklash
              </h2>
              <button
                onClick={() => !uploading && setShowUpload(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-colors ${dragOver
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-zinc-700 bg-zinc-900/30"
                } ${uploading ? "pointer-events-none" : "cursor-pointer"}`}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                  <p className="mt-3 text-sm text-zinc-400">
                    Yuklanmoqda va indekslanmoqda...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-zinc-500" />
                  <p className="mt-3 text-sm text-zinc-300">
                    Faylni shu yerga tashlang
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    PDF, TXT, MD — max 20MB
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.txt,.md"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Documents;
