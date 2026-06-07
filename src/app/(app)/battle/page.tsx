"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "countdown" | "quiz" | "result";
type CountdownStep = 1 | 2 | 3 | "go";

// ─── Placeholder quiz data ────────────────────────────────────────────────────

const QUESTIONS = [
  {
    question: "Berapa hasil dari 48 ÷ 6 + 5?",
    options: ["11", "13", "8", "14"],
    answer: 1, // index of correct option
  },
  {
    question: "Jika x + 12 = 20, maka x = ?",
    options: ["6", "8", "10", "32"],
    answer: 1,
  },
  {
    question: "Berapakah 15% dari 200?",
    options: ["20", "25", "30", "35"],
    answer: 2,
  },
  {
    question: "√144 = ?",
    options: ["10", "11", "12", "13"],
    answer: 2,
  },
  {
    question: "3² + 4² = ?",
    options: ["25", "14", "49", "7"],
    answer: 0,
  },
];

const ANSWER_LABELS = ["A", "B", "C", "D"];
const QUESTION_TIME = 10; // seconds per question

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BattlePage() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "casual";

  const [phase, setPhase] = useState<Phase>("countdown");
  const [countStep, setCountStep] = useState<CountdownStep>(1);

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selected, setSelected] = useState<number | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Countdown sequence ──────────────────────────────────────────────────────
  useEffect(() => {
    const STEPS: CountdownStep[] = [1, 2, 3, "go"];
    const DURATIONS = [900, 900, 900, 1000]; // ms each step
    let stepIdx = 0;

    function advance() {
      stepIdx++;
      if (stepIdx < STEPS.length) {
        setCountStep(STEPS[stepIdx]);
        setTimeout(advance, DURATIONS[stepIdx]);
      } else {
        setPhase("quiz");
      }
    }

    const t = setTimeout(advance, DURATIONS[0]);
    return () => clearTimeout(t);
  }, []);

  // ── Per-question timer ──────────────────────────────────────────────────────
  const advanceQuestion = useCallback(
    (answeredCorrectly: boolean, answeredByUser: boolean) => {
      if (timerRef.current) clearInterval(timerRef.current);

      if (answeredByUser && answeredCorrectly) {
        setMyScore((s) => s + 10);
      } else if (!answeredByUser || !answeredCorrectly) {
        // Opponent "answers" — simulated
        setOppScore((s) => s + 10);
      }

      const next = qIndex + 1;
      if (next >= QUESTIONS.length) {
        setPhase("result");
        return;
      }

      setTimeout(() => {
        setQIndex(next);
        setSelected(null);
        setTimeLeft(QUESTION_TIME);
      }, 800);
    },
    [qIndex]
  );

  useEffect(() => {
    if (phase !== "quiz") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          advanceQuestion(false, false);
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, qIndex, advanceQuestion]);

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === QUESTIONS[qIndex].answer;
    advanceQuestion(correct, true);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (phase === "countdown") return <CountdownScreen step={countStep} />;
  if (phase === "result")
    return (
      <ResultScreen
        myScore={myScore}
        oppScore={oppScore}
        mode={mode}
        onHome={() => router.replace("/learn")}
        onPlayAgain={() => router.replace("/casual")}
      />
    );

  const q = QUESTIONS[qIndex];
  const timerPct = (timeLeft / QUESTION_TIME) * 100;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      {/* Score bar */}
      <header className="flex items-center justify-between bg-brand px-5 py-3">
        <ScoreChip label="Lawan" score={oppScore} />
        <span className="text-sm font-extrabold text-white/80">
          {qIndex + 1}/{QUESTIONS.length}
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
            Soal {qIndex + 1}
          </p>
          <p className="text-2xl font-extrabold leading-snug text-foreground">
            {q.question}
          </p>
          <div
            className={cn(
              "mt-1 text-3xl font-black tabular-nums transition-colors",
              timeLeft <= 3 ? "text-red-500" : "text-brand"
            )}
          >
            {timeLeft}s
          </div>
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.answer;
            const revealed = selected !== null;

            let style = "border-2 border-muted bg-background text-foreground";
            if (revealed && isCorrect) style = "border-2 border-green-400 bg-green-50 text-green-700";
            else if (revealed && isSelected && !isCorrect)
              style = "border-2 border-red-400 bg-red-50 text-red-700";

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-extrabold transition active:scale-95 disabled:cursor-not-allowed",
                  style
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
      </main>
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

const COUNT_CONFIG: Record<
  CountdownStep,
  { bg: string; text: string; label: string; raccoon?: boolean }
> = {
  1: { bg: "bg-accent-yellow", text: "text-white", label: "1" },
  2: { bg: "bg-accent-yellow", text: "text-white", label: "2" },
  3: { bg: "bg-brand", text: "text-white", label: "3" },
  go: { bg: "bg-brand", text: "text-accent-yellow", label: "GOO!!!", raccoon: true },
};

function CountdownScreen({ step }: { step: CountdownStep }) {
  const cfg = COUNT_CONFIG[step];

  return (
    <div
      key={String(step)}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-300",
        cfg.bg
      )}
    >
      <p
        className={cn(
          "select-none font-black leading-none tracking-tight",
          cfg.raccoon ? "text-7xl" : "text-[12rem]",
          cfg.text
        )}
      >
        {cfg.label}
      </p>

      {cfg.raccoon && (
        <Image
          src="/Asset/Stirke/strikerakun.svg"
          alt="Rakun Goo"
          width={220}
          height={220}
          className="mt-6 h-56 w-auto"
          priority
        />
      )}
    </div>
  );
}

// ─── Score chip ───────────────────────────────────────────────────────────────

function ScoreChip({
  label,
  score,
  flip,
}: {
  label: string;
  score: number;
  flip?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        flip && "flex-row-reverse"
      )}
    >
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

// Simulated ranked point deltas — replace with real API values.
const RANKED_POINTS_WIN = 50;
const RANKED_POINTS_DRAW = 0;
const RANKED_POINTS_LOSE = -20;
const RANKED_RANK_BEFORE = 179;
const RANKED_RANK_AFTER_WIN = 142;

function ResultScreen({
  myScore,
  oppScore,
  mode,
  onHome,
  onPlayAgain,
}: {
  myScore: number;
  oppScore: number;
  mode: string;
  onHome: () => void;
  onPlayAgain: () => void;
}) {
  const won = myScore > oppScore;
  const draw = myScore === oppScore;

  if (mode === "casual") return <CasualResult myScore={myScore} oppScore={oppScore} onHome={onHome} onPlayAgain={onPlayAgain} />;
  return <RankedResult won={won} draw={draw} myScore={myScore} oppScore={oppScore} onHome={onHome} />;
}

function CasualResult({
  myScore,
  oppScore,
  onHome,
  onPlayAgain,
}: {
  myScore: number;
  oppScore: number;
  onHome: () => void;
  onPlayAgain: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="text-3xl font-extrabold text-foreground">Hasil Pertandingan</p>

      {/* Score comparison */}
      <div className="w-full rounded-[28px] bg-muted px-8 py-8 flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lawan</p>
          <p className="text-6xl font-black text-foreground">{oppScore}</p>
        </div>
        <span className="text-2xl font-black text-muted-foreground">vs</span>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kamu</p>
          <p className="text-6xl font-black text-brand">{myScore}</p>
        </div>
      </div>

      {/* Two action buttons */}
      <div className="flex w-full flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full rounded-2xl bg-brand py-4 font-extrabold text-base text-white shadow-[0_4px_0_0_var(--brand-dark)] transition active:translate-y-0.5 active:shadow-none"
        >
          Main Lagi
        </button>
        <button
          onClick={onHome}
          className="w-full rounded-2xl border-2 border-muted py-4 font-extrabold text-base text-muted-foreground transition hover:border-foreground hover:text-foreground active:scale-95"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

function RankedResult({
  won,
  draw,
  myScore,
  oppScore,
  onHome,
}: {
  won: boolean;
  draw: boolean;
  myScore: number;
  oppScore: number;
  onHome: () => void;
}) {
  const pointDelta = won ? RANKED_POINTS_WIN : draw ? RANKED_POINTS_DRAW : RANKED_POINTS_LOSE;
  const rankAfter = won ? RANKED_RANK_AFTER_WIN : RANKED_RANK_BEFORE;

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-6 text-center",
        won ? "bg-brand" : "bg-background"
      )}
    >
      {/* Outcome label */}
      <p
        className={cn(
          "text-6xl font-black",
          won ? "text-accent-yellow" : draw ? "text-foreground" : "text-red-500"
        )}
      >
        {won ? "MENANG!" : draw ? "SERI" : "KALAH"}
      </p>

      {/* Score comparison */}
      <div className={cn(
        "w-full rounded-[28px] px-8 py-6 flex items-center justify-center gap-8",
        won ? "bg-white/15" : "bg-muted"
      )}>
        <div className="flex flex-col items-center gap-1">
          <p className={cn("text-xs font-bold uppercase tracking-widest", won ? "text-white/60" : "text-muted-foreground")}>Lawan</p>
          <p className={cn("text-5xl font-black", won ? "text-white" : "text-foreground")}>{oppScore}</p>
        </div>
        <span className={cn("text-2xl font-black", won ? "text-white/40" : "text-muted-foreground")}>vs</span>
        <div className="flex flex-col items-center gap-1">
          <p className={cn("text-xs font-bold uppercase tracking-widest", won ? "text-white/60" : "text-muted-foreground")}>Kamu</p>
          <p className={cn("text-5xl font-black", won ? "text-accent-yellow" : "text-foreground")}>{myScore}</p>
        </div>
      </div>

      {/* Ranked point change — shown for all outcomes */}
      <div className={cn(
        "w-full rounded-[28px] px-6 py-5 flex flex-col gap-3",
        won ? "bg-white/15" : "bg-muted"
      )}>
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-bold", won ? "text-white/70" : "text-muted-foreground")}>Poin Ranked</p>
          <p className={cn(
            "text-lg font-black",
            pointDelta > 0 ? (won ? "text-accent-yellow" : "text-green-500") : pointDelta < 0 ? "text-red-500" : "text-muted-foreground"
          )}>
            {pointDelta > 0 ? `+${pointDelta}` : pointDelta === 0 ? "±0" : pointDelta}
          </p>
        </div>
        {won && (
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/70">Peringkat</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white/50 line-through">#{RANKED_RANK_BEFORE}</span>
              <span className="text-sm font-black text-accent-yellow">→ #{rankAfter}</span>
            </div>
          </div>
        )}
        {won && (
          <p className="text-xs font-bold text-white/60 text-left">
            🏆 Kamu naik di papan peringkat!
          </p>
        )}
      </div>

      <button
        onClick={onHome}
        className={cn(
          "w-full rounded-2xl py-4 font-extrabold text-base transition active:translate-y-0.5 active:shadow-none",
          won
            ? "bg-accent-yellow text-zinc-900 shadow-[0_4px_0_0_var(--accent-yellow-dark)]"
            : "bg-brand text-white shadow-[0_4px_0_0_var(--brand-dark)]"
        )}
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}
