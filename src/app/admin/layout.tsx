"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearSession, isAdmin } from "@/features/auth/lib/session-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/users", label: "Pengguna", icon: "👥" },
  { href: "/admin/formulas", label: "Formula Soal", icon: "🧮" },
  { href: "/admin/themes", label: "Tema", icon: "🏷️" },
  { href: "/admin/settings", label: "Pengaturan Poin", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted">
        <p className="animate-pulse font-bold text-muted-foreground">Memeriksa akses…</p>
      </div>
    );
  }

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-muted text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card p-4 md:flex">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="grid size-9 place-items-center rounded-xl bg-brand text-lg font-black text-white">S</span>
          <div>
            <p className="font-extrabold leading-tight">SIKMA</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                  active ? "bg-brand text-white" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
          <Link href="/learn" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted">
            <span className="text-base">🎮</span> Buka App
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-destructive hover:bg-destructive/10"
          >
            <span className="text-base">🚪</span> Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex w-full flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <span className="font-extrabold">SIKMA Admin</span>
          <button onClick={handleLogout} className="text-sm font-bold text-destructive">Keluar</button>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold",
                  active ? "bg-brand text-white" : "text-muted-foreground",
                )}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
