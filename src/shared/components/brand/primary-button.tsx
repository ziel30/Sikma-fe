import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The chunky, Duolingo-style call-to-action used across SIKMA. A solid brand
 * fill with a darker "ledge" underneath that compresses when pressed.
 *
 * `tone="accent"` swaps the purple fill for the yellow accent (dark text).
 * Forwards all shadcn Button props (incl. `asChild`, `disabled`, `type`).
 */
export function PrimaryButton({
  className,
  tone = "brand",
  ...props
}: React.ComponentProps<typeof Button> & { tone?: "brand" | "accent" }) {
  return (
    <Button
      className={cn(
        "h-14 w-full rounded-2xl text-base font-extrabold tracking-wide uppercase transition-all active:translate-y-1 disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none",
        tone === "brand"
          ? "bg-brand text-white shadow-[0_4px_0_0_var(--brand-dark)] hover:bg-brand active:shadow-[0_0_0_0_var(--brand-dark)]"
          : "bg-accent-yellow text-zinc-900 shadow-[0_4px_0_0_var(--accent-yellow-dark)] hover:bg-accent-yellow active:shadow-[0_0_0_0_var(--accent-yellow-dark)]",
        className
      )}
      {...props}
    />
  );
}
