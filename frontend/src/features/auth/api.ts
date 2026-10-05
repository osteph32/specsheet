import { apiRequest } from "../../api/client";
import type {
  AuthTokens,
  AuthUser,
  LoginCredentials,
  RefreshResponse,
  RegisterPayload,
} from "./types";

export function login(payload: LoginCredentials): Promise<AuthTokens> {
  return apiRequest<AuthTokens>("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refreshAccessToken(refresh: string): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>("/api/auth/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh }),
  });
}

export function getCurrentUser(accessToken: string): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/me/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function logout(accessToken: string, refresh: string): Promise<void> {
  return apiRequest<void>("/api/auth/logout/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refresh }),
  });
}
