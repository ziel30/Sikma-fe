"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { getUserId } from "@/lib/auth/get-user-id";
import { generateOptions, parseQuestion } from "@/lib/match/generate-options";
import { disconnectMatchSocket, getMatchSocket } from "@/lib/match/socket";
import { cn } from "@/lib/utils";
import { getMyStrike, type StrikeInfo } from "@/features/strike/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "countdown" | "quiz" | "feedback" | "result";
type CountdownStep = 1 | 2 | 3 | "go";

interface QuestionState {
  roundNumber: number;
  totalRounds: number;
  question: string;
  options: string[];
  answerIndex: number; // posisi jawaban benar di options[]
}

interface Scores {
  player1: { userId: number; score: number };
  player2: { userId: number; score: number };
}

const QUESTION_TIME = 20; // detik
const ANSWER_LABELS = ["A", "B", "C", "D"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BattlePage() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "casual";
  const matchId = Number(params.get("matchId") ?? 0);

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countStep, setCountStep] = useState<CountdownStep>(3);

  const [current, setCurrent] = useState<QuestionState | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [lastCorrect, setLastCorrect] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [strikeInfo, setStrikeInfo] = useState<StrikeInfo | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userIdRef = useRef<number | null>(null);

  // ── Countdown ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const STEPS: CountdownStep[] = [3, 2, 1, "go"];
    let i = 0;

    function next() {
      i++;
      if (i < STEPS.length) {
        setCountStep(STEPS[i]);
        setTimeout(next, 800);
      } else {
        setPhase("quiz");
      }
    }
    const t = setTimeout(next, 800);
    return () => clearTimeout(t);
  }, []);

  // ── Socket setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!matchId) return;
    userIdRef.current = getUserId();

    const socket = getMatchSocket();
    if (!socket.connected) socket.connect();

    // Tell server this player is ready — server sends first question only after this
    const emitReady = () => socket.emit("match_ready", { matchId });
    if (socket.connected) {
      emitReady();
    } else {
      socket.once("connect", emitReady);
    }

    socket.on("question", (data: { roundNumber: number; totalRounds: number; question: string }) => {
      const correct = parseQuestion(data.question);
      const { options, answerIndex } = generateOptions(correct);
      setCurrent({ ...data, options, answerIndex });
      setSelected(null);
      setLastCorrect(null);
      setTimeLeft(QUESTION_TIME);
      setRoundStartTime(Date.now());
      setPhase("quiz");
    });

    socket.on("answer_result", (data: {
      isCorrect: boolean;
      correctAnswer: number;
      scores: Scores;
    }) => {
      const uid = userIdRef.current;
      const myS = uid === data.scores.player1.userId
        ? data.scores.player1.score
        : data.scores.player2.score;
      const oppS = uid === data.scores.player1.userId
        ? data.scores.player2.score
        : data.scores.player1.score;
      setMyScore(myS);
      setOppScore(oppS);
      setLastCorrect(findOptionIndex(data.correctAnswer));
      setPhase("feedback");
    });

    socket.on("round_timeout", (data: { correctAnswer: number; scores: Scores }) => {
      const uid = userIdRef.current;
      const myS = uid === data.scores.player1.userId
        ? data.scores.player1.score
        : data.scores.player2.score;
      const oppS = uid === data.scores.player1.userId
        ? data.scores.player2.score
        : data.scores.player1.score;
      setMyScore(myS);
      setOppScore(oppS);
      setLastCorrect(findOptionIndex(data.correctAnswer));
      setPhase("feedback");
    });

    socket.on("match_end", (data: { winnerId: number; scores: Scores }) => {
      setWinnerId(data.winnerId);
      const uid = userIdRef.current;
      const myS = uid === data.scores.player1.userId
        ? data.scores.player1.score
        : data.scores.player2.score;
      const oppS = uid === data.scores.player1.userId
        ? data.scores.player2.score
        : data.scores.player1.score;
      setMyScore(myS);
      setOppScore(oppS);
      setPhase("result");
      // Ambil info strike terbaru setelah match selesai
      if (mode === "casual") {
        getMyStrike().then(setStrikeInfo).catch(() => null);
      }
    });

    socket.on("opponent_disconnected", () => {
      setWinnerId(userIdRef.current);
      setPhase("result");
    });

    return () => {
      socket.off("question");
      socket.off("answer_result");
      socket.off("round_timeout");
      socket.off("match_end");
      socket.off("opponent_disconnected");
    };
  }, [matchId]);

  // ── Per-question countdown timer ────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "quiz") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, current?.roundNumber]);

  // ── Answer handler ──────────────────────────────────────────────────────────
  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null || !current || !matchId) return;
    setSelected(idx);
    if (timerRef.current) clearInterval(timerRef.current);

    const socket = getMatchSocket();
    socket.emit("submit_answer", {
      matchId,
      roundNumber: current.roundNumber,
      answer: Number(current.options[idx]),
      responseTimeMs: Date.now() - roundStartTime,
    });
  }, [selected, current, matchId, roundStartTime]);

  // ─── Helper: find option index by correct answer value ─────────────────────
  function findOptionIndex(correctAnswer: number): number {
    if (!current) return -1;
    return current.options.findIndex((o) => Math.abs(Number(o) - correctAnswer) < 0.01);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (phase === "countdown") return <CountdownScreen step={countStep} />;

  if (phase === "result") {
    const won = winnerId === userIdRef.current;
    const draw = winnerId === null;
    return (
      <ResultScreen
        myScore={myScore}
        oppScore={oppScore}
        won={won}
        draw={draw}
        mode={mode}
        strikeInfo={strikeInfo}
        onHome={() => { disconnectMatchSocket(); router.replace("/learn"); }}
        onPlayAgain={() => { disconnectMatchSocket(); router.replace("/casual"); }}
      />
    );
  }

  if (!current) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="font-bold text-muted-foreground animate-pulse">Menunggu soal pertama...</p>
      </div>
    );
  }

  const timerPct = (timeLeft / QUESTION_TIME) * 100;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      {/* Score bar */}
      <header className="flex items-center justify-between bg-brand px-5 py-3">
        <ScoreChip label="Lawan" score={oppScore} />
        <span className="text-sm font-extrabold text-white/80">
          {current.roundNumber}/{current.totalRounds}
        </span>
        <ScoreChip label="Kamu" score={myScore} flip />
      </header>

      {/* Timer bar */}
      <div className="h-2.5 w-full bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-1000",
            timerPct > 50 ? "bg-green-500" : timerPct > 25 ? "bg-amber-400" : "bg-red-500"
          )}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Question */}
      <main className="flex flex-1 flex-col gap-6 px-5 pt-8 pb-6">
        <div className="flex flex-col items-center gap-3 rounded-[28px] bg-brand-soft px-6 py-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">
            Soal {current.roundNumber}
          </p>
          <p className="text-2xl font-extrabold leading-snug text-foreground">
            {current.question}
          </p>
          <div className={cn(
            "mt-1 text-3xl font-black tabular-nums transition-colors",
            timeLeft <= 5 ? "text-red-500" : "text-brand"
          )}>
            {phase === "quiz" ? `${timeLeft}s` : "⏱"}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === lastCorrect;
            const revealed = phase === "feedback";

            let style = "border-2 border-muted bg-background text-foreground";
            if (revealed && isCorrect) style = "border-2 border-green-400 bg-green-50 text-green-700";
            else if (revealed && isSelected && !isCorrect) style = "border-2 border-red-400 bg-red-50 text-red-700";
            else if (isSelected && !revealed) style = "border-2 border-brand bg-brand-soft text-brand";

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null || phase === "feedback"}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-extrabold transition active:scale-95 disabled:cursor-not-allowed",
                  style,
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-black text-white">
                  {ANSWER_LABELS[i]}
                </span>
                <span className="text-sm leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {phase === "feedback" && (
          <p className="text-center text-sm font-bold text-muted-foreground animate-pulse">
            Menunggu soal berikutnya...
          </p>
        )}
      </main>
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

const COUNT_CONFIG: Record<CountdownStep, { bg: string; text: string; label: string }> = {
  3: { bg: "bg-brand", text: "text-white", label: "3" },
  2: { bg: "bg-accent-yellow", text: "text-white", label: "2" },
  1: { bg: "bg-accent-yellow", text: "text-white", label: "1" },
  go: { bg: "bg-brand", text: "text-accent-yellow", label: "GOO!!!" },
};

function CountdownScreen({ step }: { step: CountdownStep }) {
  const cfg = COUNT_CONFIG[step];
  return (
    <div key={String(step)} className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-300",
      cfg.bg,
    )}>
      <p className={cn("select-none font-black leading-none tracking-tight", cfg.text,
        step === "go" ? "text-7xl" : "text-[12rem]")}>
        {cfg.label}
      </p>
    </div>
  );
}

// ─── Score chip ───────────────────────────────────────────────────────────────

function ScoreChip({ label, score, flip }: { label: string; score: number; flip?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", flip && "flex-row-reverse")}>
      <div className="grid size-9 place-items-center rounded-full bg-white/20 text-xl">
        {flip ? "🧑" : "🐺"}
      </div>
      <div className={cn("flex flex-col", flip && "items-end")}>
        <p className="text-xs font-bold text-white/70">{label}</p>
        <p className="text-base font-black text-white">{score}</p>
      </div>
    </div>
  );
}

// ─── Result ───────────────────────────────────────────────────────────────────

function ResultScreen({
  myScore, oppScore, won, draw, mode, strikeInfo, onHome, onPlayAgain,
}: {
  myScore: number; oppScore: number; won: boolean; draw: boolean;
  mode: string; strikeInfo: StrikeInfo | null; onHome: () => void; onPlayAgain: () => void;
}) {
  const outcome = won ? "MENANG!" : draw ? "SERI" : "KALAH";

  return (
    <div className={cn(
      "mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-6 text-center",
      won && "bg-brand",
    )}>
      <p className={cn("text-6xl font-black",
        won ? "text-accent-yellow" : draw ? "text-foreground" : "text-red-500")}>
        {outcome}
      </p>

      <div className={cn(
        "w-full rounded-[28px] px-8 py-8 flex items-center justify-center gap-8",
        won ? "bg-white/15" : "bg-muted",
      )}>
        <div className="flex flex-col items-center gap-1">
          <p className={cn("text-xs font-bold uppercase tracking-widest", won ? "text-white/60" : "text-muted-foreground")}>Lawan</p>
          <p className={cn("text-6xl font-black", won ? "text-white" : "text-foreground")}>{oppScore}</p>
        </div>
        <span className={cn("text-2xl font-black", won ? "text-white/40" : "text-muted-foreground")}>vs</span>
        <div className="flex flex-col items-center gap-1">
          <p className={cn("text-xs font-bold uppercase tracking-widest", won ? "text-white/60" : "text-muted-foreground")}>Kamu</p>
          <p className={cn("text-5xl font-black", won ? "text-accent-yellow" : "text-brand")}>{myScore}</p>
        </div>
      </div>

      {mode === "casual" && strikeInfo && (
        <div className={cn(
          "w-full rounded-2xl px-6 py-4 flex items-center justify-between",
          won ? "bg-white/15" : "bg-muted",
        )}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div className="text-left">
              <p className={cn("text-xs font-bold uppercase tracking-widest",
                won ? "text-white/60" : "text-muted-foreground")}>Strike Harian</p>
              <p className={cn("text-lg font-black", won ? "text-white" : "text-foreground")}>
                {strikeInfo.currentStreak} hari
              </p>
            </div>
          </div>
          <span className={cn("text-xs font-bold px-3 py-1 rounded-full",
            strikeInfo.todayCompleted
              ? (won ? "bg-white/20 text-white" : "bg-green-100 text-green-700")
              : (won ? "bg-white/10 text-white/60" : "bg-muted text-muted-foreground")
          )}>
            {strikeInfo.todayCompleted ? "Hari ini ✓" : "Belum"}
          </span>
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        {mode === "casual" && (
          <button onClick={onPlayAgain} className="w-full rounded-2xl bg-brand py-4 font-extrabold text-base text-white shadow-[0_4px_0_0_var(--brand-dark)] transition active:translate-y-0.5 active:shadow-none">
            Main Lagi
          </button>
        )}
        <button onClick={onHome} className="w-full rounded-2xl border-2 border-muted py-4 font-extrabold text-base text-muted-foreground transition hover:border-foreground hover:text-foreground active:scale-95">
          Keluar
        </button>
      </div>
    </div>
  );
}
