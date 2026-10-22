import React from "react";

interface BadgeV2Props {
  variant?: "rose" | "green" | "neutral" | "warning" | "outline";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function BadgeV2({
  variant = "rose",
  icon,
  children,
  className = "",
}: BadgeV2Props) {
  const variantStyles = {
    rose: "bg-[#F5E8ED] text-[#A14364] border border-[#F5E8ED]",
    green: "bg-[#EAF2ED] text-[#557A63] border border-[#EAF2ED]",
    neutral: "bg-[#F7F2EE] text-[#716971] border border-[#E9E0E4]",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    outline: "bg-white text-[#716971] border border-[#E9E0E4]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight select-none ${variantStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
