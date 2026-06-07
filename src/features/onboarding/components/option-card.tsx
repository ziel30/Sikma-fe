"use client";

import { RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/lib/utils";

/**
 * A large, tappable choice row used across the onboarding selection screens.
 * Wraps a shadcn RadioGroupItem in a label so the whole card is selectable and
 * lights up with the brand colour when checked.
 */
export function OptionCard({
  value,
  icon,
  title,
  description,
  badge,
}: {
  value: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-border bg-card px-4 py-3.5 transition-colors",
        "hover:border-brand/60 hover:bg-brand-soft/40",
        "has-data-[state=checked]:border-brand has-data-[state=checked]:bg-brand-soft/60"
      )}
    >
      {badge && (
        <span className="absolute -top-3 right-3 rounded-full bg-accent-yellow px-2.5 py-0.5 text-xs font-bold tracking-wide text-zinc-900 uppercase">
          {badge}
        </span>
      )}
      <span className="flex size-12 shrink-0 items-center justify-center text-2xl">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-bold text-card-foreground">{title}</span>
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </span>
      <RadioGroupItem value={value} className="ml-auto size-5" />
    </label>
  );
}
