"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Mascot } from "@/shared/components/brand/mascot";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

// Splash phases:
// 0 = logo badge centered on brand background
// 1 = crossfade to the SIKMA wordmark
// 2 = whole splash fades out, revealing the welcome screen
// 3 = splash removed
export default function Home() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const splashDone = phase >= 2;

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* Welcome screen (underneath the splash) */}
      <div
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-5 text-center transition-all duration-700",
          splashDone ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <Mascot mood="happy" className="size-40 drop-shadow-sm" />
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-brand">
            SIKMA
          </h1>
          <p className="text-lg font-medium text-muted-foreground">
            Asik Matika. Belajar gratis. Selamanya.
          </p>
        </div>
      </div>

      <div
        className={cn(
          "flex w-full max-w-sm flex-col gap-3 transition-all delay-150 duration-500",
          splashDone
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        )}
      >
        <PrimaryButton asChild>
          <Link href="/register">Daftar</Link>
        </PrimaryButton>
        <Button
          asChild
          variant="outline"
          className="h-14 w-full rounded-2xl border-2 text-base font-extrabold tracking-wide text-brand uppercase"
        >
          <Link href="/login">Aku Sudah Punya Akun</Link>
        </Button>
      </div>

      {/* Full-screen splash overlay */}
      {phase < 3 && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-brand transition-opacity duration-500",
            phase >= 2 ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Logo badge — fades/scales out as the wordmark fades in */}
          <Image
            src="/Logo.png"
            alt="SIKMA"
            width={128}
            height={128}
            priority
            className={cn(
              "absolute size-32 rounded-[28px] shadow-lg transition-all duration-500",
              phase === 0
                ? "scale-100 opacity-100 animate-in zoom-in-75 fade-in"
                : "scale-90 opacity-0"
            )}
          />

          {/* Wordmark */}
          <h1
            className={cn(
              "text-6xl font-extrabold tracking-tight text-white transition-all duration-500",
              phase >= 1
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0"
            )}
          >
            SIKMA
          </h1>
        </div>
      )}
    </main>
  );
}
