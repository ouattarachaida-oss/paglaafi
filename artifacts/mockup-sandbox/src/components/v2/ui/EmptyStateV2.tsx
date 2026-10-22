import React from "react";

interface EmptyStateV2Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyStateV2({ icon, title, description, action }: EmptyStateV2Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-white border border-[#E9E0E4] shadow-xs my-4">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F5E8ED] text-[#A14364] mb-3">
        {icon}
      </div>
      <h4 className="text-sm sm:text-base font-bold text-[#29252A] mb-1 font-display">
        {title}
      </h4>
      <p className="text-xs text-[#716971] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
