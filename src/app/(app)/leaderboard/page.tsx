"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { Icons } from "@/shared/components/brand/icons";
import { getLeaderboard, type LeaderboardEntry, type MyLeaderboardEntry } from "@/features/leaderboard/api";
import { cn } from "@/lib/utils";

const id = (n: number) => n.toLocaleString("id-ID");

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const PLACES = {
  1: { gradient: "from-amber-200", ring: "ring-amber-400", badge: "bg-amber-400" },
  2: { gradient: "from-slate-200", ring: "ring-slate-300", badge: "bg-slate-400" },
  3: { gradient: "from-orange-200", ring: "ring-orange-300", badge: "bg-orange-400" },
} as const;

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<MyLeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(({ entries, myEntry }) => {
        setEntries(entries);
        setMyEntry(myEntry);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const [first, second, third] = entries;
  const rest = entries.slice(3);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-28">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-b-[36px] bg-linear-to-br from-amber-300 to-amber-500 px-5 pt-5 pb-8 text-white">
        <div className="flex items-center justify-between">
          <Link href="/learn" aria-label="Kembali"><Icons.back size={26} weight="bold" /></Link>
          <Link href="#" aria-label="Info"><Icons.info size={24} weight="fill" /></Link>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Icons.trophy size={44} weight="fill" className="text-white drop-shadow" />
          <div>
            <p className="text-sm font-bold tracking-widest text-white/80">TOP 100</p>
            <h1 className="text-2xl font-extrabold">Papan Peringkat</h1>
          </div>
          <Icons.sparkle size={22} weight="fill" className="ml-auto text-white/90" />
        </div>
      </header>

      <main className="flex flex-col gap-5 px-4 pt-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-bold text-muted-foreground animate-pulse">Memuat peringkat...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">🏆</span>
            <p className="font-extrabold text-lg">Belum ada pemain</p>
            <p className="text-sm text-muted-foreground">Mainkan pertandingan untuk masuk peringkat!</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {first && second && third && (
              <section>
                <div className="relative grid grid-cols-3 items-end gap-2">
                  <PodiumSpot entry={second} rank={2} />
                  <PodiumSpot entry={first} rank={1} elevated />
                  <PodiumSpot entry={third} rank={3} />
                </div>
              </section>
            )}

            {/* Remaining ranks */}
            {rest.length > 0 && (
              <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
                {rest.map((entry) => (
                  <RankRow key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Current user sticky bar */}
      <div className="sticky bottom-20 z-30 mx-4 mt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-brand px-4 py-3 text-white shadow-lg">
          <span className="w-8 text-center text-xs font-bold text-white/70">
            {myEntry?.rank ?? "—"}
          </span>
          <EmojiAvatar
            emoji={myEntry?.emoji ?? "🦝"}
            bg={myEntry?.bg ?? "bg-brand-soft"}
            className="size-10 text-xl"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold">{myEntry?.name ?? "Kamu"}</p>
            <p className="text-xs text-white/70">
              {myEntry?.rank ? `Peringkat #${myEntry.rank}` : "Belum masuk peringkat"}
            </p>
          </div>
          {!myEntry?.rank && (
            <Link href="/casual" className="rounded-xl bg-accent-yellow px-4 py-2 text-sm font-extrabold text-zinc-900">
              Naik Peringkat
            </Link>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function PodiumSpot({ entry, rank, elevated }: { entry: LeaderboardEntry; rank: 1 | 2 | 3; elevated?: boolean }) {
  const place = PLACES[rank];
  return (
    <div className={cn(
      "relative flex flex-col items-center rounded-t-3xl bg-linear-to-b to-transparent px-2 pt-7 pb-6 text-center",
      place.gradient,
      elevated ? "min-h-56" : "mt-8 min-h-44",
    )}>
      <div className="relative">
        {rank === 1 && (
          <Icons.crown size={26} weight="fill" className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow" />
        )}
        <EmojiAvatar emoji={entry.emoji} bg={entry.bg} className={cn("ring-4", place.ring, elevated ? "size-20 text-3xl" : "size-16 text-2xl")} />
        <span style={{ clipPath: HEX_CLIP }} className={cn("absolute -bottom-2 left-1/2 grid size-7 -translate-x-1/2 place-items-center text-xs font-black text-white", place.badge)}>
          {rank}
        </span>
      </div>
      <p className="mt-4 line-clamp-1 text-sm font-extrabold">{entry.name}</p>
      <p className="text-xs text-muted-foreground">{entry.meta}</p>
      <p className="mt-1 font-extrabold text-amber-600">{id(entry.score)} <span className="text-xs">XP</span></p>
    </div>
  );
}

function RankRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <span className="w-6 text-center text-base font-extrabold text-muted-foreground italic">{entry.rank}</span>
      <EmojiAvatar emoji={entry.emoji} bg={entry.bg} className="size-11 text-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold">{entry.name}</p>
        <p className="text-xs text-muted-foreground">{entry.meta}</p>
      </div>
      <span className="font-extrabold text-amber-600">
        {id(entry.score)} <span className="text-xs font-bold text-muted-foreground">XP</span>
      </span>
    </div>
  );
}
