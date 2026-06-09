"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getLeaderboard, type LeaderboardEntry, type MyLeaderboardEntry } from "@/features/leaderboard/api";
import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { cn } from "@/lib/utils";

const PODIUM_STYLES = {
  1: { order: "order-2", height: "h-28", ring: "ring-4 ring-amber-400", bg: "bg-amber-400", badge: "bg-amber-500", avatarSize: "size-20" },
  2: { order: "order-3", height: "h-20", ring: "ring-4 ring-slate-300", bg: "bg-slate-200", badge: "bg-slate-400", avatarSize: "size-16" },
  3: { order: "order-1", height: "h-16", ring: "ring-4 ring-orange-300", bg: "bg-orange-100", badge: "bg-orange-400", avatarSize: "size-16" },
} as const;

export default function RankedPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<MyLeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(({ entries, myEntry }) => { setEntries(entries); setMyEntry(myEntry); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [first, second, third] = entries;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
      {/* Amber gradient header */}
      <header className="relative overflow-hidden rounded-b-[36px] bg-linear-to-br from-amber-300 to-amber-500 px-5 pt-5 pb-10 text-white">
        <Link href="/learn" aria-label="Kembali" className="inline-flex">
          <Icons.back size={26} weight="bold" />
        </Link>

        <h1 className="mt-3 text-center text-2xl font-extrabold">Juara Liga</h1>

        {/* Podium */}
        {loading ? (
          <div className="mt-8 flex items-end justify-center gap-3">
            {[2, 1, 3].map((r) => (
              <div key={r} className="flex flex-col items-center gap-2">
                <div className="size-16 animate-pulse rounded-full bg-white/30" />
                <div className={cn("w-24 rounded-t-xl bg-white/20", r === 1 ? "h-28" : r === 2 ? "h-20" : "h-16")} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex items-end justify-center gap-3">
            {[second, first, third].filter(Boolean).map((p, i) => {
              const rank = (i === 0 ? 2 : i === 1 ? 1 : 3) as 1 | 2 | 3;
              return p ? <PodiumSpot key={p.id} entry={p} rank={rank} /> : null;
            })}
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-6">
        {/* Current user rank */}
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
          <span className="w-8 text-center text-lg font-black text-muted-foreground">
            {myEntry?.rank ?? "—"}
          </span>
          <EmojiAvatar
            emoji={myEntry?.emoji ?? "🦝"}
            bg={myEntry?.bg ?? "bg-brand-soft"}
            className="size-10 text-xl ring-2 ring-brand"
          />
          <p className="flex-1 truncate font-extrabold">{myEntry?.name ?? "Kamu"}</p>
          <p className="font-extrabold text-brand">
            {myEntry?.score?.toLocaleString("id-ID") ?? "0"} Poin
          </p>
        </div>

        <p className="text-center text-sm font-bold text-muted-foreground leading-relaxed px-4">
          "Jawab soal secepatnya dapatkan point terbanyak dan jadilah juara liga !!"
        </p>

        <PrimaryButton asChild>
          <Link href="/casual?mode=ranked">Mulai</Link>
        </PrimaryButton>

        <p className="text-center text-xs text-muted-foreground italic">
          "Ingat di test ini kamu ga bisa keluar sebelum selesai"
        </p>
      </main>
    </div>
  );
}

function PodiumSpot({ entry, rank }: { entry: LeaderboardEntry; rank: 1 | 2 | 3 }) {
  const s = PODIUM_STYLES[rank];
  return (
    <div className={cn("flex flex-col items-center gap-1", s.order)}>
      <span className={cn("grid size-6 place-items-center rounded-full text-xs font-black text-white", s.badge)}>
        {rank}
      </span>
      <EmojiAvatar emoji={entry.emoji} bg={entry.bg} className={cn("ring-4", s.ring, s.avatarSize, "text-3xl")} />
      <p className="max-w-[80px] truncate text-center text-xs font-extrabold text-white drop-shadow">
        {entry.name}
      </p>
      <div className={cn("w-24 rounded-t-xl", s.height, s.bg)} />
    </div>
  );
}
