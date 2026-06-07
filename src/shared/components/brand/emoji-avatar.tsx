import { cn } from "@/lib/utils";

/** A placeholder avatar: an emoji centered on a coloured circle. Size via className. */
export function EmojiAvatar({
  emoji,
  bg,
  className,
}: {
  emoji: string;
  bg: string;
  className?: string;
}) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full", bg, className)}>
      {emoji}
    </span>
  );
}
