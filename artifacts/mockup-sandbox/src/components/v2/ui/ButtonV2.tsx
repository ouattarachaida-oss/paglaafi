import React from "react";
import { hapticFeedback } from "../utils/haptics";

interface ButtonV2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "green";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function ButtonV2({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  onClick,
  ...props
}: ButtonV2Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    hapticFeedback(12);
    if (onClick) onClick(e);
  };

  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-5 py-3.5 text-sm sm:text-base gap-2.5 shadow-md",
  }[size];

  const variantStyles = {
    primary:
      "bg-[#A14364] text-white hover:bg-[#8E3655] shadow-sm hover:shadow",
    secondary:
      "bg-[#F5E8ED] text-[#A14364] hover:bg-[#ebd5df]",
    outline:
      "border border-[#E9E0E4] bg-white text-[#29252A] hover:bg-[#FAF2F5] hover:border-[#A14364]",
    ghost:
      "bg-transparent text-[#716971] hover:text-[#29252A] hover:bg-[#FAF2F5]",
    green:
      "bg-[#557A63] text-white hover:bg-[#436450] shadow-sm",
  }[variant];

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
