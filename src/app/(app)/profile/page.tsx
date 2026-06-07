"use client";

import Image from "next/image";
import Link from "next/link";

import { EmmaExcited } from "@/shared/components/brand/emma";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Icons } from "@/shared/components/brand/icons";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { ACHIEVEMENTS, PROFILE, type Achievement } from "@/features/profile/types";
import { cn } from "@/lib/utils";

const id = (n: number) => n.toLocaleString("id-ID");

export default function ProfilePage() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-28">
      {/* Banner — name (left) + avatar (right) sit inside it */}
      <div className="relative h-52 overflow-hidden bg-linear-to-br from-brand to-fuchsia-400 text-white">
        <BannerGlyphs />
        {/* darken the lower area for legibility, then melt into the page bg */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/30 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-background"
        />

        <Link
          href="/profile/settings"
          aria-label="Pengaturan"
          className="absolute top-4 left-4 z-10 grid size-9 place-items-center rounded-full bg-black/15"
        >
          <Icons.menu size={20} weight="bold" />
        </Link>

        {/* Name + ID */}
        <div className="absolute bottom-7 left-5 z-10">
          <h1 className="text-xl font-bold drop-shadow-sm">{PROFILE.name}</h1>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 text-xs font-medium text-white/90">
            <Icons.info size={12} weight="fill" /> {PROFILE.userId}
          </span>
        </div>

        {/* Avatar (right) opens the photo/decoration drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <button aria-label="Opsi avatar" className="absolute right-5 bottom-6 z-10 rounded-full">
              <Image
                src="/Logo.png"
                alt="Avatar"
                width={80}
                height={80}
                className="size-20 rounded-full bg-brand-soft ring-4 ring-white/90"
              />
            </button>
          </DrawerTrigger>
          <AvatarDrawerContent />
        </Drawer>
      </div>

      <div className="flex flex-col gap-5 px-5 pt-5">
        <p className="text-muted-foreground">{PROFILE.bio}</p>

        {/* Social stats + add friend */}
        <div className="flex items-center justify-between">
          <div className="flex gap-7">
            <Stat label="Suka" value={PROFILE.likes} />
            <Stat label="Mengikuti" value={PROFILE.following} href="/profile/following" />
            <Stat label="Pengikut" value={PROFILE.followers} href="/profile/followers" />
          </div>
        </div>

        <Button
          asChild
          className="h-11 w-full rounded-xl bg-brand text-base font-extrabold text-white hover:bg-brand"
        >
          <Link href="/profile/friends">
            <Icons.addFriend size={18} weight="bold" /> Tambah Teman
          </Link>
        </Button>

        {/* Game stats card — header shows the leaderboard rank (trophy) */}
        <Link
          href="/leaderboard"
          className="relative block overflow-hidden rounded-2xl bg-linear-to-r from-amber-50 to-amber-100 p-4 ring-1 ring-amber-200"
        >
          <div className="relative z-10 flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-400 text-white">
              <Icons.trophy size={22} weight="fill" />
            </span>
            <div>
              <p className="font-extrabold text-amber-900">
                Peringkat #{PROFILE.rank}
              </p>
              <p className="text-xs text-amber-700/70">Papan Peringkat · Global</p>
            </div>
            <Icons.arrow
              size={18}
              weight="bold"
              className="ml-auto text-amber-700/50"
            />
          </div>

          <div className="relative z-10 mt-4 grid max-w-[62%] grid-cols-2 gap-x-4 gap-y-3">
            <GameStat label="Level" value={String(PROFILE.level)} />
            <GameStat label="Total XP" value={id(PROFILE.xp)} />
            <GameStat label="Streak" value={`${PROFILE.streak} hari`} />
            <GameStat label="Bergabung" value={PROFILE.joinedAt} />
          </div>
          <EmmaExcited className="absolute -right-2 bottom-0 z-0 w-28" />
        </Link>

        {/* Achievements */}
        <section>
          <h2 className="mb-3 flex items-baseline gap-2 text-base font-bold">
            Pencapaianku
            <span className="text-sm font-medium text-muted-foreground">
              {unlocked}/{ACHIEVEMENTS.length}
            </span>
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <AchievementBadge key={a.id} achievement={a} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

function AvatarDrawerContent() {
  return (
    <DrawerContent className="mx-auto max-w-md">
      <div className="px-5 pt-2 pb-8">
        <DrawerTitle className="sr-only">Opsi avatar</DrawerTitle>
        <div className="flex flex-col gap-2">
          <DrawerClose asChild>
            <button className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-4 text-left font-bold transition-colors hover:bg-brand-soft">
              <Icons.edit size={20} weight="fill" className="text-brand" />
              Ganti avatar
            </button>
          </DrawerClose>
          <Link
            href="/profile/decoration"
            className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-4 font-bold transition-colors hover:bg-brand-soft"
          >
            <Icons.sparkle size={20} weight="fill" className="text-brand" />
            Edit dekorasi avatar
            <Icons.arrow size={18} weight="bold" className="ml-auto text-muted-foreground" />
          </Link>
        </div>
        <DrawerClose asChild>
          <Button
            variant="outline"
            className="mt-2 h-14 w-full rounded-2xl border-2 text-base font-extrabold"
          >
            Batal
          </Button>
        </DrawerClose>
      </div>
    </DrawerContent>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-base font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </>
  );
  return href ? (
    <Link href={href} className="text-center">
      {content}
    </Link>
  ) : (
    <div className="text-center">{content}</div>
  );
}

function GameStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-amber-700/70">{label}</p>
      <p className="font-extrabold text-amber-900">{value}</p>
    </div>
  );
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "grid size-16 place-items-center rounded-2xl rounded-t-[1.75rem] text-2xl",
          achievement.unlocked
            ? "bg-linear-to-b from-amber-200 to-amber-50 ring-1 ring-amber-300"
            : "bg-muted text-muted-foreground"
        )}
      >
        {achievement.unlocked ? (
          achievement.emoji
        ) : (
          <Icons.lock size={20} weight="fill" />
        )}
      </div>
      <span className="line-clamp-1 w-full text-center text-[11px] text-muted-foreground">
        {achievement.name}
      </span>
    </div>
  );
}

function BannerGlyphs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Icons.plus size={28} weight="bold" className="absolute top-6 right-10 text-white/20" />
      <Icons.times size={22} weight="bold" className="absolute top-16 right-24 text-white/20" />
      <Icons.divide size={20} weight="bold" className="absolute top-8 left-1/2 text-white/20" />
      <Icons.sparkle size={18} weight="fill" className="absolute top-20 right-6 text-white/30" />
    </div>
  );
}
