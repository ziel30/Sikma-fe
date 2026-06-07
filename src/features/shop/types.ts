/**
 * Static shop catalogue. Avatars are placeholder emoji on coloured circles —
 * swap `emoji`/`bg` for real artwork once assets exist.
 */
export interface AvatarItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  /** Tailwind background class for the avatar circle. */
  bg: string;
}

export interface ShopSection {
  title: string;
  tone: "yellow" | "pink";
  items: AvatarItem[];
}

export const STARTING_COINS = 5000;

export const SHOP_SECTIONS: ShopSection[] = [
  {
    title: "Avatar Eksklusif",
    tone: "yellow",
    items: [
      {
        id: "meow",
        name: "Meow",
        description: "Si kucing penunggu keyboard",
        price: 1000,
        emoji: "🐱",
        bg: "bg-emerald-100",
      },
      {
        id: "erin",
        name: "Erin",
        description: "Gadis bermata rubi yang misterius",
        price: 1000,
        emoji: "🧝",
        bg: "bg-fuchsia-100",
      },
    ],
  },
  {
    title: "Pilihan Populer",
    tone: "pink",
    items: [
      {
        id: "kai-1",
        name: "Kai",
        description: "Kai dengan teman kecilnya",
        price: 1000,
        emoji: "🧑‍🦳",
        bg: "bg-green-200",
      },
      {
        id: "kai-2",
        name: "Kai",
        description: "Kai dan kucing bintang",
        price: 1000,
        emoji: "🧑",
        bg: "bg-sky-200",
      },
    ],
  },
];
