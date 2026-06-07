import {
  EmmaDisapointed,
  EmmaExcited,
  EmmaQuestioning,
  EmmaRaiseHand,
  EmmaShine,
  JustEmma,
} from "@/shared/components/brand/emma";
import { cn } from "@/lib/utils";

/**
 * Emma — the SIKMA mascot. A thin wrapper that maps a semantic `mood` to one of
 * the Emma illustrations, so call sites stay decoupled from the artwork.
 * Size it via `className` (e.g. `className="size-32"`).
 */
const MOODS = {
  happy: EmmaShine,
  wink: EmmaExcited,
  think: EmmaQuestioning,
  raise: EmmaRaiseHand,
  sad: EmmaDisapointed,
  plain: JustEmma,
} as const;

export type MascotMood = keyof typeof MOODS;

export function Mascot({
  className,
  mood = "happy",
}: {
  className?: string;
  mood?: MascotMood;
}) {
  const Illustration = MOODS[mood];
  return (
    <Illustration
      role="img"
      aria-label="Emma, maskot SIKMA"
      className={cn("h-auto select-none", className)}
    />
  );
}
