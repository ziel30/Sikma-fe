"use client";

import { useRouter } from "next/navigation";

import { Mascot } from "@/shared/components/brand/mascot";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { SpeechBubble } from "@/shared/components/brand/speech-bubble";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <SpeechBubble className="duration-300 animate-in fade-in zoom-in-95">
          Selamat datang di SIKMA! Rencana belajarmu sudah siap.
        </SpeechBubble>
        <Mascot mood="wink" className="size-36 duration-300 animate-in fade-in" />
      </div>
      <div className="sticky bottom-0 w-full max-w-md pt-4">
        <PrimaryButton onClick={() => router.push("/learn")}>
          Mulai Belajar
        </PrimaryButton>
      </div>
    </main>
  );
}
