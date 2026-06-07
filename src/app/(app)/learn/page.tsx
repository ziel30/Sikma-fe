"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Icons } from "@/shared/components/brand/icons";
import { cn } from "@/lib/utils";

// Placeholder data — replace with real API data when backend is ready.
const user = {
  name: "Aziz Penjinak Naga",
  level: 20,
  levelProgress: 70,
  strike: 20,
  gems: 179,
  avatar: "/Asset/profile/profile1.svg",
};

const LEVELS = [
  { id: 1, label: "Postulat", asset: "/Asset/Level/Level1.svg" },
  { id: 2, label: "Aritmetika", asset: "/Asset/Level/Level1.svg" },
  { id: 3, label: "Aljabar", asset: "/Asset/Level/Level1.svg" },
];

const CURRENT_LEVEL_INDEX = 0;

export default function DashboardPage() {
  const [levelIdx, setLevelIdx] = useState(CURRENT_LEVEL_INDEX);
  const currentLevel = LEVELS[levelIdx];
  const DOT_COUNT = 9;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 pt-5 pb-28 overflow-hidden">
      {/* Profile Header */}
      <ProfileHeader />

      {/* Strike Card */}
      <StrikeCard strike={user.strike} />

      {/* Raccoon / Level Mascot */}
      <section className="flex flex-col items-center gap-3">
        <div className="relative flex w-full items-center justify-center">
          {/* Left arrow */}
          <button
            onClick={() => setLevelIdx((i) => Math.max(0, i - 1))}
            disabled={levelIdx === 0}
            className="absolute left-0 z-10 flex size-10 items-center justify-center rounded-full text-brand transition disabled:opacity-30"
            aria-label="Level sebelumnya"
          >
            <Icons.arrowLeft size={24} weight="bold" />
          </button>

          {/* Mascot image */}
          <div className="relative flex size-52 items-center justify-center">
            <Image
              src={currentLevel.asset}
              alt={`Maskot level ${currentLevel.label}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Right arrow */}
          <button
            onClick={() => setLevelIdx((i) => Math.min(LEVELS.length - 1, i + 1))}
            disabled={levelIdx === LEVELS.length - 1}
            className="absolute right-0 z-10 flex size-10 items-center justify-center rounded-full text-brand transition disabled:opacity-30"
            aria-label="Level berikutnya"
          >
            <Icons.arrow size={24} weight="bold" />
          </button>
        </div>

        {/* Level label */}
        <p className="text-lg font-extrabold text-foreground">{currentLevel.label}</p>

        {/* Dot progress */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-2.5 rounded-full transition-all",
                i === levelIdx
                  ? "size-3 bg-brand"
                  : i < levelIdx
                  ? "bg-brand/40"
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        <p className="text-sm font-bold text-muted-foreground">
          Level {currentLevel.id}
        </p>
      </section>

      {/* Casual / Ranked buttons */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/casual"
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand py-4 font-extrabold text-white text-base shadow-[0_4px_0_0_var(--brand-dark)] transition active:translate-y-0.5 active:shadow-none"
        >
          <Icons.casual size={22} weight="fill" />
          Casual
        </Link>
        <Link
          href="/ranked"
          className="flex items-center justify-center gap-2 rounded-2xl bg-accent-yellow py-4 font-extrabold text-zinc-900 text-base shadow-[0_4px_0_0_var(--accent-yellow-dark)] transition active:translate-y-0.5 active:shadow-none"
        >
          <Icons.trophy size={22} weight="fill" />
          Ranked
        </Link>
      </section>

      <BottomNav />
    </div>
  );
}

function ProfileHeader() {
  return (
    <header className="flex items-center gap-3">
      <Image
        src={user.avatar}
        alt="Avatar"
        width={44}
        height={44}
        className="size-11 shrink-0 rounded-full bg-brand-soft ring-2 ring-brand"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold leading-tight">{user.name.split(" ")[0]}</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-linear-to-r from-green-400 to-green-500"
              style={{ width: `${user.levelProgress}%` }}
            />
          </div>
          <span className="text-xs font-extrabold whitespace-nowrap text-muted-foreground">
            Level {user.level}
          </span>
        </div>
      </div>
    </header>
  );
}

function StrikeCard({ strike }: { strike: number }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-brand px-5 pt-5 pb-4 text-white">
      {/* Pink blob bottom-left */}
      <span className="absolute -bottom-6 -left-6 size-24 rounded-full bg-purple-400/50" />
      {/* Yellow blob bottom-right behind raccoon */}
      <span className="absolute -bottom-4 right-8 size-24 rounded-full bg-accent-yellow/70" />

      {/* Top row: content left + raccoon right */}
      <div className="relative flex items-start">
        {/* Left: label + number */}
        <div className="flex-1">
          <p className="text-base font-extrabold">Strike</p>
          <p className="mt-1 text-8xl font-black leading-none text-accent-yellow">
            {strike}
          </p>
        </div>

        {/* Sparkles — between number and raccoon, above raccoon */}
        <div className="absolute top-3 right-32 z-30 flex flex-col items-start gap-1.5">
          <Icons.sparkle size={26} weight="fill" className="text-accent-yellow" />
          <Icons.sparkle size={15} weight="fill" className="ml-4 text-accent-yellow/70" />
        </div>

        {/* Raccoon mascot */}
        <Image
          src="/Asset/Stirke/strikerakun.svg"
          alt="Rakun Strike"
          width={148}
          height={148}
          className="relative z-20 -mr-3 -mt-3 h-36 w-auto shrink-0 object-contain"
        />
      </div>

      {/* Daily + Guide buttons */}
      <div className="relative z-10 mt-3 grid grid-cols-2 gap-3">
        <Link
          href="/casual"
          className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm transition active:scale-95"
        >
          <Icons.strike size={20} weight="fill" className="shrink-0 text-accent-yellow" />
          <span className="text-sm font-extrabold">Daily</span>
        </Link>
        <Link
          href="#guide"
          className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 backdrop-blur-sm transition active:scale-95"
        >
          <Icons.info size={20} weight="fill" className="shrink-0 text-white" />
          <span className="text-sm font-extrabold">Guide</span>
        </Link>
      </div>
    </section>
  );
}
