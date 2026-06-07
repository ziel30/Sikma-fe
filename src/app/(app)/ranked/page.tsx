"use client";

import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { cn } from "@/lib/utils";

// Placeholder data — replace with real API data.
const TOP_PLAYERS = [
  { rank: 1, name: "Frieren", points: 102800, emoji: "🧙" },
  { rank: 2, name: "Yuu", points: 82800, emoji: "🦊" },
  { rank: 3, name: "Zaco", points: 57200, emoji: "🐺" },
];

const CURRENT_USER = {
  rank: 179,
  name: "Aziz Penjinak...",
  points: 7223,
  avatar: "/Asset/profile/profile1.svg",
};

const PODIUM_STYLES = {
  1: {
    order: "order-2",
    height: "h-28",
    ring: "ring-4 ring-amber-400",
    bg: "bg-amber-400",
    badge: "bg-amber-500",
    avatarSize: "size-20",
    nameSize: "text-sm",
  },
  2: {
    order: "order-3",
    height: "h-20",
    ring: "ring-4 ring-slate-300",
    bg: "bg-slate-200",
    badge: "bg-slate-400",
    avatarSize: "size-16",
    nameSize: "text-xs",
  },
  3: {
    order: "order-1",
    height: "h-16",
    ring: "ring-4 ring-orange-300",
    bg: "bg-orange-100",
    badge: "bg-orange-400",
    avatarSize: "size-16",
    nameSize: "text-xs",
  },
} as const;

export default function RankedPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
      {/* Warm gradient header */}
      <header className="relative overflow-hidden rounded-b-[36px] bg-linear-to-br from-amber-300 to-amber-500 px-5 pt-5 pb-10 text-white">
        {/* Back button */}
        <Link href="/learn" aria-label="Kembali" className="inline-flex">
          <Icons.back size={26} weight="bold" />
        </Link>

        <h1 className="mt-3 text-center text-2xl font-extrabold">Juara Liga</h1>

        {/* Podium */}
        <div className="mt-6 flex items-end justify-center gap-3">
          {TOP_PLAYERS.map((p) => {
            const s = PODIUM_STYLES[p.rank as 1 | 2 | 3];
            return (
              <div key={p.rank} className={cn("flex flex-col items-center gap-1", s.order)}>
                {/* Rank badge above avatar */}
                <span className={cn("grid size-6 place-items-center rounded-full text-xs font-black text-white", s.badge)}>
                  {p.rank}
                </span>

                {/* Avatar */}
                <div className={cn("grid place-items-center rounded-full bg-white text-3xl", s.avatarSize, s.ring)}>
                  {p.emoji}
                </div>

                {/* Name */}
                <p className={cn("font-extrabold text-white drop-shadow", s.nameSize)}>{p.name}</p>

                {/* Podium block */}
                <div className={cn("w-24 rounded-t-xl", s.height, s.bg)} />
              </div>
            );
          })}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-5 pt-6">
        {/* Current user rank row */}
        <div className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
          <span className="text-lg font-black text-muted-foreground w-8 text-center">
            {CURRENT_USER.rank}
          </span>
          <Image
            src={CURRENT_USER.avatar}
            alt="Avatar kamu"
            width={40}
            height={40}
            className="size-10 rounded-full bg-brand-soft ring-2 ring-brand"
          />
          <p className="flex-1 truncate font-extrabold">{CURRENT_USER.name}</p>
          <p className="font-extrabold text-brand">
            {CURRENT_USER.points.toLocaleString("id-ID")} Poin
          </p>
        </div>

        {/* Motivational copy */}
        <p className="text-center text-sm font-bold text-muted-foreground leading-relaxed px-4">
          "Jawab soal secepatnya dapatkan point terbanyak dan jadilah juara liga !!"
        </p>

        {/* Start button */}
        <PrimaryButton asChild>
          <Link href="/battle?mode=ranked">Mulai</Link>
        </PrimaryButton>

        {/* Can't-exit warning */}
        <p className="text-center text-xs text-muted-foreground italic">
          "Ingat di test ini kamu ga bisa keluar sebelum selesai"
        </p>
      </main>
    </div>
  );
}
