import { cn } from "@/lib/utils";

/** A chat-style speech bubble with a little tail pointing toward the mascot. */
export function SpeechBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-border bg-card px-5 py-3 text-base font-medium leading-snug text-card-foreground",
        // tail
        "before:absolute before:-bottom-[10px] before:left-8 before:h-4 before:w-4 before:rotate-45 before:border-b-2 before:border-r-2 before:border-border before:bg-card before:content-['']",
        className
      )}
    >
      {children}
    </div>
  );
}
