import { apiClient } from "@/lib/api/client";

export interface StrikeInfo {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
}

export async function getMyStrike(): Promise<StrikeInfo> {
  const { data } = await apiClient.get<StrikeInfo>("/learn/strikes/me");
  return data;
}
