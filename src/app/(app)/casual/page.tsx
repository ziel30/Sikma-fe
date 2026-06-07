"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { cn } from "@/lib/utils";

const CURRENT_USER_AVATAR = "/Asset/profile/profile1.svg";

// Simulated opponent — replace with real matchmaking API response.
const FOUND_OPPONENT = { name: "Gass", avatar: "/Asset/profile/profile2.svg" };

type MatchState = "idle" | "finding" | "found";

export default function CasualPage() {
  const router = useRouter();
  const [state, setState] = useState<MatchState>("idle");
  const [dots, setDots] = useState(0);

  // Animate "Mencari..." dots.
  useEffect(() => {
    if (state !== "finding") return;
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, [state]);

  // Simulate finding a match after 2 s, then auto-start after a brief "found" beat.
  useEffect(() => {
    if (state !== "finding") return;
    const findTimer = setTimeout(() => setState("found"), 2000);
    return () => clearTimeout(findTimer);
  }, [state]);

  useEffect(() => {
    if (state !== "found") return;
    const startTimer = setTimeout(() => {
      router.push("/battle?mode=casual");
    }, 1200);
    return () => clearTimeout(startTimer);
  }, [state, router]);

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <Link href="/learn" aria-label="Kembali">
          <Icons.back size={26} weight="bold" />
        </Link>
        <h1 className="text-lg font-extrabold">Casual</h1>
        <button aria-label="Bantuan" className="text-muted-foreground">
          <Icons.info size={24} weight="fill" />
        </button>
      </header>

      {/* Matchmaking area */}
      <main className="flex flex-1 flex-col items-center gap-8 px-5 pt-8">
        {/* Player avatars */}
        <div className="flex w-full items-center justify-center gap-12">
          {/* Opponent slot */}
          <div className="flex flex-col items-center gap-2">
            {state === "found" ? (
              <Image
                src={FOUND_OPPONENT.avatar}
                alt="Lawan"
                width={80}
                height={80}
                className="size-20 rounded-full bg-brand-soft ring-4 ring-brand animate-in zoom-in-75 duration-300"
              />
            ) : (
              <div className="grid size-20 place-items-center rounded-full bg-brand-soft ring-4 ring-brand">
                <span className="text-4xl font-black text-brand">?</span>
              </div>
            )}
            <p className="text-sm font-bold text-muted-foreground">
              {state === "found"
                ? FOUND_OPPONENT.name
                : state === "finding"
                ? `Mencari${".".repeat(dots)}`
                : "Lawan"}
            </p>
          </div>

          {/* VS */}
          <span className="text-xl font-black text-muted-foreground">VS</span>

          {/* Current user */}
          <div className="flex flex-col items-center gap-2">
            <Image
              src={CURRENT_USER_AVATAR}
              alt="Avatar kamu"
              width={80}
              height={80}
              className="size-20 rounded-full bg-brand-soft ring-4 ring-brand"
            />
            <p className="text-sm font-bold">Kamu</p>
          </div>
        </div>

        {/* Status message when found */}
        {state === "found" && (
          <p className="animate-in fade-in text-sm font-extrabold text-brand">
            Lawan ditemukan! Memulai...
          </p>
        )}

        {/* Action buttons */}
        {state === "idle" && (
          <PrimaryButton onClick={() => setState("finding")} className="w-full max-w-xs">
            Gass
          </PrimaryButton>
        )}
        {state === "finding" && (
          <button
            onClick={() => setState("idle")}
            className="rounded-2xl border-2 border-muted px-10 py-3 font-extrabold text-muted-foreground transition hover:border-foreground hover:text-foreground"
          >
            Batalkan
          </button>
        )}

        {state !== "found" && (
          <p className="text-center text-sm font-bold text-muted-foreground italic">
            "Jawab Dengan Cepat Dan Tepat"
          </p>
        )}
      </main>

      {/* Decorative yellow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between">
        <div className="size-32 -translate-x-8 translate-y-8 rounded-full bg-accent-yellow" />
        <div className="size-40 translate-x-10 translate-y-10 rounded-full bg-accent-yellow" />
      </div>
    </div>
  );
}
