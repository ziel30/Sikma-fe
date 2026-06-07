/**
 * Static profile data + avatar-decoration catalogue. Swap for backend/user
 * state once available.
 */
export interface Profile {
  name: string;
  userId: string;
  title: string;
  bio: string;
  likes: number;
  following: number;
  followers: number;
  level: number;
  xp: number;
  streak: number;
  joinedAt: string;
  rank: number;
}

export const PROFILE: Profile = {
  name: "Aziz Penjinak Naga",
  userId: "4637464969784",
  title: "Jack Of All Trade",
  bio: "Belum ada bio",
  likes: 0,
  following: 4,
  followers: 1,
  level: 20,
  xp: 12450,
  streak: 1,
  joinedAt: "22 Jan 2026",
  rank: 12,
};

export interface UserPreview {
  id: string;
  name: string;
  bio: string;
  emoji: string;
  bg: string;
  /** Whether the current user follows this person. */
  following: boolean;
}

export const FOLLOWING: UserPreview[] = [
  { id: "u1", name: "Caen", bio: "TangTang Has Your Back, But…", emoji: "🐧", bg: "bg-amber-200", following: true },
  { id: "u2", name: "Ronz", bio: "Thighs beat wings every time…", emoji: "🦊", bg: "bg-rose-200", following: true },
  { id: "u3", name: "Heretic X", bio: "•|[△]|•|[NAME'S]|•|[異端…", emoji: "🔺", bg: "bg-red-200", following: true },
  { id: "u4", name: "Sikma Math", bio: "Belajar matematika jadi seru!", emoji: "🦝", bg: "bg-brand-soft", following: true },
];

export const FOLLOWERS: UserPreview[] = [
  { id: "f1", name: "Eira Astarea", bio: "newbie math reader", emoji: "📚", bg: "bg-sky-200", following: false },
];

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  level: number;
}

export const FRIENDS: Friend[] = [
  { id: "fr1", name: "Frieren", emoji: "🧝‍♀️", bg: "bg-violet-200", level: 70 },
  { id: "fr2", name: "Yuu", emoji: "🩸", bg: "bg-red-200", level: 10 },
  { id: "fr3", name: "Frost", emoji: "🧑‍🦳", bg: "bg-green-200", level: 10 },
  { id: "fr4", name: "Meow", emoji: "🐱", bg: "bg-emerald-100", level: 10 },
  { id: "fr5", name: "Kai", emoji: "🧑", bg: "bg-sky-200", level: 10 },
  { id: "fr6", name: "Anie", emoji: "🧒", bg: "bg-amber-200", level: 10 },
];

export const FRIEND_SUGGESTIONS: Friend[] = [
  { id: "fs1", name: "Erin", emoji: "🧝", bg: "bg-fuchsia-200", level: 24 },
  { id: "fs2", name: "Naga Sakti", emoji: "🐉", bg: "bg-red-200", level: 59 },
  { id: "fs3", name: "Bintang Senja", emoji: "🌟", bg: "bg-amber-200", level: 33 },
  { id: "fs4", name: "Kilat Hitung", emoji: "⚡", bg: "bg-yellow-200", level: 18 },
];

export const FRIEND_REQUESTS: Friend[] = [
  { id: "rq1", name: "Heretic X", emoji: "🔺", bg: "bg-red-200", level: 41 },
  { id: "rq2", name: "Caen", emoji: "🐧", bg: "bg-amber-200", level: 12 },
];

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-lesson", name: "Langkah Pertama", emoji: "🌱", unlocked: true },
  { id: "streak-7", name: "Tujuh Hari", emoji: "⏳", unlocked: true },
  { id: "perfect", name: "Skor Sempurna", emoji: "💯", unlocked: false },
  { id: "speedster", name: "Si Cepat", emoji: "⚡", unlocked: false },
  { id: "collector", name: "Kolektor", emoji: "🏅", unlocked: false },
  { id: "master", name: "Master Angka", emoji: "👑", unlocked: false },
];

export interface Decoration {
  id: string;
  name: string;
  /** Tailwind gradient classes for the ring frame. */
  ring: string;
  locked: boolean;
}

export const DECORATIONS: Decoration[] = [
  { id: "welcome", name: "Selamat Datang", ring: "from-lime-400 to-emerald-400", locked: false },
  { id: "medal", name: "Medali Tantangan", ring: "from-yellow-400 to-green-400", locked: true },
  { id: "champion", name: "Juara Tantangan", ring: "from-amber-300 to-pink-300", locked: true },
  { id: "mifu", name: "Mi Fu", ring: "from-sky-400 to-pink-400", locked: false },
  { id: "gilberta", name: "Gilberta", ring: "from-orange-400 to-zinc-500", locked: true },
  { id: "laevatain", name: "Laevatain", ring: "from-fuchsia-500 to-red-500", locked: true },
  { id: "champion-2", name: "Juara Tantangan", ring: "from-amber-400 to-orange-400", locked: true },
  { id: "zhuang", name: "Zhuang Fangyi", ring: "from-red-400 to-emerald-400", locked: true },
  { id: "pass", name: "Medali Pass", ring: "from-teal-400 to-amber-300", locked: true },
];
