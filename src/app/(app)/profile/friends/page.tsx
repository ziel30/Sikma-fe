"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { EmojiAvatar } from "@/shared/components/brand/emoji-avatar";
import { FollowButton } from "@/features/profile/components/follow-button";
import { Icons } from "@/shared/components/brand/icons";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  FRIENDS,
  FRIEND_REQUESTS,
  FRIEND_SUGGESTIONS,
  type Friend,
} from "@/features/profile/types";
import { cn } from "@/lib/utils";

type View = "friends" | "suggestions" | "requests";

export default function FriendsPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("friends");
  const [query, setQuery] = useState("");

  const [friends, setFriends] = useState<Friend[]>(FRIENDS);
  const [requests, setRequests] = useState<Friend[]>(FRIEND_REQUESTS);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [unfriendTarget, setUnfriendTarget] = useState<Friend>();

  const list = view === "suggestions" ? FRIEND_SUGGESTIONS : friends;
  const filtered = useMemo(
    () => list.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())),
    [list, query]
  );

  function confirmUnfriend() {
    if (!unfriendTarget) return;
    setFriends((prev) => prev.filter((f) => f.id !== unfriendTarget.id));
    setUnfriendTarget(undefined);
  }

  function acceptRequest(friend: Friend) {
    setFriends((prev) => [friend, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== friend.id));
  }

  function rejectRequest(friend: Friend) {
    setRequests((prev) => prev.filter((r) => r.id !== friend.id));
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col">
      {/* Purple header */}
      <header className="rounded-b-3xl bg-brand px-5 pt-4 pb-5 text-white">
        <div className="grid grid-cols-[auto_1fr_auto] items-center">
          <button onClick={() => router.back()} aria-label="Kembali">
            <Icons.back size={26} weight="bold" />
          </button>
          <h1 className="text-center text-xl font-extrabold">Teman</h1>
          <Icons.settings size={24} weight="regular" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-4 py-3 text-foreground">
          <Icons.search size={20} weight="bold" className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari…"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        {view !== "requests" && (
          <div className="mt-4 flex rounded-full bg-white/20 p-1">
            <SegTab
              active={view === "friends"}
              onClick={() => setView("friends")}
              icon={Icons.friends}
              label="Teman"
            />
            <SegTab
              active={view === "suggestions"}
              onClick={() => setView("suggestions")}
              icon={Icons.addFriend}
              label="Saran Teman"
            />
          </div>
        )}
      </header>

      <main className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-8">
        {view === "requests" ? (
          <>
            <button
              onClick={() => setView("friends")}
              className="flex items-center gap-1 text-sm font-bold text-brand"
            >
              <Icons.back size={16} weight="bold" /> Kembali ke teman
            </button>
            <h2 className="text-lg font-extrabold">
              Permintaan Berteman ({requests.length})
            </h2>
            {requests.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground">
                Tidak ada permintaan
              </p>
            ) : (
              requests.map((friend) => (
                <FriendCard key={friend.id} friend={friend}>
                  <div className="ml-auto flex gap-2">
                    <Button
                      onClick={() => acceptRequest(friend)}
                      className="h-9 rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand"
                    >
                      Terima
                    </Button>
                    <Button
                      onClick={() => rejectRequest(friend)}
                      variant="outline"
                      className="h-9 rounded-xl border-2 px-4 text-sm font-bold"
                    >
                      Tolak
                    </Button>
                  </div>
                </FriendCard>
              ))
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-amber-700">
                {view === "friends"
                  ? `Teman saya (${friends.length})`
                  : "Saran Teman"}
              </h2>
              {view === "friends" && (
                <button
                  onClick={() => setView("requests")}
                  className="relative rounded-full border-2 border-brand/40 px-4 py-1.5 text-sm font-bold text-brand"
                >
                  {requests.length > 0 && (
                    <span className="absolute -top-1 -left-1 size-3 rounded-full bg-pink-400" />
                  )}
                  Permintaan Berteman
                </button>
              )}
            </div>

            {filtered.map((friend) => (
              <FriendCard key={friend.id} friend={friend}>
                {view === "friends" ? (
                  <button
                    onClick={() => setUnfriendTarget(friend)}
                    className="ml-auto rounded-xl bg-amber-200 px-4 py-2 text-sm font-bold text-orange-500 transition-colors hover:bg-amber-300"
                  >
                    Unfriend
                  </button>
                ) : (
                  <FollowButton
                    active={Boolean(added[friend.id])}
                    onToggle={() =>
                      setAdded((prev) => ({ ...prev, [friend.id]: !prev[friend.id] }))
                    }
                    labelOff="Tambah"
                    labelOn="Terkirim"
                    className="ml-auto"
                  />
                )}
              </FriendCard>
            ))}

            {filtered.length === 0 && (
              <p className="py-10 text-center text-muted-foreground">
                Tidak ditemukan
              </p>
            )}
          </>
        )}
      </main>

      {/* Unfriend confirmation */}
      <Dialog
        open={Boolean(unfriendTarget)}
        onOpenChange={(open) => !open && setUnfriendTarget(undefined)}
      >
        <DialogContent className="max-w-xs rounded-3xl text-center">
          <DialogTitle className="text-xl font-extrabold">
            Konfirmasi Penghapusan
          </DialogTitle>
          <DialogDescription className="text-base">
            Kamu yakin ingin berhenti berteman dengan {unfriendTarget?.name}?
          </DialogDescription>
          <div className="mt-2 flex flex-col gap-2">
            <Button
              onClick={confirmUnfriend}
              className="h-12 rounded-2xl bg-brand text-base font-extrabold text-white hover:bg-brand"
            >
              Konfirmasi
            </Button>
            <Button
              onClick={() => setUnfriendTarget(undefined)}
              variant="outline"
              className="h-12 rounded-2xl border-2 text-base font-extrabold"
            >
              Batalkan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SegTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: (typeof Icons)["friends"];
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-bold transition-colors",
        active ? "bg-white text-brand" : "text-white"
      )}
    >
      <Icon size={18} weight="regular" />
      {label}
    </button>
  );
}

function FriendCard({
  friend,
  children,
}: {
  friend: Friend;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-amber-100 p-3">
      <EmojiAvatar emoji={friend.emoji} bg={friend.bg} className="size-14 text-2xl" />
      <div className="min-w-0">
        <p className="truncate font-extrabold text-amber-900">{friend.name}</p>
        <span className="mt-0.5 inline-block rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white italic">
          Level : {friend.level}
        </span>
      </div>
      {children}
    </div>
  );
}
