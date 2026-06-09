"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getAdminStats, type AdminStats } from "@/features/admin/api";

const CARDS: Array<{ key: keyof AdminStats; label: string; icon: string; href?: string }> = [
  { key: "totalUsers", label: "Total Pengguna", icon: "👥", href: "/admin/users" },
  { key: "totalTemplates", label: "Formula Soal", icon: "🧮", href: "/admin/formulas" },
  { key: "activeTemplates", label: "Formula Aktif", icon: "✅", href: "/admin/formulas" },
  { key: "totalThemes", label: "Tema", icon: "🏷️", href: "/admin/themes" },
  { key: "totalMatches", label: "Total Match", icon: "⚔️" },
  { key: "rankedMatches", label: "Match Ranked", icon: "🏆" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan data aplikasi SIKMA.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {CARDS.map((c) => {
          const value = loading ? "…" : (stats?.[c.key] ?? 0);
          const inner = (
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-3xl font-extrabold">{value}</span>
              <span className="text-sm font-bold text-muted-foreground">{c.label}</span>
            </div>
          );
          return c.href ? (
            <Link key={c.key} href={c.href}>{inner}</Link>
          ) : (
            <div key={c.key}>{inner}</div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuickLink href="/admin/formulas" icon="🧮" title="Kelola Formula Soal" desc="Tambah & ubah rumus soal matematika" />
        <QuickLink href="/admin/themes" icon="🏷️" title="Kelola Tema" desc="Kelompokkan soal ke dalam topik" />
        <QuickLink href="/admin/users" icon="👥" title="Kelola Pengguna" desc="Atur poin, peran, dan akses pengguna" />
        <QuickLink href="/admin/settings" icon="⚙️" title="Pengaturan Poin" desc="Atur EXP, poin rank, dan koin" />
      </div>
    </div>
  );
}

function QuickLink({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-brand">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-2xl">{icon}</span>
      <div>
        <p className="font-extrabold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
