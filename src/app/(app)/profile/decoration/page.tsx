"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { DECORATIONS, type Decoration } from "@/features/profile/types";
import { cn } from "@/lib/utils";

export default function DecorationPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Decoration>();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-8">
      <header className="py-4">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="text-foreground"
        >
          <Icons.back size={26} weight="bold" />
        </button>
      </header>

      {/* Preview */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className={cn(
            "rounded-full p-1.5",
            selected
              ? `bg-linear-to-br ${selected.ring}`
              : "bg-transparent"
          )}
        >
          <Image
            src="/Logo.png"
            alt="Avatar"
            width={96}
            height={96}
            className="size-24 rounded-full bg-brand-soft ring-2 ring-background"
          />
        </div>
        <h1 className="mt-2 text-lg font-extrabold">
          {selected ? selected.name : "Tidak ada dekorasi yang sedang dipakai"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Pakai dekorasi avatarmu sekarang!
        </p>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {DECORATIONS.map((deco) => {
          const isActive = selected?.id === deco.id;
          return (
            <button
              key={deco.id}
              type="button"
              disabled={deco.locked}
              onClick={() => setSelected(deco)}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-2xl p-3 transition-colors",
                isActive ? "bg-brand-soft ring-2 ring-brand" : "bg-muted",
                deco.locked && "opacity-60"
              )}
            >
              <span
                className={cn("grid size-16 place-items-center rounded-full bg-linear-to-br p-1.5", deco.ring)}
              >
                <span className="size-full rounded-full bg-card" />
              </span>
              <span className="line-clamp-1 w-full text-center text-xs font-medium">
                {deco.name}
              </span>
              {deco.locked && (
                <Icons.lock
                  size={16}
                  weight="fill"
                  className="absolute right-2 bottom-9 text-muted-foreground"
                />
              )}
            </button>
          );
        })}
      </div>

      <PrimaryButton
        onClick={() => router.push("/profile")}
        disabled={!selected}
        className="mt-auto"
      >
        {selected ? "Pakai Dekorasi" : "Pilih Dekorasi"}
      </PrimaryButton>
    </div>
  );
}
