"use client";

import { useState } from "react";

import { EmmaShine } from "@/shared/components/brand/emma";
import { BottomNav } from "@/shared/components/layout/bottom-nav";
import { Coin } from "@/shared/components/brand/coin";
import { Icons } from "@/shared/components/brand/icons";
import { PrimaryButton } from "@/shared/components/brand/primary-button";
import { Sparkles } from "@/shared/components/brand/sparkles";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import {
  SHOP_SECTIONS,
  STARTING_COINS,
  type AvatarItem,
  type ShopSection,
} from "@/features/shop/types";
import { cn } from "@/lib/utils";

const rupiah = (n: number) => n.toLocaleString("id-ID");

export default function ShopPage() {
  const [coins, setCoins] = useState(STARTING_COINS);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<AvatarItem>();
  const [purchased, setPurchased] = useState<AvatarItem>();

  function buy(item: AvatarItem) {
    if (owned.has(item.id) || coins < item.price) return;
    setCoins((c) => c - item.price);
    setOwned((prev) => new Set(prev).add(item.id));
    setSelected(undefined);
    setPurchased(item);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-4 pt-5 pb-28">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Shop</h1>
        <div className="flex items-center gap-2 rounded-full bg-brand/15 py-1 pr-4 pl-1">
          <Coin className="size-7 text-sm" />
          <span className="font-extrabold text-brand">{rupiah(coins)}</span>
        </div>
      </header>

      <HeroBanner />

      {SHOP_SECTIONS.map((section) => (
        <SectionCard
          key={section.title}
          section={section}
          owned={owned}
          onSelect={setSelected}
        />
      ))}

      <BottomNav />

      <ItemDetailDrawer
        item={selected}
        owned={selected ? owned.has(selected.id) : false}
        coins={coins}
        onOpenChange={(open) => !open && setSelected(undefined)}
        onBuy={buy}
      />

      <PurchaseSuccessDialog
        item={purchased}
        onOpenChange={(open) => !open && setPurchased(undefined)}
      />
    </div>
  );
}

function HeroBanner() {
  return (
    <section className="relative min-h-36 overflow-hidden rounded-3xl bg-brand p-5 text-white">
      <span className="absolute -bottom-4 left-0 size-24 rounded-full bg-white/10" />
      <p className="relative z-10 max-w-[58%] text-xl leading-snug font-extrabold">
        Belajar Seru,
        <br />
        Dapat Hadiah,
        <br />
        Tampil Keren!
      </p>
      <Icons.sparkle
        size={34}
        weight="fill"
        className="absolute top-8 left-[52%] text-accent-yellow"
      />
      <Icons.sparkle
        size={20}
        weight="fill"
        className="absolute right-6 bottom-8 text-accent-yellow"
      />
      <div className="absolute right-1 -bottom-2 flex h-full items-end">
        <div className="absolute right-3 bottom-3 size-28 rounded-full bg-accent-yellow" />
        <EmmaShine className="relative w-40" />
      </div>
    </section>
  );
}

function SectionCard({
  section,
  owned,
  onSelect,
}: {
  section: ShopSection;
  owned: Set<string>;
  onSelect: (item: AvatarItem) => void;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl p-4",
        section.tone === "yellow" ? "bg-amber-100" : "bg-pink-100"
      )}
    >
      <h2 className="mb-3 text-lg font-extrabold">{section.title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {section.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            tone={section.tone}
            owned={owned.has(item.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

function ItemCard({
  item,
  tone,
  owned,
  onSelect,
}: {
  item: AvatarItem;
  tone: ShopSection["tone"];
  owned: boolean;
  onSelect: (item: AvatarItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="overflow-hidden rounded-2xl bg-card text-left shadow-sm ring-1 ring-foreground/10"
    >
      <div
        className={cn(
          "relative grid place-items-center py-5",
          tone === "yellow" ? "bg-accent-yellow" : "bg-card"
        )}
      >
        {tone === "yellow" && (
          <Icons.sparkle
            size={18}
            weight="fill"
            className="absolute top-2 right-2 text-white/80"
          />
        )}
        <Avatar item={item} className="size-20 text-4xl" />
      </div>
      <div
        className={cn(
          "p-3",
          tone === "pink" && "border-t border-pink-200"
        )}
      >
        <p className="font-extrabold">{item.name}</p>
        {tone === "yellow" ? (
          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-sm font-extrabold text-white italic">
            <Coin /> {rupiah(item.price)}
          </span>
        ) : (
          <span className="mt-1 flex items-center gap-1.5 font-extrabold">
            <Coin /> {rupiah(item.price)}
          </span>
        )}
        {owned && (
          <span className="mt-1 block text-xs font-bold text-brand">
            ✓ Dimiliki
          </span>
        )}
      </div>
    </button>
  );
}

function Avatar({ item, className }: { item: AvatarItem; className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full",
        item.bg,
        className
      )}
    >
      {item.emoji}
    </span>
  );
}

function ItemDetailDrawer({
  item,
  owned,
  coins,
  onOpenChange,
  onBuy,
}: {
  item: AvatarItem | undefined;
  owned: boolean;
  coins: number;
  onOpenChange: (open: boolean) => void;
  onBuy: (item: AvatarItem) => void;
}) {
  const affordable = item ? coins >= item.price : false;

  return (
    <Drawer open={Boolean(item)} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-md">
        {item && (
          <div className="px-5 pt-2 pb-8">
            <DrawerTitle className="sr-only">{item.name}</DrawerTitle>
            <div className="grid place-items-center rounded-2xl p-6 ring-1 ring-foreground/10">
              <Avatar item={item} className="size-40 text-7xl" />
            </div>
            <Badge className="mt-5 bg-pink-100 text-pink-600">Avatar</Badge>
            <h2 className="mt-3 text-3xl font-extrabold">{item.name}</h2>
            <p className="mt-1 text-lg text-muted-foreground">
              {item.description}
            </p>

            <PrimaryButton
              onClick={() => onBuy(item)}
              disabled={owned || !affordable}
              className="mt-6 gap-2 normal-case"
            >
              {owned ? (
                "Sudah Dimiliki"
              ) : !affordable ? (
                "Koin Tidak Cukup"
              ) : (
                <>
                  <Coin className="size-6 text-sm" /> {rupiah(item.price)}
                </>
              )}
            </PrimaryButton>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="mt-2 h-14 w-full rounded-2xl border-2 text-base font-extrabold"
              >
                Batal
              </Button>
            </DrawerClose>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function PurchaseSuccessDialog({
  item,
  onOpenChange,
}: {
  item: AvatarItem | undefined;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl text-center">
        {item && (
          <>
            <div className="relative mx-auto size-28">
              <Sparkles />
              <Avatar item={item} className="size-28 text-5xl" />
            </div>
            <DialogTitle className="text-xl leading-snug font-extrabold">
              Yeay! Avatar barumu siap dipakai!
            </DialogTitle>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-2 text-base font-extrabold"
                >
                  Batal
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button className="h-12 rounded-2xl bg-brand text-base font-extrabold text-white hover:bg-brand">
                  Lihat
                </Button>
              </DialogClose>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
