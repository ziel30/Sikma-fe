import { apiClient } from "@/lib/api/client";

export interface LeaderboardEntry {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  score: number;
  meta: string;
  rank: number;
}

export interface MyLeaderboardEntry {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  score: number;
  meta: string;
  rank: number | null;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  myEntry: MyLeaderboardEntry | null;
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  const { data } = await apiClient.get<LeaderboardResponse>("/learn/leaderboard");
  return data;
}
