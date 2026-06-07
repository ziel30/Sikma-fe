/**
 * Static learning-path data. Each materi is a sequence of nodes (lessons,
 * reward chests, a trophy) rendered as a winding path. Swap for backend data
 * once available.
 */
export type NodeStatus = "done" | "current" | "locked";
export type NodeKind = "lesson" | "chest" | "trophy";

export interface PathNode {
  id: string;
  kind: NodeKind;
  status: NodeStatus;
  /** Shown in the "start" popover for the active lesson. */
  title?: string;
  xp?: number;
}

export interface Materi {
  slug: string;
  label: string;
  subtitle: string;
  tone: "yellow" | "pink";
  nodes: PathNode[];
  /** Pointer to the next materi for the "continue" CTA. */
  next?: { slug: string; hint: string };
}

export const MATERI: Materi[] = [
  {
    slug: "postulat",
    label: "POSTULAT",
    subtitle: "Memahami dasar-dasar pembuktian",
    tone: "yellow",
    nodes: [
      { id: "l1", kind: "lesson", status: "done" },
      { id: "l2", kind: "lesson", status: "done" },
      {
        id: "l3",
        kind: "lesson",
        status: "current",
        title: "Pembulatan, penjumlahan, dan perkalian",
        xp: 20,
      },
      { id: "chest", kind: "chest", status: "locked" },
      { id: "l4", kind: "lesson", status: "locked" },
      { id: "trophy", kind: "trophy", status: "locked" },
    ],
    next: { slug: "aritmetika-2", hint: "Mempertajam intuisi tentang bilangan" },
  },
  {
    slug: "aritmetika-2",
    label: "ARITMETIKA 2",
    subtitle: "Mempelajari hubungan matematis",
    tone: "pink",
    nodes: [
      { id: "l1", kind: "lesson", status: "done" },
      {
        id: "l2",
        kind: "lesson",
        status: "current",
        title: "Mempelajari hubungan matematis",
        xp: 20,
      },
      { id: "l3", kind: "lesson", status: "locked" },
      { id: "chest", kind: "chest", status: "locked" },
      { id: "trophy", kind: "trophy", status: "locked" },
    ],
    next: { slug: "geometri", hint: "Mengenal bentuk dan ruang" },
  },
];

export function getMateri(slug: string): Materi | undefined {
  return MATERI.find((m) => m.slug === slug);
}
