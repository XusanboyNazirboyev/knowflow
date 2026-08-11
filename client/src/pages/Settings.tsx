/**
 * Settings — workspace, profile, notifications, danger zone.
 */
import React, { useState } from "react";
import { workspaceApi } from "../api/workspace.api";
import { useWorkspace } from "../store/workspaceContext";
import { useAuth } from "../store/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
// import { Spinner } from "../components/ui/Spinner";

type Tab = "workspace" | "profile" | "notifications" | "danger";

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-medium text-zinc-400">
      {label}
    </label>
    {children}
  </div>
);

export const Settings: React.FC = () => {
  const { activeWorkspace, refreshWorkspaces } = useWorkspace();
  const { user } = useAuth();
  // const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("workspace");
  const [name, setName] = useState(activeWorkspace?.name ?? "");
  const [description, setDescription] = useState(activeWorkspace?.description ?? "");
  const [accentColor, setAccentColor] = useState(activeWorkspace?.accentColor ?? "#F59E0B");
  const [notifEnabled, setNotifEnabled] = useState({
    docReady: true,
    memberJoined: true,
    mentions: true,
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      workspaceApi.update(activeWorkspace!.id, {
        name,
        description,
        accentColor,
      }),
    onSuccess: () => {
      refreshWorkspaces();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => workspaceApi.delete(activeWorkspace!.id),
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "workspace", label: "Workspace" },
    { key: "profile", label: "Profile" },
    { key: "notifications", label: "Notifications" },
    { key: "danger", label: "Danger Zone" },
  ];

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="font-display text-xl font-bold text-zinc-100">Sozlamalar</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          Workspace va hisobni boshqarish
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-sm transition-colors ${tab === t.key
                ? "text-amber-400"
                : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-amber-500" />
            )}
          </button>
        ))}
      </div>

      {tab === "workspace" && (
        <Card className="max-w-2xl space-y-5 p-6">
          <Field label="Workspace nomi">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Tavsif">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Workspace haqida..."
            />
          </Field>
          <Field label="Accent rang">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-10 w-16 rounded-lg border border-zinc-800 bg-transparent"
              />
              <span className="text-sm text-zinc-400">{accentColor}</span>
            </div>
          </Field>
          <Button
            isLoading={updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
            disabled={!name}
          >
            Saqlash
          </Button>
        </Card>
      )}

      {tab === "profile" && (
        <Card className="max-w-2xl space-y-5 p-6">
          <Field label="Ism">
            <Input
              value={user?.fullName ?? ""}
              placeholder="Ism Familiya"
              readOnly
            />
          </Field>
          <Field label="Email">
            <Input value={user?.email ?? ""} readOnly />
          </Field>
          <p className="text-xs text-zinc-500">
            Profile ma'lumotlari account sozlamalaridan boshqariladi.
          </p>
        </Card>
      )}

      {tab === "notifications" && (
        <Card className="max-w-2xl space-y-4 p-6">
          {[
            { key: "docReady", label: "Hujjat tayyor" },
            { key: "memberJoined", label: "Yangi a'zo qo'shildi" },
            { key: "mentions", label: "Mentionlar" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-zinc-300">{item.label}</span>
              <button
                onClick={() =>
                  setNotifEnabled((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${notifEnabled[item.key as keyof typeof notifEnabled]
                    ? "bg-amber-500"
                    : "bg-zinc-700"
                  }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${notifEnabled[item.key as keyof typeof notifEnabled]
                      ? "translate-x-5"
                      : "translate-x-0.5"
                    }`}
                />
              </button>
            </label>
          ))}
        </Card>
      )}

      {tab === "danger" && (
        <Card className="max-w-2xl space-y-4 border-red-500/20 p-6">
          <h3 className="text-sm font-semibold text-red-400">
            Xavfli zona
          </h3>
          <p className="text-sm text-zinc-500">
            Workspace ni o'chirish barcha hujjatlar, suhbatlar va a'zolarni
            butunlay o'chiradi. Bu amalni qaytarib bo'lmaydi.
          </p>
          <Button
            variant="destructive"
            isLoading={deleteMutation.isPending}
            onClick={() => {
              if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
                deleteMutation.mutate();
              }
            }}
          >
            Workspace ni o'chirish
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Settings;