import React from "react";

interface CardV2Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "soft" | "bordered";
  children: React.ReactNode;
}

export function CardV2({
  variant = "default",
  children,
  className = "",
  ...props
}: CardV2Props) {
  const variantStyles = {
    default: "bg-white border border-[#E9E0E4] shadow-xs",
    elevated: "bg-white border border-[#E9E0E4] shadow-[0_8px_20px_rgba(41,37,42,0.06)]",
    soft: "bg-[#F5E8ED]/70 border border-[#E9E0E4]",
    bordered: "bg-white border-2 border-[#A14364]/20",
  }[variant];

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 transition-all duration-200 ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
