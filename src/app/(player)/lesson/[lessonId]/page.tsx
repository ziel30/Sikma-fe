"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { EmmaShine } from "@/shared/components/brand/emma";
import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { Sparkles } from "@/shared/components/brand/sparkles";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/lib/utils";

interface Question {
  prompt: string;
  options: string[];
  answer: number;
}

// Placeholder question bank — swap for materi-specific questions later.
const QUESTIONS: Question[] = [
  { prompt: "Berapa hasil dari 7 + 8?", options: ["13", "15", "16", "17"], answer: 1 },
  { prompt: "Bulatkan 3,7 ke bilangan bulat terdekat", options: ["3", "4", "5", "6"], answer: 1 },
  { prompt: "Berapa hasil dari 6 × 4?", options: ["18", "20", "24", "28"], answer: 2 },
];

const XP_PER_CORRECT = 8;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = use(params);
  const router = useRouter();

  const [startedAt] = useState(() => Date.now());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number>();
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<{
    xp: number;
    time: string;
    accuracy: number;
  }>();

  const question = QUESTIONS[index];
  const isLast = index === QUESTIONS.length - 1;
  const isCorrect = selected === question.answer;
  const progress = ((index + (checked ? 1 : 0)) / QUESTIONS.length) * 100;

  function handlePrimary() {
    if (!checked) {
      setChecked(true);
      if (isCorrect) setCorrectCount((c) => c + 1);
      return;
    }
    if (isLast) {
      // correctCount already includes this question (counted at the check step).
      const durationSec = Math.round((Date.now() - startedAt) / 1000);
      setResult({
        xp: correctCount * XP_PER_CORRECT,
        time: formatTime(durationSec),
        accuracy: Math.round((correctCount / QUESTIONS.length) * 100),
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(undefined);
    setChecked(false);
  }

  if (result) {
    return (
      <LessonComplete
        xp={result.xp}
        time={result.time}
        accuracy={result.accuracy}
        onClaim={() => router.push(`/courses/${lessonId}`)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col px-5 pb-8">
      {/* Header: quit + progress */}
      <header className="flex w-full items-center gap-3 py-4">
        <button
          onClick={() => router.push(`/courses/${lessonId}`)}
          aria-label="Keluar"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icons.times size={28} weight="bold" />
        </button>
        <Progress
          value={progress}
          className="h-4 flex-1 bg-muted **:data-[slot=progress-indicator]:bg-brand"
        />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="mt-4 mb-8 text-2xl font-extrabold tracking-tight">
          {question.prompt}
        </h1>

        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isPicked = selected === i;
            const showCorrect = checked && i === question.answer;
            const showWrong = checked && isPicked && !isCorrect;
            return (
              <button
                key={option}
                type="button"
                disabled={checked}
                onClick={() => setSelected(i)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 px-5 py-4 text-left text-lg font-bold transition-colors",
                  showCorrect
                    ? "border-green-500 bg-green-100 text-green-700"
                    : showWrong
                      ? "animate-shake border-red-500 bg-red-100 text-red-700"
                      : isPicked
                        ? "border-brand bg-brand-soft text-foreground"
                        : "border-border bg-card text-foreground hover:border-brand/60"
                )}
              >
                {option}
                {showCorrect && <Sparkles />}
              </button>
            );
          })}
        </div>
      </main>

      {/* Feedback + action */}
      <div className="mx-auto w-full max-w-md">
        {checked && (
          <p
            className={cn(
              "mb-3 flex items-center gap-2 text-base font-extrabold",
              isCorrect ? "text-green-600" : "text-red-600"
            )}
          >
            <Icons.check size={22} weight="fill" />
            {isCorrect ? "Benar! Mantap." : "Kurang tepat, coba lagi nanti."}
          </p>
        )}
        <PrimaryButton
          onClick={handlePrimary}
          disabled={selected === undefined}
          tone={checked && !isCorrect ? "accent" : "brand"}
        >
          {!checked ? "Periksa" : isLast ? "Selesai" : "Lanjut"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function LessonComplete({
  xp,
  time,
  accuracy,
  onClaim,
}: {
  xp: number;
  time: string;
  accuracy: number;
  onClaim: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center px-5 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="relative size-20">
          <Sparkles />
        </div>
        <EmmaShine className="w-44 duration-500 animate-in zoom-in-90 fade-in" />
        <h1 className="text-3xl font-extrabold text-accent-yellow">
          Pelajaran selesai!
        </h1>

        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          <StatCard
            label="TOTAL XP"
            value={String(xp)}
            icon={Icons.energy}
            tone="yellow"
          />
          <StatCard label="CEPAT" value={time} icon={Icons.clock} tone="blue" />
          <StatCard
            label="HEBAT"
            value={`${accuracy}%`}
            icon={Icons.target}
            tone="green"
          />
        </div>
      </div>

      <div className="sticky bottom-0 w-full max-w-md pt-4">
        <PrimaryButton onClick={onClaim}>Klaim XP</PrimaryButton>
      </div>
    </div>
  );
}

const STAT_TONES = {
  yellow: "border-amber-400 text-amber-500",
  blue: "border-sky-400 text-sky-500",
  green: "border-green-500 text-green-600",
} as const;

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: (typeof Icons)["energy"];
  tone: keyof typeof STAT_TONES;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 text-center",
        STAT_TONES[tone]
      )}
    >
      <p className="bg-current/10 py-1 text-xs font-extrabold tracking-wide">
        {label}
      </p>
      <div className="flex items-center justify-center gap-1.5 py-3 font-extrabold">
        <Icon size={20} weight="fill" />
        <span className="text-lg">{value}</span>
      </div>
    </div>
  );
}
