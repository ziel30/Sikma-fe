"use client";

import { useEffect, useState } from "react";

import {
  deleteUser,
  listUsers,
  updateUser,
  type AdminUser,
  type UpdateUserPayload,
} from "@/features/admin/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/dialog";

const ROLE_LABEL: Record<number, string> = { 0: "User", 1: "Admin", 2: "Super Admin" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  async function load(searchValue = search) {
    setLoading(true);
    try {
      const res = await listUsers({ search: searchValue || undefined, limit: 50 });
      setUsers(res.data);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(u: AdminUser) {
    if (!confirm(`Hapus pengguna "${u.name}"?`)) return;
    await deleteUser(u.id);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Pengguna</h1>
          <p className="text-sm text-muted-foreground">{total} pengguna terdaftar</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); load(); }}
          className="flex gap-2"
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / email…"
            className="w-56"
          />
          <Button type="submit" variant="outline">Cari</Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Peran</th>
                <th className="px-4 py-3 text-right">EXP</th>
                <th className="px-4 py-3 text-right">Poin Rank</th>
                <th className="px-4 py-3 text-right">Koin</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground animate-pulse">Memuat…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Tidak ada pengguna</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <p className="font-bold">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={u.roles >= 1 ? "font-bold text-brand" : ""}>{ROLE_LABEL[u.roles] ?? u.roles}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{u.xp}</td>
                    <td className="px-4 py-3 text-right font-mono">{u.rankPoints}</td>
                    <td className="px-4 py-3 text-right font-mono">{u.coins}</td>
                    <td className="px-4 py-3">
                      {u.isBanned ? (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">Diblokir</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">Aktif</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditing(u)}>Edit</Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(u)}>Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditUserDialog
        user={editing}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); }}
      />
    </div>
  );
}

function EditUserDialog({ user, onClose, onSaved }: {
  user: AdminUser | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<UpdateUserPayload>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, roles: user.roles, xp: user.xp, coins: user.coins, rankPoints: user.rankPoints, isBanned: user.isBanned });
      setError(null);
    }
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await updateUser(user.id, form);
      onSaved();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(user)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        {user && (
          <div className="flex flex-col gap-4">
            <DialogTitle>Edit {user.name}</DialogTitle>

            <Field label="Nama">
              <Input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>

            <Field label="Peran">
              <select
                value={form.roles ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, roles: Number(e.target.value) }))}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value={0}>User</option>
                <option value={1}>Admin</option>
                <option value={2}>Super Admin</option>
              </select>
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="EXP">
                <Input type="number" value={form.xp ?? 0} onChange={(e) => setForm((f) => ({ ...f, xp: Number(e.target.value) }))} />
              </Field>
              <Field label="Poin Rank">
                <Input type="number" value={form.rankPoints ?? 0} onChange={(e) => setForm((f) => ({ ...f, rankPoints: Number(e.target.value) }))} />
              </Field>
              <Field label="Koin">
                <Input type="number" value={form.coins ?? 0} onChange={(e) => setForm((f) => ({ ...f, coins: Number(e.target.value) }))} />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.isBanned ?? false}
                onChange={(e) => setForm((f) => ({ ...f, isBanned: e.target.checked }))}
                className="size-4"
              />
              Blokir pengguna ini
            </label>

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
