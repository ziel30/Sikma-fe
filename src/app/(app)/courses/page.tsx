"use client";

import Link from "next/link";

import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Icons } from "@/shared/components/brand/icons";
import { MATERI, type Materi } from "@/features/courses/types";
import { cn } from "@/lib/utils";

const TONES = {
  yellow: {
    card: "border-brand bg-accent-yellow shadow-[0_5px_0_0_var(--brand-dark)]",
    text: "text-white",
    track: "bg-white/30",
    bar: "bg-white",
  },
  pink: {
    card: "border-accent-yellow bg-pink-200 shadow-[0_5px_0_0_var(--accent-yellow-dark)]",
    text: "text-brand",
    track: "bg-brand/15",
    bar: "bg-brand",
  },
} as const;

export default function TopicsPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pt-5 pb-28">
      <header className="flex items-center gap-3">
        <Link href="/learn" aria-label="Kembali" className="text-foreground">
          <Icons.back size={26} weight="bold" />
        </Link>
        <h1 className="text-2xl font-extrabold">Topik</h1>
      </header>

      <p className="text-sm text-muted-foreground">
        Pilih topik untuk mulai belajar dan kerjakan latihannya.
      </p>

      <div className="flex flex-col gap-4">
        {MATERI.map((materi) => (
          <TopicCard key={materi.slug} materi={materi} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function TopicCard({ materi }: { materi: Materi }) {
  const tone = TONES[materi.tone];
  const lessons = materi.nodes.filter((n) => n.kind === "lesson");
  const done = lessons.filter((n) => n.status === "done").length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;

  return (
    <Link
      href={`/courses/${materi.slug}`}
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-2xl border-4 p-4 active:translate-y-1 active:shadow-none",
        tone.card
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-bold tracking-widest uppercase opacity-80", tone.text)}>
            {materi.label}
          </p>
          <p className={cn("text-lg leading-snug font-extrabold", tone.text)}>
            {materi.subtitle}
          </p>
        </div>
        <Icons.arrow size={24} weight="bold" className={tone.text} />
      </div>

      <div className="flex items-center gap-2">
        <div className={cn("h-2 flex-1 overflow-hidden rounded-full", tone.track)}>
          <div
            className={cn("h-full rounded-full", tone.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={cn("text-xs font-extrabold", tone.text)}>
          {done}/{lessons.length}
        </span>
      </div>
    </Link>
  );
}
