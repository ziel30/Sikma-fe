"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getUserId } from "@/lib/auth/get-user-id";
import { disconnectMatchSocket, getMatchSocket, setPendingQuestion } from "@/lib/match/socket";
import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { cn } from "@/lib/utils";

const CURRENT_USER_AVATAR = "/Asset/profile/profile1.svg";
const BOT_TIMEOUT_MS = 5000;

type MatchState = "idle" | "finding" | "found" | "bot";

export default function CasualPage() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "casual";

  const [state, setState] = useState<MatchState>("idle");
  const [dots, setDots] = useState(0);
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [foundAsBot, setFoundAsBot] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matchIdRef = useRef<number | null>(null);

  // Animasi titik "Mencari..."
  useEffect(() => {
    if (state !== "finding") return;
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    return () => clearInterval(t);
  }, [state]);

  // 5-second client-side bot fallback — CASUAL only. Ranked waits for the
  // server to pair a human or a server-side bot, so rank points persist.
  useEffect(() => {
    if (state !== "finding" || mode === "ranked") return;
    const t = setTimeout(() => {
      const socket = getMatchSocket();
      socket.emit("leave_queue");
      socket.off("queue_joined");
      socket.off("match_found");
      socket.off("connect_error");
      socket.off("question");
      setState("bot");
    }, BOT_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [state, mode]);

  // Navigate to bot battle after brief "lawan ditemukan" moment
  useEffect(() => {
    if (state !== "bot") return;
    const t = setTimeout(() => {
      router.push(`/battle?mode=${mode}&bot=true`);
    }, 800);
    return () => clearTimeout(t);
  }, [state, mode, router]);

  // Auto-navigate to real battle when match found
  useEffect(() => {
    if (state !== "found" || matchIdRef.current === null) return;
    const t = setTimeout(() => {
      router.push(`/battle?matchId=${matchIdRef.current}&mode=${mode}`);
    }, 300);
    return () => clearTimeout(t);
  }, [state, mode, router]);

  function handleStart() {
    setError(null);
    const userId = getUserId();
    if (!userId) { setError("Kamu belum login."); return; }

    const socket = getMatchSocket();

    socket.off("queue_joined");
    socket.off("match_found");
    socket.off("connect_error");
    socket.off("question");

    socket.on("queue_joined", () => setState("finding"));

    socket.on("match_found", (data: { matchId: number; isBot: boolean; opponent: { p1: { userId: number }; p2: { userId: number } } }) => {
      matchIdRef.current = data.matchId;
      const opp = data.opponent.p1.userId === userId
        ? data.opponent.p2.userId
        : data.opponent.p1.userId;
      setOpponentId(opp);
      setFoundAsBot(data.isBot);
      setState("found");
    });

    socket.on("connect_error", () => {
      setError("Gagal terhubung ke server. Coba lagi.");
      setState("idle");
    });

    // Buffer any question the server sends before battle page is ready.
    socket.on("question", setPendingQuestion);

    if (!socket.connected) socket.connect();
    socket.emit("join_queue", { userId, difficulty: 1, mode });
  }

  function handleCancel() {
    const socket = getMatchSocket();
    socket.emit("leave_queue");
    socket.off("queue_joined");
    socket.off("match_found");
    socket.off("connect_error");
    socket.off("question");
    disconnectMatchSocket();
    setState("idle");
  }

  const isRanked = mode === "ranked";
  const opponentLabel =
    state === "found" ? (foundAsBot ? "Bot SIKMA" : `Player #${opponentId}`)
    : state === "bot" ? "Bot SIKMA"
    : state === "finding" ? `Mencari${".".repeat(dots)}`
    : "Lawan";

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 pt-5 pb-2">
        <Link href={isRanked ? "/ranked" : "/learn"} aria-label="Kembali">
          <Icons.back size={26} weight="bold" />
        </Link>
        <h1 className="text-lg font-extrabold">{isRanked ? "Ranked" : "Casual"}</h1>
        <button aria-label="Bantuan" className="text-muted-foreground">
          <Icons.info size={24} weight="fill" />
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center gap-8 px-5 pt-8">
        <div className="flex w-full items-center justify-center gap-12">
          {/* Lawan */}
          <div className="flex flex-col items-center gap-2">
            {(state === "found" || state === "bot") ? (
              <div className="grid size-20 place-items-center rounded-full bg-brand-soft ring-4 ring-brand animate-in zoom-in-75 duration-300 text-3xl">
                🤖
              </div>
            ) : (
              <div className="grid size-20 place-items-center rounded-full bg-brand-soft ring-4 ring-brand">
                <span className="text-4xl font-black text-brand">?</span>
              </div>
            )}
            <p className="text-sm font-bold text-muted-foreground">{opponentLabel}</p>
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

        {(state === "found" || state === "bot") && (
          <p className="animate-in fade-in text-sm font-extrabold text-brand">
            {state === "bot" ? "Bot ditemukan! Memulai..." : "Lawan ditemukan! Memulai..."}
          </p>
        )}

        {error && (
          <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {state === "idle" && (
          <PrimaryButton onClick={handleStart} className="w-full max-w-xs">
            {isRanked ? "Mulai" : "Gass"}
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

        {state !== "found" && state !== "bot" && (
          <p className="text-center text-sm font-bold text-muted-foreground italic">
            {isRanked
              ? '"Buktikan kemampuanmu di liga!"'
              : '"Jawab Dengan Cepat Dan Tepat"'}
          </p>
        )}
      </main>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between">
        <div className={cn("size-32 -translate-x-8 translate-y-8 rounded-full", isRanked ? "bg-amber-300" : "bg-accent-yellow")} />
        <div className={cn("size-40 translate-x-10 translate-y-10 rounded-full", isRanked ? "bg-amber-300" : "bg-accent-yellow")} />
      </div>
    </div>
  );
}
