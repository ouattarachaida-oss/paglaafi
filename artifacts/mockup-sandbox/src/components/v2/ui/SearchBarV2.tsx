import { Search, X } from "lucide-react";

interface SearchBarV2Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBarV2({
  value,
  onChange,
  placeholder = "Rechercher un centre, une ville...",
  className = "",
}: SearchBarV2Props) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 text-[#716971] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#E9E0E4] bg-white pl-10 pr-9 py-2.5 text-xs sm:text-sm text-[#29252A] placeholder-[#989098] shadow-xs focus:border-[#A14364] focus:outline-none focus:ring-2 focus:ring-[#A14364]/15 transition"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-3 grid h-5 w-5 place-items-center rounded-full text-[#716971] hover:text-[#29252A] hover:bg-[#FAF2F5]"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
