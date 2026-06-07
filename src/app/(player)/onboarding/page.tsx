"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Icons } from "@/shared/components/brand/icons";
import { Mascot } from "@/shared/components/brand/mascot";
import { OptionCard } from "@/features/onboarding/components/option-card";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { SpeechBubble } from "@/shared/components/brand/speech-bubble";
import { Progress } from "@/shared/components/ui/progress";
import { RadioGroup } from "@/shared/components/ui/radio-group";
import { isOnboarded, markOnboarded } from "@/features/onboarding/lib/storage";
import { cn } from "@/lib/utils";

const CLASSES = Array.from({ length: 9 }, (_, i) => `${i + 1}`);

const CLASS_COLORS = [
  "bg-brand",
  "bg-sky-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-brand",
  "bg-sky-500",
  "bg-amber-500",
  "bg-rose-500",
];

const FEATURES = [
  {
    icon: Icons.money,
    title: "Matematika sehari-hari",
    desc: "Latihan menghitung diskon, tagihan, dan kembalian",
  },
  {
    icon: Icons.lightning,
    title: "Berhitung di luar kepala",
    desc: "Pecahkan soal cepat dan teka-teki angka",
  },
  {
    icon: Icons.fun,
    title: "Belajar jadi seru",
    desc: "Lupakan buku teks yang membosankan!",
  },
];

// Each entry renders one onboarding screen. The flow is linear; `canNext`
// gates the continue button for screens that require a choice.
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState<string>();
  const [level, setLevel] = useState<string>();
  const [goal, setGoal] = useState<string>();

  // Onboarding only runs the first time, right after registration. If the user
  // has already completed it, send them straight into the app.
  useEffect(() => {
    if (isOnboarded()) router.replace("/learn");
  }, [router]);

  const TOTAL = 5; // questionnaire steps 0–4
  const progress = ((step + 1) / TOTAL) * 100;

  // Direction drives the slide animation: +1 slides the new step in from the
  // right (moving forward), -1 from the left (going back).
  const [dir, setDir] = useState(1);

  function next() {
    setDir(1);
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
    } else {
      markOnboarded();
      router.push("/welcome");
    }
  }

  function back() {
    setDir(-1);
    if (step === 0) router.push("/register");
    else setStep((s) => s - 1);
  }

  const slideIn = dir >= 0 ? "slide-in-from-right-8" : "slide-in-from-left-8";

  const canNext =
    (step === 2 && !grade) || (step === 3 && !level) || (step === 4 && !goal)
      ? false
      : true;

  return (
    <div className="flex flex-1 flex-col items-center px-5 pb-8">
      {/* Header: back + progress */}
      <header className="flex w-full max-w-xl items-center gap-3 py-4">
        <button
          onClick={back}
          aria-label="Kembali"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icons.back size={28} weight="bold" />
        </button>
        <Progress
          value={progress}
          className="h-4 flex-1 bg-muted **:data-[slot=progress-indicator]:bg-brand"
        />
      </header>

      <main className="flex w-full max-w-xl flex-1 flex-col">
        {/* Mascot + speech */}
        <div className="mt-2 flex items-end gap-3">
          <Mascot
            mood={step >= 2 ? "think" : "happy"}
            className="size-24 shrink-0"
          />
          <SpeechBubble
            key={`bubble-${step}`}
            className="mb-2 duration-300 animate-in fade-in zoom-in-95"
          >
            {step === 0 && "Hai! Aku Simi. Yuk belajar matematika bareng aku!"}
            {step === 1 && "Ini yang akan kamu dapatkan dari kursus Matematika!"}
            {step === 2 && "Kamu kelas berapa?"}
            {step === 3 && "Ayo pilih titik mulaimu! Kamu bisa mengubah ini nanti."}
            {step === 4 && "Mau belajar berapa lama tiap hari?"}
          </SpeechBubble>
        </div>

        {/* Step body — re-keyed per step so the slide animation replays */}
        <div
          key={`step-${step}`}
          className={cn("mt-8 flex-1 duration-300 animate-in fade-in", slideIn)}
        >
          {step === 0 && (
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">
                Selamat datang di <span className="text-brand">SIKMA</span>
              </h1>
              <p className="max-w-sm text-muted-foreground">
                Asik Matika — cara seru, gratis, dan efektif untuk jago
                matematika. Belajar 5 menit sehari sudah cukup.
              </p>
            </div>
          )}

          {step === 1 && (
            <ul className="flex flex-col gap-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <f.icon size={26} weight="fill" />
                  </span>
                  <div>
                    <p className="font-bold">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {step === 2 && (
            <RadioGroup value={grade} onValueChange={(v) => setGrade(v as string)}>
              {CLASSES.map((c, i) => (
                <OptionCard
                  key={c}
                  value={c}
                  title={`Kelas ${c}`}
                  icon={
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xl text-lg font-extrabold text-white",
                        CLASS_COLORS[i]
                      )}
                    >
                      {c}
                    </span>
                  }
                />
              ))}
            </RadioGroup>
          )}

          {step === 3 && (
            <RadioGroup value={level} onValueChange={(v) => setLevel(v as string)}>
              <OptionCard
                value="pemula"
                icon={<Icons.beginner size={28} weight="fill" className="text-brand" />}
                title="Pemula"
                description="Mulai dari keahlian matematika dasar"
              />
              <OptionCard
                value="menengah"
                icon={<Icons.intermediate size={28} weight="fill" className="text-brand" />}
                title="Menengah"
                description="Latihan lebih menantang untuk mengasah keahlian"
                badge="Rekomendasi"
              />
            </RadioGroup>
          )}

          {step === 4 && (
            <RadioGroup value={goal} onValueChange={(v) => setGoal(v as string)}>
              <OptionCard value="5" icon={<Icons.casual size={28} weight="fill" className="text-brand" />} title="Santai" description="5 menit / hari" />
              <OptionCard value="10" icon={<Icons.regular size={28} weight="fill" className="text-brand" />} title="Biasa" description="10 menit / hari" />
              <OptionCard value="15" icon={<Icons.serious size={28} weight="fill" className="text-brand" />} title="Serius" description="15 menit / hari" />
              <OptionCard value="20" icon={<Icons.intense size={28} weight="fill" className="text-brand" />} title="Gila-gilaan" description="20 menit / hari" />
            </RadioGroup>
          )}
        </div>
      </main>

      {/* Sticky continue button */}
      <div className="sticky bottom-0 w-full max-w-xl bg-linear-to-t from-background via-background to-transparent pt-4">
        <PrimaryButton onClick={next} disabled={!canNext}>
          {step === TOTAL - 1 ? "Selesai" : "Lanjutkan"}
        </PrimaryButton>
      </div>
    </div>
  );
}
