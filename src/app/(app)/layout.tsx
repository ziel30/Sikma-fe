import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/get-current-user";

/** Authenticated app shell. Pages render their own BottomNav where needed. */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <>{children}</>;
}
