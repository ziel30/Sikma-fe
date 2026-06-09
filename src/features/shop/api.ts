import { apiClient } from "@/lib/api/client";

export interface ShopAvatarItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bg: string;
  price: number;
  owned: boolean;
  equipped: boolean;
}

export interface ShopResponse {
  coins: number;
  items: ShopAvatarItem[];
}

export async function getShopItems(): Promise<ShopResponse> {
  const { data } = await apiClient.get<ShopResponse>("/learn/shop/avatars");
  return data;
}

export async function buyAvatar(avatarId: string): Promise<{ message: string; coins: number }> {
  const { data } = await apiClient.post("/learn/shop/buy", { avatarId });
  return data;
}

export async function equipAvatar(avatarId: string): Promise<{ message: string; avatarId: string }> {
  const { data } = await apiClient.post("/learn/shop/equip", { avatarId });
  return data;
}
