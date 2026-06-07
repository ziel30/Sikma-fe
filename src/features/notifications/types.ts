/**
 * Static notification data. Swap for backend/realtime data once available.
 */
export type NotifType =
  | "achievement"
  | "friend"
  | "lesson"
  | "leaderboard"
  | "system"
  | "shop";

export interface AppNotification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "friend",
    title: "Permintaan teman baru",
    body: "Heretic X ingin berteman denganmu.",
    time: "2 mnt lalu",
    read: false,
  },
  {
    id: "n2",
    type: "achievement",
    title: "Pencapaian terbuka!",
    body: "Kamu meraih “Tujuh Hari” — streak 7 hari beruntun.",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: "n3",
    type: "leaderboard",
    title: "Peringkat naik",
    body: "Kamu naik ke peringkat #12 di Papan Peringkat bulan ini.",
    time: "3 jam lalu",
    read: false,
  },
  {
    id: "n4",
    type: "lesson",
    title: "Saatnya belajar!",
    body: "Lanjutkan topik Aritmetika 2 untuk menjaga streak-mu.",
    time: "Kemarin",
    read: true,
  },
  {
    id: "n5",
    type: "shop",
    title: "Avatar baru tersedia",
    body: "Koleksi avatar eksklusif menanti di Shop.",
    time: "2 hari lalu",
    read: true,
  },
  {
    id: "n6",
    type: "system",
    title: "Selamat datang di SIKMA",
    body: "Mulai perjalanan belajar matematikamu sekarang.",
    time: "3 hari lalu",
    read: true,
  },
];
