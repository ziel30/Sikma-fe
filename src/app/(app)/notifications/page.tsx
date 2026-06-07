"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Icons } from "@/shared/components/brand/icons";
import {
  NOTIFICATIONS,
  type AppNotification,
  type NotifType,
} from "@/features/notifications/types";
import { cn } from "@/lib/utils";

const META: Record<NotifType, { icon: (typeof Icons)["bell"]; color: string }> = {
  achievement: { icon: Icons.medal, color: "bg-amber-400" },
  friend: { icon: Icons.addFriend, color: "bg-brand" },
  lesson: { icon: Icons.star, color: "bg-pink-400" },
  leaderboard: { icon: Icons.trophy, color: "bg-amber-500" },
  system: { icon: Icons.bell, color: "bg-sky-400" },
  shop: { icon: Icons.shop, color: "bg-violet-400" },
};

const TABS = ["Semua", "Belum dibaca"] as const;

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>(NOTIFICATIONS);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");

  const unread = items.filter((n) => !n.read).length;
  const visible = useMemo(
    () => (tab === "Belum dibaca" ? items.filter((n) => !n.read) : items),
    [items, tab]
  );

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10">
      <header className="grid grid-cols-[auto_1fr_auto] items-center py-4">
        <button onClick={() => router.back()} aria-label="Kembali" className="text-foreground">
          <Icons.back size={26} weight="bold" />
        </button>
        <h1 className="text-center text-lg font-extrabold">Notifikasi</h1>
        <button
          onClick={markAllRead}
          disabled={unread === 0}
          className={cn(
            "justify-self-end text-sm font-bold transition-colors",
            unread > 0 ? "text-brand" : "text-muted-foreground/50"
          )}
        >
          Tandai dibaca
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-4 flex rounded-full bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition-colors",
              t === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            {t}
            {t === "Belum dibaca" && unread > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-extrabold text-white">
                {unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
          <Icons.bell size={48} weight="fill" className="opacity-30" />
          <p>Tidak ada notifikasi</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((n) => (
            <NotificationRow key={n.id} notif={n} onRead={() => markRead(n.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NotificationRow({
  notif,
  onRead,
}: {
  notif: AppNotification;
  onRead: () => void;
}) {
  const meta = META[notif.type];
  const Icon = meta.icon;
  return (
    <li>
      <button
        onClick={onRead}
        className={cn(
          "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors",
          notif.read ? "bg-card ring-1 ring-foreground/10" : "bg-brand-soft"
        )}
      >
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full text-white",
            meta.color
          )}
        >
          <Icon size={20} weight="fill" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="flex-1 truncate font-bold">{notif.title}</p>
            {!notif.read && <span className="size-2 shrink-0 rounded-full bg-brand" />}
          </div>
          <p className="text-sm text-muted-foreground">{notif.body}</p>
          <p className="mt-1 text-xs text-muted-foreground/70">{notif.time}</p>
        </div>
      </button>
    </li>
  );
}
