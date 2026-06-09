"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  listThemes,
  previewTemplate,
  updateTemplate,
  type AdminTemplate,
  type AdminTheme,
  type TemplatePayload,
} from "@/features/admin/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";

interface FormState {
  topic: string;
  themeId: number | null;
  difficulty: number;
  displayTemplate: string;
  answerFormula: string;
  constraintsText: string;
  derivedText: string;
  isActive: boolean;
}

const BLANK: FormState = {
  topic: "umum",
  themeId: null,
  difficulty: 1,
  displayTemplate: "{a} + {b} = ?",
  answerFormula: "a + b",
  constraintsText: '{\n  "a": [1, 10],\n  "b": [1, 10]\n}',
  derivedText: "",
  isActive: true,
};

export default function AdminFormulasPage() {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [themes, setThemes] = useState<AdminTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTheme, setFilterTheme] = useState<number | "all">("all");
  const [editing, setEditing] = useState<{ id: string | null; data: FormState } | null>(null);

  function load() {
    setLoading(true);
    Promise.all([listTemplates(), listThemes()])
      .then(([tpls, ths]) => { setTemplates(tpls); setThemes(ths); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  const filtered = useMemo(
    () => (filterTheme === "all" ? templates : templates.filter((t) => Number(t.themeId) === filterTheme)),
    [templates, filterTheme],
  );

  function toFormState(t: AdminTemplate): FormState {
    return {
      topic: t.topic,
      themeId: t.themeId,
      difficulty: t.difficulty,
      displayTemplate: t.displayTemplate,
      answerFormula: t.answerFormula,
      constraintsText: JSON.stringify(t.constraints, null, 2),
      derivedText: t.derived ? JSON.stringify(t.derived, null, 2) : "",
      isActive: t.isActive,
    };
  }

  async function handleDelete(t: AdminTemplate) {
    if (!confirm(`Hapus formula "${t.displayTemplate}"?`)) return;
    await deleteTemplate(t.id);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Formula Soal</h1>
          <p className="text-sm text-muted-foreground">{templates.length} formula • soal dibuat acak dari rumus ini</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">Semua Tema</option>
            {themes.map((t) => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
          </select>
          <Button onClick={() => setEditing({ id: null, data: { ...BLANK } })}>+ Formula Baru</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Soal</th>
                <th className="px-4 py-3">Tema</th>
                <th className="px-4 py-3 text-center">Level</th>
                <th className="px-4 py-3">Formula</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground animate-pulse">Memuat…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Belum ada formula</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono font-bold">{t.displayTemplate}</td>
                    <td className="px-4 py-3">{t.theme ? <span>{t.theme.emoji} {t.theme.name}</span> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-4 py-3 text-center">{t.difficulty}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.answerFormula}</td>
                    <td className="px-4 py-3 text-center">
                      {t.isActive ? <span className="text-green-600">●</span> : <span className="text-muted-foreground">○</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditing({ id: t.id, data: toFormState(t) })}>Edit</Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(t)}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FormulaDialog
        state={editing}
        themes={themes}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); }}
      />
    </div>
  );
}

function FormulaDialog({ state, themes, onClose, onSaved }: {
  state: { id: string | null; data: FormState } | null;
  themes: AdminTheme[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ question: string; answer: number } | null>(null);

  useEffect(() => { if (state) { setForm(state.data); setError(null); setPreview(null); } }, [state]);

  function buildPayload(): TemplatePayload {
    const constraints = JSON.parse(form.constraintsText || "{}");
    const derived = form.derivedText.trim() ? JSON.parse(form.derivedText) : null;
    return {
      topic: form.topic,
      themeId: form.themeId,
      difficulty: form.difficulty,
      displayTemplate: form.displayTemplate,
      answerFormula: form.answerFormula,
      constraints,
      derived,
      isActive: form.isActive,
    };
  }

  async function handlePreview() {
    setError(null); setPreview(null);
    try {
      const res = await previewTemplate(buildPayload());
      setPreview({ question: res.question, answer: res.answer });
    } catch (e: any) {
      setError(jsonOrApiError(e));
    }
  }

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const payload = buildPayload();
      if (state?.id) await updateTemplate(state.id, payload);
      else await createTemplate(payload);
      onSaved();
    } catch (e: any) {
      setError(jsonOrApiError(e));
    } finally { setSaving(false); }
  }

  return (
    <Dialog open={Boolean(state)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        {state && (
          <div className="flex flex-col gap-4">
            <DialogTitle>{state.id ? "Edit Formula" : "Formula Baru"}</DialogTitle>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">Teks Soal (pakai {"{var}"})</span>
              <Input value={form.displayTemplate} onChange={(e) => setForm((f) => ({ ...f, displayTemplate: e.target.value }))} className="font-mono" placeholder="{a} + {b} = ?" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">Formula Jawaban</span>
              <Input value={form.answerFormula} onChange={(e) => setForm((f) => ({ ...f, answerFormula: e.target.value }))} className="font-mono" placeholder="a + b" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">Tema</span>
                <select
                  value={form.themeId ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, themeId: e.target.value ? Number(e.target.value) : null }))}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">— Tanpa tema —</option>
                  {themes.map((t) => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">Level (1-5)</span>
                <Input type="number" min={1} max={5} value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: Number(e.target.value) }))} />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">Constraints — {`{ "var": [min, max] }`}</span>
              <Textarea value={form.constraintsText} onChange={(e) => setForm((f) => ({ ...f, constraintsText: e.target.value }))} rows={4} className="font-mono text-xs" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-muted-foreground">Derived (opsional) — {`{ "var": "rumus" }`}</span>
              <Textarea value={form.derivedText} onChange={(e) => setForm((f) => ({ ...f, derivedText: e.target.value }))} rows={2} className="font-mono text-xs" placeholder='kosongkan jika tidak ada' />
            </label>

            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="size-4" />
              Aktif (dipakai di soal)
            </label>

            {preview && (
              <div className="rounded-xl bg-brand/10 px-4 py-3">
                <p className="text-xs font-bold text-muted-foreground">Contoh soal:</p>
                <p className="font-mono font-extrabold">{preview.question}</p>
                <p className="text-sm">Jawaban: <span className="font-bold text-brand">{preview.answer}</span></p>
              </div>
            )}

            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={handlePreview}>👁 Preview</Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose}>Batal</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function jsonOrApiError(e: any): string {
  if (e instanceof SyntaxError) return "Format JSON tidak valid pada Constraints/Derived";
  return e?.response?.data?.message ?? "Gagal menyimpan";
}
