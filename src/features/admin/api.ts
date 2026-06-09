import { apiClient } from "@/lib/api/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalTemplates: number;
  activeTemplates: number;
  totalThemes: number;
  totalMatches: number;
  rankedMatches: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: number;
  bio: string | null;
  avatarId: string;
  xp: number;
  coins: number;
  rankPoints: number;
  isBanned: boolean;
  createdAt: string;
}

export interface UsersPage {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserPayload {
  name?: string;
  roles?: number;
  xp?: number;
  coins?: number;
  rankPoints?: number;
  isBanned?: boolean;
}

export interface AdminTheme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  emoji: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  templateCount?: number;
}

export interface ThemePayload {
  name?: string;
  slug?: string;
  description?: string | null;
  emoji?: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AdminTemplate {
  id: string;
  topic: string;
  themeId: number | null;
  difficulty: number;
  displayTemplate: string;
  answerFormula: string;
  constraints: Record<string, [number, number]>;
  derived: Record<string, string> | null;
  isActive: boolean;
  theme?: { id: string; name: string; emoji: string; color: string } | null;
}

export interface TemplatePayload {
  topic?: string;
  themeId?: number | null;
  difficulty?: number;
  displayTemplate: string;
  answerFormula: string;
  constraints: Record<string, [number, number]>;
  derived?: Record<string, string> | null;
  isActive?: boolean;
}

export interface TemplatePreview {
  question: string;
  answer: number;
  variables: Record<string, number>;
}

export interface PointSettings {
  dailyTestExp: number;
  rankedWinExp: number;
  rankedLoseExp: number;
  rankedWinPoints: number;
  rankedLosePoints: number;
  rankedWinCoins: number;
  rankedLoseCoins: number;
  casualWinExp: number;
  casualLoseExp: number;
  casualWinCoins: number;
  casualLoseCoins: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<AdminStats>("/admin/stats");
  return data;
}

// ─── Users ─────────────────────────────────────────────────────────────────────

export async function listUsers(params: { search?: string; page?: number; limit?: number } = {}): Promise<UsersPage> {
  const { data } = await apiClient.get<UsersPage>("/admin/users", { params });
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
  const { data } = await apiClient.patch<AdminUser>(`/admin/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete(`/admin/users/${id}`);
  return data;
}

// ─── Themes ──────────────────────────────────────────────────────────────────

export async function listThemes(): Promise<AdminTheme[]> {
  const { data } = await apiClient.get<AdminTheme[]>("/admin/themes");
  return data;
}

export async function createTheme(payload: ThemePayload): Promise<AdminTheme> {
  const { data } = await apiClient.post<AdminTheme>("/admin/themes", payload);
  return data;
}

export async function updateTheme(id: string, payload: ThemePayload): Promise<AdminTheme> {
  const { data } = await apiClient.patch<AdminTheme>(`/admin/themes/${id}`, payload);
  return data;
}

export async function deleteTheme(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete(`/admin/themes/${id}`);
  return data;
}

// ─── Templates (formulas) ──────────────────────────────────────────────────────

export async function listTemplates(themeId?: number): Promise<AdminTemplate[]> {
  const { data } = await apiClient.get<AdminTemplate[]>("/admin/templates", {
    params: themeId ? { themeId } : {},
  });
  return data;
}

export async function createTemplate(payload: TemplatePayload): Promise<AdminTemplate> {
  const { data } = await apiClient.post<AdminTemplate>("/admin/templates", payload);
  return data;
}

export async function updateTemplate(id: string, payload: TemplatePayload): Promise<AdminTemplate> {
  const { data } = await apiClient.patch<AdminTemplate>(`/admin/templates/${id}`, payload);
  return data;
}

export async function deleteTemplate(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete(`/admin/templates/${id}`);
  return data;
}

export async function previewTemplate(payload: TemplatePayload): Promise<TemplatePreview> {
  const { data } = await apiClient.post<TemplatePreview>("/admin/templates/preview", payload);
  return data;
}

// ─── Point settings ────────────────────────────────────────────────────────────

export async function getPointSettings(): Promise<PointSettings> {
  const { data } = await apiClient.get<PointSettings>("/admin/settings/points");
  return data;
}

export async function updatePointSettings(payload: Partial<PointSettings>): Promise<PointSettings> {
  const { data } = await apiClient.patch<PointSettings>("/admin/settings/points", payload);
  return data;
}
