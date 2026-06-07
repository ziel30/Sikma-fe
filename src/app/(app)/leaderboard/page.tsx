"use client";

import Link from "next/link";

import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { Icons } from "@/shared/components/brand/icons";
import {
  BOARDS,
  CURRENT_USER,
  type RankEntry,
} from "@/features/leaderboard/types";
import { cn } from "@/lib/utils";

const id = (n: number) => n.toLocaleString("id-ID");

const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

// Per-rank podium styling: a gradient that blends into the page background,
// plus the avatar ring and badge colours.
const PLACES = {
  1: {
    gradient: "from-amber-200",
    ring: "ring-amber-400",
    badge: "bg-amber-400",
  },
  2: {
    gradient: "from-slate-200",
    ring: "ring-slate-300",
    badge: "bg-slate-400",
  },
  3: {
    gradient: "from-orange-200",
    ring: "ring-orange-300",
    badge: "bg-orange-400",
  },
} as const;

export default function LeaderboardPage() {
  const board = BOARDS[0];
  const [first, second, third] = board.entries;
  const rest = board.entries.slice(3);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-28">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-b-[36px] bg-linear-to-br from-amber-300 to-amber-500 px-5 pt-5 pb-8 text-white">
        <div className="flex items-center justify-between">
          <Link href="/learn" aria-label="Kembali">
            <Icons.back size={26} weight="bold" />
          </Link>
          <Link href="#" aria-label="Info">
            <Icons.info size={24} weight="fill" />
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Icons.trophy
            size={44}
            weight="fill"
            className="text-white drop-shadow"
          />
          <div>
            <p className="text-sm font-bold tracking-widest text-white/80">
              TOP 100
            </p>
            <h1 className="text-2xl font-extrabold">Papan Peringkat</h1>
          </div>
          <Icons.sparkle
            size={22}
            weight="fill"
            className="ml-auto text-white/90"
          />
        </div>
      </header>

      <main className="flex flex-col gap-5 px-4 pt-6">
        {/* Podium with decorative halo + sparkles */}
        <section className="relative">
          <div className="relative grid grid-cols-3 items-end gap-2">
            <PodiumSpot entry={second} rank={2} unit={board.unit} />
            <PodiumSpot entry={first} rank={1} unit={board.unit} elevated />
            <PodiumSpot entry={third} rank={3} unit={board.unit} />
          </div>
        </section>

        {/* Remaining ranks */}
        <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
          {rest.map((entry, i) => (
            <RankRow
              key={entry.id}
              rank={i + 4}
              entry={entry}
              unit={board.unit}
            />
          ))}
        </div>
      </main>

      {/* Current user */}
      <div className="sticky bottom-20 z-30 mx-4 mt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-brand px-4 py-3 text-white shadow-lg">
          <span className="w-8 text-center text-xs font-bold text-white/70">
            {CURRENT_USER.rank ?? "—"}
          </span>
          <EmojiAvatar
            emoji={CURRENT_USER.emoji}
            bg={CURRENT_USER.bg}
            className="size-10 text-xl"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-extrabold">{CURRENT_USER.name}</p>
            <p className="text-xs text-white/70">Belum masuk peringkat</p>
          </div>
          <Link
            href="/learn"
            className="rounded-xl bg-accent-yellow px-4 py-2 text-sm font-extrabold text-zinc-900"
          >
            Naik Peringkat
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function PodiumSpot({
  entry,
  rank,
  unit,
  elevated,
}: {
  entry: RankEntry;
  rank: 1 | 2 | 3;
  unit: string;
  elevated?: boolean;
}) {
  const place = PLACES[rank];
  return (
    <div
      className={cn(
        "relative flex flex-col items-center rounded-t-3xl bg-linear-to-b to-transparent px-2 pt-7 pb-6 text-center",
        place.gradient,
        elevated ? "min-h-56" : "mt-8 min-h-44",
      )}
    >
      <div className="relative">
        {rank === 1 && (
          <Icons.crown
            size={26}
            weight="fill"
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow"
          />
        )}
        <EmojiAvatar
          emoji={entry.emoji}
          bg={entry.bg}
          className={cn(
            "text-3xl ring-4",
            place.ring,
            elevated ? "size-20" : "size-16",
          )}
        />
        <span
          style={{ clipPath: HEX_CLIP }}
          className={cn(
            "absolute -bottom-2 left-1/2 grid size-7 -translate-x-1/2 place-items-center text-xs font-black text-white",
            place.badge,
          )}
        >
          {rank}
        </span>
      </div>
      <p className="mt-4 line-clamp-1 text-sm font-extrabold">{entry.name}</p>
      <p className="text-xs text-muted-foreground">{entry.meta}</p>
      <p className="mt-1 font-extrabold text-amber-600">
        {id(entry.score)} <span className="text-xs">{unit}</span>
      </p>
    </div>
  );
}

/** Radial halo, concentric mandala rings, and twinkling sparkles behind the podium. */
function PodiumDecor() {
  const sparkles = [
    "left-2 top-10 text-amber-300 [animation-delay:0ms]",
    "right-4 top-4 text-amber-400 [animation-delay:300ms]",
    "left-1/2 top-0 text-amber-300 [animation-delay:600ms]",
    "right-8 bottom-10 text-amber-300 [animation-delay:150ms]",
    "left-6 bottom-6 text-amber-400 [animation-delay:450ms]",
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* warm glow */}
      <div className="absolute top-0 left-1/2 size-60 -translate-x-1/2 rounded-full bg-amber-300/40 blur-3xl" />
      {/* mandala rings */}
      <div className="absolute top-2 left-1/2 size-56 -translate-x-1/2 rounded-full border border-amber-300/30" />
      <div className="absolute top-8 left-1/2 size-44 -translate-x-1/2 rounded-full border border-amber-300/20" />
      {/* sparkles */}
      {sparkles.map((s, i) => (
        <Icons.sparkle
          key={i}
          size={i % 2 ? 14 : 18}
          weight="fill"
          className={cn("absolute animate-pulse", s)}
        />
      ))}
    </div>
  );
}

function RankRow({
  rank,
  entry,
  unit,
}: {
  rank: number;
  entry: RankEntry;
  unit: string;
}) {
  return (
    <Link
      href="#"
      className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
    >
      <span className="w-6 text-center text-base font-extrabold text-muted-foreground italic">
        {rank}
      </span>
      <EmojiAvatar
        emoji={entry.emoji}
        bg={entry.bg}
        className="size-11 text-xl"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold">{entry.name}</p>
        <p className="text-xs text-muted-foreground">{entry.meta}</p>
      </div>
      <span className="font-extrabold text-amber-600">
        {id(entry.score)}{" "}
        <span className="text-xs font-bold text-muted-foreground">{unit}</span>
      </span>
      <Icons.arrow size={18} weight="bold" className="text-muted-foreground" />
    </Link>
  );
}
