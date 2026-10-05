import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshAccessToken,
  register as registerRequest,
} from "./api";
import { AuthContext } from "./AuthContext";
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
} from "./tokenStorage";
import type { AuthUser, LoginCredentials, RegisterPayload } from "./types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function restoreSession(): Promise<void> {
      const storedRefreshToken = getRefreshToken();

      if (!storedRefreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const tokens = await refreshAccessToken(storedRefreshToken);

        // Refresh-token rotation may return a replacement refresh token.
        if (tokens.refresh) {
          setRefreshToken(tokens.refresh);
        }

        const currentUser = await getCurrentUser(tokens.access);

        setAccessToken(tokens.access);
        setUser(currentUser);
      } catch {
        clearRefreshToken();
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    void restoreSession();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const tokens = await loginRequest(credentials);

      setRefreshToken(tokens.refresh);

      const currentUser = await getCurrentUser(tokens.access);

      setAccessToken(tokens.access);
      setUser(currentUser);
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<void> => {
      await registerRequest(payload);

      // Registration and authentication remain separate backend concerns.
      // After account creation, log in using the credentials the user supplied.
      await login({
        username: payload.username,
        password: payload.password,
      });
    },
    [login],
  );

  const logout = useCallback(async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    try {
      if (accessToken && refreshToken) {
        await logoutRequest(accessToken, refreshToken);
      }
    } finally {
      // Local authentication state must be cleared even if the server is
      // temporarily unreachable during logout.
      clearRefreshToken();
      setAccessToken(null);
      setUser(null);
    }
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: user !== null && accessToken !== null,
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, accessToken, isInitializing, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
