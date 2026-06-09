"use client";

import { useEffect, useState } from "react";

import {
  createTheme,
  deleteTheme,
  listThemes,
  updateTheme,
  type AdminTheme,
  type ThemePayload,
} from "@/features/admin/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/lib/utils";

const COLORS = [
  "bg-brand-soft", "bg-emerald-100", "bg-sky-100", "bg-amber-100",
  "bg-rose-100", "bg-violet-100", "bg-indigo-100", "bg-pink-100",
];

const EMPTY: ThemePayload = { name: "", emoji: "📘", color: "bg-brand-soft", description: "", isActive: true, sortOrder: 0 };

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<AdminTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id: string | null; data: ThemePayload } | null>(null);

  function load() {
    setLoading(true);
    listThemes().then(setThemes).catch(console.error).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleDelete(t: AdminTheme) {
    if (!confirm(`Hapus tema "${t.name}"? Soal di dalamnya tidak dihapus, hanya kehilangan tema.`)) return;
    await deleteTheme(t.id);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Tema</h1>
          <p className="text-sm text-muted-foreground">Topik untuk mengelompokkan formula soal</p>
        </div>
        <Button onClick={() => setEditing({ id: null, data: { ...EMPTY } })}>+ Tema Baru</Button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-muted-foreground animate-pulse">Memuat…</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((t) => (
            <div key={t.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <span className={cn("grid size-12 place-items-center rounded-xl text-2xl", t.color)}>{t.emoji}</span>
                {!t.isActive && <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">Nonaktif</span>}
              </div>
              <div>
                <p className="font-extrabold">{t.name}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{t.description || "Tanpa deskripsi"}</p>
              </div>
              <p className="text-xs font-bold text-muted-foreground">{t.templateCount ?? 0} formula soal</p>
              <div className="mt-auto flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditing({ id: t.id, data: { name: t.name, slug: t.slug, emoji: t.emoji, color: t.color, description: t.description ?? "", isActive: t.isActive, sortOrder: t.sortOrder } })}>Edit</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(t)}>Hapus</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ThemeDialog
        state={editing}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); }}
      />
    </div>
  );
}

function ThemeDialog({ state, onClose, onSaved }: {
  state: { id: string | null; data: ThemePayload } | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<ThemePayload>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (state) { setForm(state.data); setError(null); } }, [state]);

  async function handleSave() {
    if (!form.name?.trim()) { setError("Nama tema wajib diisi"); return; }
    setSaving(true); setError(null);
    try {
      if (state?.id) await updateTheme(state.id, form);
      else await createTheme(form);
      onSaved();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menyimpan");
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={Boolean(state)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        {state && (
          <div className="flex flex-col gap-4">
            <DialogTitle>{state.id ? "Edit Tema" : "Tema Baru"}</DialogTitle>

            <div className="grid grid-cols-[auto_1fr] gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">Emoji</span>
                <Input value={form.emoji ?? ""} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} className="w-16 text-center text-xl" maxLength={4} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">Nama</span>
                <Input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Penjumlahan" />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">Deskripsi</span>
              <Input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Soal penjumlahan dasar" />
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">Warna</span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: c }))}
                    className={cn("size-9 rounded-lg ring-2", c, form.color === c ? "ring-brand" : "ring-transparent")}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">Urutan</span>
                <Input type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
              </label>
              <label className="flex items-end gap-2 pb-2 text-sm font-bold">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="size-4" />
                Aktif
              </label>
            </div>

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Batal</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
