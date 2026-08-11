/**
 * Avatar — user/member avatar with initials fallback.
 * Email asosida DiceBear avatar, yo'q bo'lsa initsiallar.
 */
import React from "react";
import { cn } from "../../lib/utils";
import { getInitials, getAvatarUrl } from "../../lib/utils";

interface AvatarProps {
  name: string;
  email?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  email,
  src,
  size = "md",
  className,
}) => {
  const avatarSrc = src || (email ? getAvatarUrl(email) : null);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 border border-zinc-700",
        sizeClasses[size],
        className
      )}
    >
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium text-zinc-300">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};

export default Avatar;