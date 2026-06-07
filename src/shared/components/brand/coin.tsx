import { cn } from "@/lib/utils";

/** The SIKMA currency token: a yellow coin stamped with a sigma. Size via className. */
export function Coin({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full bg-amber-400 text-xs font-black text-white",
        className
      )}
    >
      Σ
    </span>
  );
}
