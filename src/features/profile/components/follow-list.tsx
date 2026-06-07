"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { FollowButton } from "@/features/profile/components/follow-button";
import { Icons } from "@/shared/components/brand/icons";
import type { UserPreview } from "@/features/profile/types";

/** Shared list screen for the "Mengikuti" / "Pengikut" sub-pages. */
export function FollowList({
  title,
  users,
}: {
  title: string;
  users: UserPreview[];
}) {
  const router = useRouter();
  // Track follow state per user so the buttons toggle.
  const [followed, setFollowed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(users.map((u) => [u.id, u.following]))
  );

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8">
      <header className="grid grid-cols-[auto_1fr_auto] items-center py-4">
        <button onClick={() => router.back()} aria-label="Kembali" className="text-foreground">
          <Icons.back size={26} weight="bold" />
        </button>
        <h1 className="text-center text-lg font-extrabold">{title}</h1>
        <span className="w-6" />
      </header>

      <ul className="flex flex-col">
        {users.map((user) => {
          const isFollowing = followed[user.id];
          return (
            <li key={user.id} className="flex items-center gap-3 py-3">
              <EmojiAvatar emoji={user.emoji} bg={user.bg} className="size-14 text-2xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">{user.bio}</p>
              </div>
              <FollowButton
                active={isFollowing}
                onToggle={() =>
                  setFollowed((prev) => ({ ...prev, [user.id]: !prev[user.id] }))
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
