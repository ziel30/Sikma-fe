"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Icons } from "@/shared/components/brand/icons";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { getMateri, type Materi, type PathNode } from "@/features/courses/types";
import { cn } from "@/lib/utils";

// Horizontal zig-zag offsets (px) that give the path its winding shape.
const OFFSETS = [0, 52, 76, 52, 0, -52, -76, -52];

const TONES = {
  pink: {
    header: "bg-pink-300",
    node: "bg-pink-400 shadow-[0_6px_0_0_var(--color-pink-500)]",
    halo: "border-pink-400",
    bubble: "bg-pink-400",
    bubbleText: "text-pink-500",
  },
  yellow: {
    header: "bg-accent-yellow",
    node: "bg-amber-400 shadow-[0_6px_0_0_var(--color-amber-500)]",
    halo: "border-amber-400",
    bubble: "bg-amber-400",
    bubbleText: "text-amber-500",
  },
} as const;

export default function MateriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const materi = getMateri(slug);
  if (!materi) notFound();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col pb-28">
      <StatsBar />

      {/* Sticky materi header */}
      <header className="sticky top-0 z-30 px-4 pt-2 pb-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-3xl px-4 py-4 text-white shadow-md",
            TONES[materi.tone].header
          )}
        >
          <Link href="/learn" aria-label="Kembali" className="shrink-0">
            <Icons.back size={26} weight="bold" />
          </Link>
          <span className="h-10 w-0.5 rounded-full bg-white/50" />
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-widest text-white/80 uppercase">
              {materi.label}
            </p>
            <p className="text-lg leading-snug font-extrabold">
              {materi.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Learning path */}
      <main className="flex flex-1 flex-col items-center gap-7 px-4 pt-8">
        {materi.nodes.map((node, i) => (
          <PathNodeButton
            key={node.id}
            node={node}
            tone={materi.tone}
            offset={OFFSETS[i % OFFSETS.length]}
            slug={materi.slug}
          />
        ))}

        {materi.next && <NextMateriCta next={materi.next} />}
      </main>

      <BottomNav />
    </div>
  );
}

function PathNodeButton({
  node,
  tone,
  offset,
  slug,
}: {
  node: PathNode;
  tone: Materi["tone"];
  offset: number;
  slug: string;
}) {
  const locked = node.status === "locked";
  const Glyph =
    node.kind === "chest"
      ? Icons.chest
      : node.kind === "trophy"
        ? Icons.trophy
        : Icons.star;

  const circle = cn(
    "relative grid size-16 place-items-center rounded-full transition-transform",
    locked
      ? "bg-muted text-muted-foreground"
      : cn("text-white active:translate-y-1.5 active:shadow-none", TONES[tone].node)
  );

  const glyph = <Glyph size={30} weight="fill" className="relative" />;

  // Active lesson: tappable node with a pulsing halo and a "start" popover.
  if (node.status === "current") {
    return (
      <div
        className="flex flex-col items-center"
        style={{ transform: `translateX(${offset}px)` }}
      >
        <Popover defaultOpen>
          <div className="relative">
            {/* Halo sits in its own wrapper (nudged down to match the 3D base)
                so the pulse animation's transform doesn't fight the offset. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 grid translate-y-0.75 place-items-center"
            >
              <span
                className={cn(
                  "animate-ring-pulse block size-19 rounded-full border-8",
                  TONES[tone].halo
                )}
              />
            </span>
            <PopoverTrigger asChild>
              <button type="button" className={cn(circle, "z-10")} aria-label="Mulai pelajaran">
                {glyph}
              </button>
            </PopoverTrigger>
          </div>

          <PopoverContent
            side="bottom"
            sideOffset={16}
            className={cn(
              "relative w-72 rounded-3xl border-0 p-4 text-white shadow-xl",
              TONES[tone].bubble
            )}
          >
            <span
              aria-hidden
              className={cn(
                "absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45",
                TONES[tone].bubble
              )}
            />
            <p className="text-lg leading-snug font-extrabold">{node.title}</p>
            <Button
              asChild
              className={cn(
                "mt-4 h-12 w-full rounded-2xl bg-white text-base font-extrabold tracking-wide uppercase hover:bg-white",
                TONES[tone].bubbleText
              )}
            >
              <Link href={`/lesson/${slug}`}>
                Mulai +{node.xp} XP
              </Link>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  const content = (
    <div
      className="flex flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      <span className={circle}>{glyph}</span>
    </div>
  );

  if (locked) {
    return (
      <button type="button" disabled aria-label="Terkunci" className="cursor-not-allowed">
        {content}
      </button>
    );
  }

  return (
    <Link href="#" aria-label={node.kind}>
      {content}
    </Link>
  );
}

function NextMateriCta({ next }: { next: NonNullable<Materi["next"]> }) {
  return (
    <section className="mt-4 w-full border-t border-border pt-6 text-center">
      <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground">
        SELANJUTNYA
      </p>
      <p className="mt-3 text-xl font-extrabold">{next.hint}</p>
      <Button
        asChild
        variant="outline"
        className="mt-5 h-12 w-full rounded-2xl border-2 text-base font-extrabold tracking-wide text-brand uppercase"
      >
        <Link href={`/courses/${next.slug}`}>Lompat ke sini?</Link>
      </Button>
    </section>
  );
}

/** Top stats: course, streak, gems, energy. */
function StatsBar() {
  const stats = [
    { icon: Icons.calculator, value: null, className: "text-sky-500" },
    { icon: Icons.strike, value: "1", className: "text-orange-500" },
    { icon: Icons.gem, value: "520", className: "text-sky-400" },
    { icon: Icons.energy, value: "25", className: "text-pink-400" },
  ];
  return (
    <div className="flex items-center justify-between px-5 py-3">
      {stats.map(({ icon: Icon, value, className }, i) => (
        <span key={i} className="flex items-center gap-1.5 font-extrabold">
          <Icon size={26} weight="fill" className={className} />
          {value && <span className={className}>{value}</span>}
        </span>
      ))}
    </div>
  );
}
