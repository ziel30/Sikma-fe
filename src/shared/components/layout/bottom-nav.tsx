"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/shared/components/brand/icons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: Icons.home, label: "Beranda", href: "/learn" },
  { icon: Icons.trophy, label: "Peringkat", href: "/leaderboard" },
  { icon: Icons.shop, label: "Shop", href: "/shop" },
];

/** App-wide bottom navigation. Highlights the item matching the current route. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-md items-center justify-between bg-brand px-8 py-4">
      {ITEMS.map(({ icon: Icon, label, href }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "grid size-10 place-items-center transition-colors",
              active ? "text-accent-yellow" : "text-white/80 hover:text-white"
            )}
          >
            <Icon size={30} weight="fill" />
          </Link>
        );
      })}
      <Link href="/profile" aria-label="Profil" className="shrink-0">
        <Image
          src="/Logo.png"
          alt="Profil"
          width={40}
          height={40}
          className="size-10 rounded-full bg-brand-soft ring-2 ring-white/80"
        />
      </Link>
    </nav>
  );
}
