import { apiClient } from "@/lib/api/client";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      roles: number;
    };
    accsess_token: string;
  };
  statusCode: number;
  message: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/learn/auth/login", payload);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/learn/auth/register", payload);
  return data;
}
