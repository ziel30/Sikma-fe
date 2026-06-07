/**
 * Static leaderboard data. Two boards (monthly / weekly) plus the current
 * user's standing. Swap for backend data once available.
 */
export interface RankEntry {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  score: number;
  meta: string;
}

export interface Board {
  id: "monthly" | "weekly";
  label: string;
  unit: string;
  entries: RankEntry[];
}

export const BOARDS: Board[] = [
  {
    id: "monthly",
    label: "Bulan Ini",
    unit: "XP",
    entries: [
      { id: "m1", name: "Naga Sakti", emoji: "🐉", bg: "bg-red-200", score: 65677, meta: "Aktif 26 hari" },
      { id: "m2", name: "Si Pengelana", emoji: "🧙", bg: "bg-violet-200", score: 24412, meta: "Aktif 26 hari" },
      { id: "m3", name: "Bintang Senja", emoji: "🌟", bg: "bg-amber-200", score: 22781, meta: "Aktif 25 hari" },
      { id: "m4", name: "Raja Aritmetika", emoji: "👑", bg: "bg-sky-200", score: 19452, meta: "Aktif 24 hari" },
      { id: "m5", name: "Angin Lewat", emoji: "🍃", bg: "bg-emerald-200", score: 12142, meta: "Aktif 22 hari" },
      { id: "m6", name: "Pelajar Tekun", emoji: "📚", bg: "bg-orange-200", score: 11360, meta: "Aktif 20 hari" },
      { id: "m7", name: "Meow Master", emoji: "🐱", bg: "bg-pink-200", score: 9870, meta: "Aktif 18 hari" },
      { id: "m8", name: "Kilat Hitung", emoji: "⚡", bg: "bg-yellow-200", score: 8120, meta: "Aktif 15 hari" },
    ],
  },
  {
    id: "weekly",
    label: "Minggu Ini",
    unit: "XP",
    entries: [
      { id: "w1", name: "Bintang Senja", emoji: "🌟", bg: "bg-amber-200", score: 4210, meta: "Aktif 7 hari" },
      { id: "w2", name: "Kilat Hitung", emoji: "⚡", bg: "bg-yellow-200", score: 3980, meta: "Aktif 7 hari" },
      { id: "w3", name: "Naga Sakti", emoji: "🐉", bg: "bg-red-200", score: 3540, meta: "Aktif 6 hari" },
      { id: "w4", name: "Meow Master", emoji: "🐱", bg: "bg-pink-200", score: 2890, meta: "Aktif 6 hari" },
      { id: "w5", name: "Angin Lewat", emoji: "🍃", bg: "bg-emerald-200", score: 2150, meta: "Aktif 5 hari" },
      { id: "w6", name: "Si Pengelana", emoji: "🧙", bg: "bg-violet-200", score: 1760, meta: "Aktif 4 hari" },
    ],
  },
];

export const CURRENT_USER = {
  name: "Aziz (Kamu)",
  emoji: "🦝",
  bg: "bg-brand-soft",
  meta: "Aktif 1 hari",
  score: 0,
  rank: null as number | null,
};
