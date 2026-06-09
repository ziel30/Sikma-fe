import { apiClient } from "@/lib/api/client";

export interface AvatarDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bg: string;
  price: number;
}

export interface MyProfile {
  id: number;
  name: string;
  bio: string;
  avatarId: string;
  avatar: AvatarDef;
  xp: number;
  coins: number;
  rankPoints: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  streak: number;
  longestStreak: number;
  joinedAt: string;
  rank: number | null;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatarId?: string;
}

export async function getMyProfile(): Promise<MyProfile> {
  const { data } = await apiClient.get<MyProfile>("/learn/profile/me");
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<MyProfile> {
  const { data } = await apiClient.patch<MyProfile>("/learn/profile/me", payload);
  return data;
}

export async function getPublicProfile(userId: number): Promise<MyProfile> {
  const { data } = await apiClient.get<MyProfile>(`/learn/profile/${userId}`);
  return data;
}
