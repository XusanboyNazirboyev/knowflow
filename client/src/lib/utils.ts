/**
 * Utility functions — UI helperlar (formatting, className merge)
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind classlarini birlashtirish (shadcn standarti) */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/** Byte -> "1.2 MB" formatga */
export function formatBytes(bytes: number, decimals = 1): string {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** ISO date -> "2 soat oldin", "kecha" kab. relative time */
export function relativeTime(date: string | Date): string {
    const now = Date.now();
    const target = new Date(date).getTime();
    const diff = Math.floor((now - target) / 1000);

    if (diff < 60) return "hozir";
    if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} kun oldin`;
    return new Date(date).toLocaleDateString("uz-UZ");
}

/** Ism -> "AB" initsiallar */
export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/** DiceBear avatar URL (email asosida) */
export function getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        seed,
    )}`;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
