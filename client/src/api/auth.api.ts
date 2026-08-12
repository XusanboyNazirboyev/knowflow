// /**
//  * Auth API — login, register, logout, me, refresh
//  * Frontend komponentlari faqat shu funksiyalarni chaqiradi.
//  */

// import apiClient from "./client";
// import type {
//     AuthResponse,
//     LoginPayload,
//     RegisterPayload,
//     User,
// } from "../types";

// export const authApi = {
//     /** Email + parol bilan kirish -> access token localStorage ga */
//     async login(payload: LoginPayload): Promise<AuthResponse> {
//         const res = await apiClient.post<AuthResponse>("/auth/login", payload);
//         localStorage.setItem("access_token", res.tokens.accessToken);
//         return res;
//     },

//     /** Yangi foydalanuvchi — email tasdiqlash kerak bo'lishi mumkin */
//     async register(payload: RegisterPayload): Promise<AuthResponse> {
//         const res = await apiClient.post<AuthResponse>(
//             "/auth/register",
//             payload,
//         );
//         localStorage.setItem("access_token", res.tokens.accessToken );
//         return res;
//     },

//     /** Google OAuth — backend /auth/google ga redirect qiladi */
//     loginWithGoogle(): void {
//         window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
//     },

//     /** Logout — access token ni o'chir, backend refresh cookie ni ham o'chiradi */
//     async logout(): Promise<void> {
//         try {
//             await apiClient.post("/auth/logout", {});
//         } finally {
//             localStorage.removeItem("access_token");
//         }
//     },

//     /** Jorii foydalanuvchi — app yuklanganda ishlatiladi */
//     async me(): Promise<User | null> {
//         try {
//             return await apiClient.get<User>("/auth/me");
//         } catch {
//             return null;
//         }
//     },

//     /** Refresh token — interceptor ichida avtomatik chaqiriladi */
//     async refresh(): Promise<{ accessToken: string }> {
//         return await apiClient.post("/auth/refresh", {});
//     },
// };

import apiClient from "./client";
import type { LoginPayload, RegisterPayload, User } from "../types";

export const authApi = {
    async login(payload: LoginPayload): Promise<{ user: User }> {
        return await apiClient.post<{ user: User }>("/auth/login", payload);
    },

    async register(payload: RegisterPayload): Promise<User> {
        console.log("YUBORILAYOTGAN PAYLOAD:", payload); // ← vaqtincha qo'shing
        try {
            return await apiClient.post<User>("/auth/register", payload);
        } catch (error: any) {
            console.log("BACKEND XATOSI:", error.response?.data); // ← vaqtincha qo'shing
            throw error;
        }
    },

    async logout(): Promise<void> {
        // Backend'da hali logout endpoint yo'q — keyingi qadamda qo'shamiz
    },

    async me(): Promise<User | null> {
        try {
            const res = await apiClient.get<{ user: User }>("/auth/me");
            return res.user;
        } catch {
            return null;
        }
    },
};