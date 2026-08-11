/**
 * API Client — axios instance + interceptors
 * ============================================
 * Frontend ning barcha HTTP so'rovlari shu client orqali o'tadi.
 *
 * Nega axios?
 *   - Interceptors (token qo'shish, 401 -> logout) bitta joyda.
 *   - Response format standartlashtirilgan.
 *
 * Nega baseURL environment variable?
 *   - Dev: http://localhost:3000/api
 *   - Prod: https://api.knowflow.io/api
 *   - Faqat .env o'zgartiriladi, kod emas.
 */

import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";

// --- Standart javob formati (backend ham shu formatni qaytaradi) ---

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: {
        code: string;
        details?: Record<string, unknown>;
    };
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// --- Axios instance ---

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    timeout: 30000,
    withCredentials: true, // cookie (refresh token) uchun
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor yuqoridagi AxiosResponse wrapperini olib tashlaydi,
// shuning uchun API chaqiruvlari bevosita payload turini qaytaradi.
interface TypedApiClient {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// --- Request interceptor: har bir so'rovga access token qo'shadi ---

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// --- Response interceptor: data ni to'g'ridan-to'g'ri qaytaradi + 401 ni boshqaradi ---

let isRefreshing = false;

apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>) => {
        // Backend ApiResponse<T> formatida qaytaradi — biz .data.data ni olamiz
        return (response.data?.data ?? response.data) as unknown as AxiosResponse<
            ApiResponse<unknown>
        >;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 (token muddati o'tgan) — refresh qilib qayta urinish
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshing
        ) {
            isRefreshing = true;
            originalRequest._retry = true;

            try {
                const { data } = await axios.post<
                    ApiResponse<{ accessToken: string }>
                >(
                    `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );
                const newToken = data.data.accessToken;
                localStorage.setItem("access_token", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh ham ishlamadi — logout
                localStorage.removeItem("access_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Backend dan kelgan xatolikni standart formatda chiqarish
        const message =
            error.response?.data?.error?.details ||
            error.response?.data?.message ||
            "Tarmoqli xatosi";
        return Promise.reject(new Error(message));
    },
);

export default apiClient as unknown as TypedApiClient;

/**
 * FOYDALANISH:
 *
 *   import apiClient from "@/api/client";
 *
 *   const docs = await apiClient.get<Document[]>("/documents");
 *   const newDoc = await apiClient.post<Document>("/documents", { title });
 *   await apiClient.delete(`/documents/${id}`);
 *
 * Interceptor .data.data ni avtomat oladi — komponent toza bo'ladi.
 */
