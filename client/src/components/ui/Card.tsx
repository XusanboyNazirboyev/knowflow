/**
 * Card — surface container. Dark Academia variant.
 * CardHeader / CardBody / CardFooter subkomponentlar bilan.
 */
import React from "react";
import { cn } from "../../lib/utils";

export const Card: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div
    className={cn("border-b border-zinc-800/60 px-5 py-4", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardBody: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div className={cn("p-5", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "border-t border-zinc-800/60 px-5 py-3 flex items-center",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;