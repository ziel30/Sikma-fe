"use client";

import { Icons } from "@/shared/components/brand/icons";
import { cn } from "@/lib/utils";

/**
 * Toggleable follow/friend button. Swaps a linear plus → check with a smooth
 * ease-in transition and a little pop on the icon when toggled.
 */
export function FollowButton({
  active,
  onToggle,
  labelOff = "Ikuti",
  labelOn = "Mengikuti",
  className,
}: {
  active: boolean;
  onToggle: () => void;
  labelOff?: string;
  labelOn?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all delay-75 duration-300 ease-in",
        active ? "bg-muted text-muted-foreground" : "bg-brand text-white",
        className
      )}
    >
      <span
        key={active ? "on" : "off"}
        className="grid size-4 place-items-center duration-300 ease-in animate-in zoom-in-50 fade-in"
      >
        {active ? (
          <Icons.tick size={16} weight="regular" />
        ) : (
          <Icons.plus size={16} weight="regular" />
        )}
      </span>
      {active ? labelOn : labelOff}
    </button>
  );
}
