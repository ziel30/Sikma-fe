import Link from "next/link";

import { Icons } from "@/shared/components/brand/icons";
import { Mascot } from "@/shared/components/brand/mascot";

/**
 * Shared layout for the auth screens: a back button, a centered mascot hero
 * with title/subtitle, the form body, and a sticky footer for the CTA.
 */
export function AuthShell({
  backHref,
  title,
  subtitle,
  footer,
  children,
}: {
  backHref: string;
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center px-5 pb-8">
      <header className="flex w-full max-w-md items-center py-4">
        <Link
          href={backHref}
          aria-label="Kembali"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icons.back size={28} weight="bold" />
        </Link>
      </header>

      <div className="flex w-full max-w-md flex-1 flex-col">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Mascot mood="happy" className="size-24" />
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>

      <div className="sticky bottom-0 w-full max-w-md bg-linear-to-t from-background via-background to-transparent pt-4">
        {footer}
      </div>
    </main>
  );
}
