import {
  Check,
} from "lucide-react";
import { useUi } from "../etat/contextes";

/**
 * Notification temporaire (toast).
 */
export function Toast() {
  const { toast } = useUi();

  if (!(toast)) return null;

  return (
    <div
      role="status"
      className="ph-enter absolute bottom-[80px] left-4 right-4 z-40 flex items-start gap-2.5 rounded-2xl bg-[#4d2d3e] px-4 py-3 text-xs leading-5 text-white shadow-[0_10px_30px_rgba(40,18,30,.25)]"
    >
      <Check size={16} className="mt-0.5 shrink-0 text-[#f5bed0]" />
      <span className="flex-1">{toast}</span>
    </div>
  );
}
