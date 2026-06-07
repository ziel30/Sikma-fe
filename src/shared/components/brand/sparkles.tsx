import { Icons } from "@/shared/components/brand/icons";
import { cn } from "@/lib/utils";

const SPARKS = [
  { pos: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", size: 30, delay: 0, color: "text-amber-400" },
  { pos: "left-[12%] top-[22%]", size: 18, delay: 90, color: "text-red-400" },
  { pos: "right-[14%] top-[18%]", size: 20, delay: 150, color: "text-amber-300" },
  { pos: "left-[20%] bottom-[20%]", size: 16, delay: 60, color: "text-pink-400" },
  { pos: "right-[18%] bottom-[24%]", size: 22, delay: 200, color: "text-amber-400" },
];

/**
 * A celebratory sparkle burst. Render inside a `relative` parent — it fills the
 * container and pops several staggered sparkles, then fades out.
 */
export function Sparkles({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {SPARKS.map((s, i) => (
        <Icons.sparkle
          key={i}
          weight="fill"
          size={s.size}
          style={{ animationDelay: `${s.delay}ms` }}
          className={cn("animate-sparkle absolute", s.pos, s.color)}
        />
      ))}
    </div>
  );
}
