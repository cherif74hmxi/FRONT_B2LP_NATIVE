import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginUser, logoutUser } from "./api";
import type { AuthSession, Utilisateur } from "./types";

const STORAGE_KEY = "b2lp_auth_session";

type AuthContextValue = {
  initialized: boolean;
  token?: string;
  user?: Utilisateur;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function isAdminUser(user?: Utilisateur): boolean {
  // Le role vient de l'API Laravel. Le backend reste la vraie securite.
  return user?.role === "admin";
}

async function readStoredSession(): Promise<AuthSession | undefined> {
  const rawSession = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawSession) {
    return undefined;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<AuthSession | undefined>();

  useEffect(() => {
    let isMounted = true;

    readStoredSession()
      .then((storedSession) => {
        if (isMounted) {
          setSession(storedSession);
        }
      })
      .finally(() => {
        if (isMounted) {
          setInitialized(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await loginUser(email, password);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    const token = session?.access_token;

    if (token) {
      try {
        await logoutUser(token);
      } catch {
        // On nettoie quand meme la session locale si l'API ne repond pas.
      }
    }

    await AsyncStorage.removeItem(STORAGE_KEY);
    setSession(undefined);
  }, [session?.access_token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      token: session?.access_token,
      user: session?.user,
      isAuthenticated: Boolean(session?.access_token),
      isAdmin: isAdminUser(session?.user),
      login,
      logout,
    }),
    [initialized, login, logout, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans AuthProvider");
  }

  return context;
}
