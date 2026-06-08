"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getUserId } from "@/lib/auth/get-user-id";
import { disconnectMatchSocket, getMatchSocket } from "@/lib/match/socket";
import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { cn } from "@/lib/utils";

const CURRENT_USER_AVATAR = "/Asset/profile/profile1.svg";
const DIFFICULTY = 1; // casual = level mudah

type MatchState = "idle" | "finding" | "found";

export default function CasualPage() {
  const router = useRouter();
  const [state, setState] = useState<MatchState>("idle");
  const [dots, setDots] = useState(0);
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [isBot, setIsBot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matchIdRef = useRef<number | null>(null);

  // Animasi titik "Mencari..."
  useEffect(() => {
    if (state !== "finding") return;
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, [state]);

  // Auto-navigasi ke battle saat match ditemukan
  useEffect(() => {
    if (state !== "found" || matchIdRef.current === null) return;
    const t = setTimeout(() => {
      router.push(`/battle?matchId=${matchIdRef.current}&mode=casual`);
    }, 1200);
    return () => clearTimeout(t);
  }, [state, router]);

  function handleStart() {
    setError(null);
    const userId = getUserId();
    if (!userId) { setError("Kamu belum login."); return; }

    const socket = getMatchSocket();

    socket.off("queue_joined");
    socket.off("match_found");
    socket.off("connect_error");

    socket.on("queue_joined", () => setState("finding"));

    socket.on("match_found", (data: { matchId: number; isBot: boolean; opponent: { p1: { userId: number }; p2: { userId: number } } }) => {
      matchIdRef.current = data.matchId;
      const opp = data.opponent.p1.userId === userId
        ? data.opponent.p2.userId
        : data.opponent.p1.userId;
      setOpponentId(opp);
      setIsBot(data.isBot);
      setState("found");
    });

    socket.on("connect_error", () => {
      setError("Gagal terhubung ke server. Coba lagi.");
      setState("idle");
    });

    if (!socket.connected) socket.connect();
    socket.emit("join_queue", { userId, difficulty: DIFFICULTY });
  }

  function handleCancel() {
    const socket = getMatchSocket();
    socket.emit("leave_queue");
    socket.off("queue_joined");
    socket.off("match_found");
    socket.off("connect_error");
    disconnectMatchSocket();
    setState("idle");
  }

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <Link href="/learn" aria-label="Kembali">
          <Icons.back size={26} weight="bold" />
        </Link>
        <h1 className="text-lg font-extrabold">Casual</h1>
        <button aria-label="Bantuan" className="text-muted-foreground">
          <Icons.info size={24} weight="fill" />
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-5 pt-8">
        <div className="flex w-full items-center justify-center gap-12">
          {/* Lawan */}
          <div className="flex flex-col items-center gap-2">
            {state === "found" ? (
              <div className="grid size-20 place-items-center rounded-full bg-brand-soft ring-4 ring-brand animate-in zoom-in-75 duration-300 text-3xl">
                🐺
              </div>
            ) : (
              <div className="grid size-20 place-items-center rounded-full bg-brand-soft ring-4 ring-brand">
                <span className="text-4xl font-black text-brand">?</span>
              </div>
            )}
            <p className="text-sm font-bold text-muted-foreground">
              {state === "found"
                ? isBot ? "Bot SIKMA" : `Player #${opponentId}`
                : state === "finding"
                ? `Mencari${".".repeat(dots)}`
                : "Lawan"}
            </p>
          </div>

          <span className="text-xl font-black text-muted-foreground">VS</span>

          {/* Kamu */}
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

        {state === "found" && (
          <p className="animate-in fade-in text-sm font-extrabold text-brand">
            Lawan ditemukan! Memulai...
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {state === "idle" && (
          <PrimaryButton onClick={handleStart} className="w-full max-w-xs">
            Gass
          </PrimaryButton>
        )}
        {state === "finding" && (
          <button
            onClick={handleCancel}
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

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between">
        <div className="size-32 -translate-x-8 translate-y-8 rounded-full bg-accent-yellow" />
        <div className="size-40 translate-x-10 translate-y-10 rounded-full bg-accent-yellow" />
      </div>
    </div>
  );
}
