import React, { useEffect } from "react";
import { X } from "lucide-react";
import { hapticFeedback } from "../utils/haptics";

interface ModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function ModalV2({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
}: ModalV2Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-2xl",
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        hapticFeedback(10);
        onClose();
      }}
    >
      <div
        className={`w-full ${widthStyles} max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-[#E9E0E4] text-[#29252A] animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E9E0E4] pb-3.5 mb-4">
          <div>
            <h3 id="modal-title" className="text-base sm:text-lg font-bold text-[#29252A] font-display">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#716971] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={() => {
              hapticFeedback(10);
              onClose();
            }}
            aria-label="Fermer la boîte de dialogue"
            className="grid h-8 w-8 place-items-center rounded-full text-[#716971] hover:text-[#29252A] hover:bg-[#FAF2F5] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
