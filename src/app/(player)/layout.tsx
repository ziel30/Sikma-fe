import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

/** Authenticated full-screen flow (onboarding, welcome, lesson) — no bottom nav. */
export default async function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <>{children}</>;
}
