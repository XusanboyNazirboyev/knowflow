import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.api";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "SET_USER"; user: User | null }
  | { type: "SET_LOADING"; isLoading: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { user: action.user, isAuthenticated: !!action.user, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cookie-based auth: har doim me()ni so'raymiz, "token bormi" deb tekshirmaymiz
  const initAuth = useCallback(async () => {
    const user = await authApi.me();
    dispatch({ type: "SET_USER", user });
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const user = await authApi.login({ email, password });
    dispatch({ type: "SET_USER", user });
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      await authApi.register({ email, password, fullName });
      const user = await authApi.login({ email, password });
      dispatch({ type: "SET_USER", user });
    },
    [],
  );

  const loginWithGoogle = useCallback(() => {
    alert("Google orqali kirish hozircha ishlab chiqilmoqda");
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch({ type: "SET_USER", user: null });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await authApi.me();
    dispatch({ type: "SET_USER", user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
