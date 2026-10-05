import { createContext } from "react";

import type { AuthUser, LoginCredentials, RegisterPayload } from "./types";

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
