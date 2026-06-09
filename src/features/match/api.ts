import { apiClient } from "@/lib/api/client";
import type { StrikeInfo } from "@/features/strike/api";

export interface BotResult {
  xpGain: number;
  coinGain: number;
  dailyTestBonus: boolean;
  strike: StrikeInfo;
}

/**
 * Report a client-side bot (casual) match result so the backend records the
 * daily strike + casual EXP/coins. Returns the updated strike.
 */
export async function recordBotResult(won: boolean): Promise<BotResult> {
  const { data } = await apiClient.post<BotResult>("/learn/matches/bot-result", { won });
  return data;
}
