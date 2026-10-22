import { useState } from "react";
import { Gift, Heart, ShieldCheck, CheckCircle2 } from "lucide-react";
import { hapticFeedback } from "../utils/haptics";
import { ModalV2 } from "../ui/ModalV2";
import { ButtonV2 } from "../ui/ButtonV2";

interface DonationModalV2Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModalV2({ isOpen, onClose }: DonationModalV2Props) {
  const [amount, setAmount] = useState<number>(5000);
  const [operator, setOperator] = useState<"orange" | "moov" | "card">("orange");
  const [phone, setPhone] = useState("70 12 34 56");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const predefinedAmounts = [2000, 5000, 10000, 25000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback(20);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <ModalV2
      isOpen={isOpen}
      onClose={onClose}
      title="Faire un don solidaire"
      subtitle="Fonds de soutien aux patientes vulnérables PagLaafi"
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3 animate-fade-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#EAF2ED] text-[#557A63] mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-[#29252A] font-display">
            Merci infiniment pour votre générosité !
          </h4>
          <p className="text-xs text-[#716971] max-w-xs mx-auto leading-relaxed">
            Votre contribution de <strong>{amount.toLocaleString("fr-FR")} FCFA</strong> a été validée. Elle permettra de financer le dépistage et la mammographie d'une femme démunie.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Montants suggérés */}
          <div>
            <label className="block font-bold text-[#29252A] mb-1.5">
              Choisissez un montant en FCFA :
            </label>
            <div className="grid grid-cols-4 gap-2">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    hapticFeedback(10);
                    setAmount(amt);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                    amount === amt
                      ? "bg-[#A14364] text-white shadow-xs"
                      : "bg-[#FAF2F5] text-[#29252A] border border-[#E9E0E4] hover:bg-[#F5E8ED]"
                  }`}
                >
                  {amt.toLocaleString("fr-FR")} F
                </button>
              ))}
            </div>
            {amount === 5000 && (
              <p className="text-[11px] text-[#557A63] font-semibold mt-1.5">
                💡 5 000 FCFA subventionne exactement 1 mammographie complète au CMA Schiphra.
              </p>
            )}
          </div>

          {/* Moyen de paiement */}
          <div>
            <label className="block font-bold text-[#29252A] mb-1.5">
              Moyen de paiement mobile :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "orange" as const, label: "Orange Money" },
                { key: "moov" as const, label: "Moov Money" },
                { key: "card" as const, label: "Carte Bancaire" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    hapticFeedback(10);
                    setOperator(key);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                    operator === key
                      ? "bg-[#29252A] text-white shadow-xs"
                      : "bg-white border border-[#E9E0E4] text-[#716971] hover:bg-[#FAF2F5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div>
            <label className="block font-bold text-[#29252A] mb-1">
              Numéro de compte Mobile Money :
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-[#E9E0E4] p-2.5 text-xs text-[#29252A] focus:outline-none focus:border-[#A14364]"
            />
          </div>

          {/* Option don anonyme */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF2F5]">
            <input
              type="checkbox"
              id="anon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-[#E9E0E4] text-[#A14364] focus:ring-[#A14364]"
            />
            <label htmlFor="anon" className="text-xs text-[#29252A] font-medium cursor-pointer">
              Garder mon don strictement anonyme
            </label>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E9E0E4]">
            <span className="text-xs text-[#716971] flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#557A63]" /> Paiement sécurisé
            </span>
            <ButtonV2 variant="primary" size="md" type="submit" icon={<Gift size={15} />}>
              Confirmer {amount.toLocaleString("fr-FR")} FCFA
            </ButtonV2>
          </div>
        </form>
      )}
    </ModalV2>
  );
}
