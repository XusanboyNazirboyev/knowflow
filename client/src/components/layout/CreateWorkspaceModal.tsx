import React, { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useWorkspace } from "../../store/workspaceContext";
import { slugify } from "../../lib/utils";

interface Props {
  onClose?: () => void;
}

export const CreateWorkspaceModal: React.FC<Props> = ({ onClose }) => {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setError("");
    setIsSubmitting(true);
    try {
      await createWorkspace(name.trim(), slugify(name.trim()));
      onClose?.();
    } catch (err) {
      setError("Workspace yaratishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">
          Yangi workspace yaratish
        </h2>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <label className="mb-1.5 block text-xs font-medium text-zinc-400">
          Workspace nomi
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mening jamoam"
          autoFocus
        />

        <div className="mt-5 flex justify-end gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Bekor qilish
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!name.trim()}
          >
            Yaratish
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateWorkspaceModal;