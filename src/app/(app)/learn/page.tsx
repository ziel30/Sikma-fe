"use client";

import Image from "next/image";
import Link from "next/link";

import { EmmaExcited, EmmaRaiseHand } from "@/shared/components/brand/emma";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Icons } from "@/shared/components/brand/icons";
import { NOTIFICATIONS } from "@/features/notifications/types";
import { cn } from "@/lib/utils";

// Placeholder data — swap for real user/progress once a backend exists.
const user = {
  name: "Aziz Penjinak Naga",
  title: "Master Angka",
  level: 20,
  levelProgress: 70,
  coins: 200000,
  strike: 1,
  gems: 179,
};

const recentMateri = [
  { title: "Postulat", tone: "yellow" as const, slug: "postulat" },
  { title: "Aritmetika 2", tone: "pink" as const, slug: "aritmetika-2" },
];

export default function HomePage() {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pt-5 pb-28">
      <ProfileHeader />

      {/* Hero call-to-action */}
      <section className="relative min-h-44 overflow-hidden rounded-[28px] bg-brand p-5 text-white">
        <HeroGlyphs />
        <div className="relative z-20 max-w-[55%]">
          <p className="text-xl leading-snug font-extrabold">
            Hi {firstName}
            <br />
            Yuk Latihan biar makin Sigma !
          </p>
          <Link
            href="/courses"
            className="mt-5 inline-block rounded-2xl bg-amber-400 px-7 py-2.5 font-extrabold text-white shadow-[0_4px_0_0_var(--color-amber-500)] active:translate-y-0.5 active:shadow-none"
          >
            Mulai
          </Link>
        </div>
        {/* Mascot with a yellow spotlight behind it */}
        <div className="absolute right-1 -bottom-1 z-10 flex h-full items-end">
          <div className="absolute right-4 bottom-4 size-36 rounded-full bg-accent-yellow" />
          <EmmaExcited className="relative w-48" />
        </div>
      </section>

      {/* Stats + Forum */}
      <section className="grid grid-cols-[1fr_1.25fr] items-stretch gap-3">
        <div className="flex flex-col gap-3">
          {/* Strike */}
          <div className="relative flex items-center gap-1 overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-100 p-2.5">
            <div className="leading-none">
              <p className="text-2xl font-black text-zinc-900">{user.strike}</p>
              <p className="text-xs font-bold text-zinc-700">Strike</p>
            </div>
            <span className="absolute top-0 right-7 size-2.5 rounded-full bg-brand" />
            <div className="absolute -bottom-3 -right-2">
              <EmmaRaiseHand className="ml-auto w-16" />
            </div>
          </div>
          {/* Gems */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-accent-yellow p-4">
            <p className="text-3xl font-black text-zinc-900">{user.gems}</p>
            <span className="absolute -bottom-3 left-2 size-9 rounded-full bg-brand/70" />
            <span className="absolute -bottom-2 left-9 size-7 rounded-full bg-pink-300" />
          </div>
        </div>

        {/* Forum */}
        <Link
          href="#"
          className="relative flex items-center overflow-hidden rounded-2xl bg-accent-yellow p-5"
        >
          <span className="relative z-10 text-3xl font-black text-zinc-900">
            Forum
          </span>
          <Icons.forum
            size={28}
            weight="fill"
            className="absolute top-4 right-4 text-brand"
          />
          <Icons.forum
            size={20}
            weight="fill"
            className="absolute top-9 right-14 text-brand/70"
          />
          <span className="absolute right-12 bottom-7 text-2xl font-black text-brand">
            √
          </span>
          <Icons.times
            size={18}
            weight="bold"
            className="absolute right-20 bottom-5 text-brand"
          />
          <span className="absolute -right-3 -bottom-3 size-20 rounded-full bg-brand" />
          <span className="absolute right-3 bottom-8 size-3 rounded-full bg-pink-300" />
        </Link>
      </section>

      {/* Recent materials */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold whitespace-nowrap">
            Recent Materi
          </h2>
          <div className="h-2.5 flex-1 rounded-full bg-linear-to-r from-green-400 to-green-500" />
          <Link
            href="/courses"
            className="flex shrink-0 items-center gap-0.5 text-sm font-bold text-brand"
          >
            Lihat Semua
            <Icons.arrow size={16} weight="bold" />
          </Link>
        </div>
        {recentMateri.map((m) => (
          <MateriCard key={m.slug} title={m.title} tone={m.tone} slug={m.slug} />
        ))}
      </section>

      <BottomNav />
    </div>
  );
}

function ProfileHeader() {
  return (
    <header className="flex items-center gap-3">
      <Image
        src="/Logo.png"
        alt="Avatar"
        width={56}
        height={56}
        className="size-14 shrink-0 rounded-full bg-brand-soft ring-2 ring-brand"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-extrabold leading-tight">
          {user.name}
        </p>
        <p className="text-sm text-muted-foreground italic">“ {user.title} ”</p>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-green-400 to-green-500"
              style={{ width: `${user.levelProgress}%` }}
            />
          </div>
          <span className="text-xs font-extrabold whitespace-nowrap">
            Level {user.level}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold">
            {user.coins.toLocaleString("en-US")}
          </span>
          <span className="grid size-6 place-items-center rounded-full bg-amber-400 text-xs font-black text-white">
            Σ
          </span>
          <Link href="/notifications" aria-label="Notifikasi" className="relative">
            <Icons.bell size={22} weight="fill" className="text-amber-400" />
            {NOTIFICATIONS.some((n) => !n.read) && (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-background" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function MateriCard({
  title,
  tone,
  slug,
}: {
  title: string;
  tone: "yellow" | "pink";
  slug: string;
}) {
  const styles = {
    yellow: {
      card: "border-brand bg-accent-yellow shadow-[0_5px_0_0_var(--brand-dark)]",
      text: "text-white",
    },
    pink: {
      card: "border-accent-yellow bg-pink-200 shadow-[0_5px_0_0_var(--accent-yellow-dark)]",
      text: "text-brand",
    },
  }[tone];

  return (
    <Link
      href={`/courses/${slug}`}
      className={cn(
        "relative flex items-center overflow-hidden rounded-2xl border-4 px-5 py-6 active:translate-y-1 active:shadow-none",
        styles.card,
      )}
    >
      {/* corner glow */}
      <span className="absolute -top-6 -left-6 size-16 rounded-full bg-white/25" />
      <ConfettiPattern />
      <span
        className={cn("relative z-10 text-2xl font-extrabold", styles.text)}
      >
        {title}
      </span>
      <span className="relative z-10 ml-auto flex items-center gap-3 text-white">
        <span className="h-8 w-0.5 rounded-full bg-white/70" />
        <Icons.arrow size={24} weight="bold" />
      </span>
    </Link>
  );
}

/** Yellow math glyphs + red exclamations scattered behind the hero mascot. */
function HeroGlyphs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <Icons.divide
        size={26}
        weight="bold"
        className="absolute top-4 left-[42%] text-accent-yellow"
      />
      <span className="absolute top-7 right-8 h-1.5 w-6 rounded-full bg-accent-yellow" />
      <Icons.plus
        size={34}
        weight="bold"
        className="absolute bottom-16 left-[44%] text-accent-yellow"
      />
      <Icons.times
        size={24}
        weight="bold"
        className="absolute bottom-6 left-4 text-accent-yellow"
      />
      <span className="absolute top-1/3 left-[58%] text-2xl font-black text-red-500">
        !
      </span>
      <span className="absolute top-1/4 right-6 text-2xl font-black text-red-500">
        !
      </span>
    </div>
  );
}

/** Purple confetti (dashes + crosses) used on the material cards. */
function ConfettiPattern() {
  const dashes = [
    "top-2 left-[35%] rotate-45",
    "top-7 left-[48%] -rotate-12",
    "bottom-3 left-[40%] rotate-12",
    "top-4 left-[62%] rotate-[60deg]",
    "bottom-5 left-[70%] -rotate-45",
    "top-8 left-[80%] rotate-12",
  ];
  const crosses = [
    "top-3 left-[55%]",
    "bottom-2 left-[58%]",
    "top-6 left-[72%]",
    "bottom-6 left-[64%]",
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {dashes.map((pos, i) => (
        <span
          key={i}
          className={cn("absolute h-1.5 w-6 rounded-full bg-brand/70", pos)}
        />
      ))}
      {crosses.map((pos, i) => (
        <Icons.times
          key={i}
          size={16}
          weight="bold"
          className={cn("absolute text-brand/70", pos)}
        />
      ))}
    </div>
  );
}
