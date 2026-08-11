/**
 * Auth context — frontend global auth state.
 * Login bo'lganda user + token saqlanadi, logout tozalanadi.
 * React Context + useReducer — Redux ga muhtoj emas.
 */
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
      return {
        user: action.user,
        isAuthenticated: !!action.user,
        isLoading: false,
      };
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

  // App yuklanganda — token bo'lsa, me() bilan user ni tiklaymiz
  const initAuth = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      dispatch({ type: "SET_USER", user: null });
      return;
    }
    const user = await authApi.me();
    dispatch({ type: "SET_USER", user });
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    dispatch({ type: "SET_USER", user: res.user });
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const res = await authApi.register({ email, password, fullName });
      dispatch({ type: "SET_USER", user: res.user });
    },
    []
  );

  const loginWithGoogle = useCallback(() => {
    authApi.loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    dispatch({ type: "SET_USER", user: null });
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await authApi.me();
    dispatch({ type: "SET_USER", user });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, loginWithGoogle, logout, refreshUser }}
    >
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