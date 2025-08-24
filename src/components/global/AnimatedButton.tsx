import React from "react";

import { cn } from "@/lib/utils";
import { AnimatedButtonProps } from "@/types";
import { Button } from "@/components/ui/button";

const sizeClasses: Record<
  Exclude<AnimatedButtonProps["size"], null | undefined>,
  string
> = {
  sm: "px-3 py-1 text-sm",
  lg: "px-8 py-4 text-xl",
  icon: "p-2 text-lg",
  default: "px-6 py-2 text-base",
};

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  baseColor = "bg-green-500",
  hoverColor = "hover:bg-green-600",
  size = "default",
  ...props
}) => (
  <Button
    className={cn(
      "transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg cursor-pointer",
      baseColor,
      hoverColor,
      sizeClasses[size ?? "default"],
      className
    )}
    size={size}
    {...props}
  >
    {children}
  </Button>
);
