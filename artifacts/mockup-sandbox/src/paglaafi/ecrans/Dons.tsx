import { Heart } from "lucide-react";
import { partnerAssociations } from "../donnees/associations";
import { useUi, useDons } from "../etat/contextes";

/**
 * Onglet Faire un don : associations partenaires.
 */
export function Dons() {
  const { section } = useUi();
  const { setSelectedAssociation, setShowDonationModal } = useDons();

  return (
    <section className="ph-enter px-5 pt-4">
      <span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a44666]">Solidarité · Burkina Faso</span>
      <h1 className="ph-display text-[26px] leading-tight text-[#580e36]">Faire un don</h1>
      <p className="mt-1 text-xs text-[#795f6d]">
        Votre contribution finance directement le dépistage et les soins de femmes sans revenus au Burkina Faso.
      </p>

      <div className="mt-3.5 rounded-[26px] border-2 border-rose-300 bg-gradient-to-br from-[#fff7f9] to-[#ffedf3] p-5 shadow-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ea2d6d] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          <Heart size={13} className="fill-white" /> 100% Solidaire & Sécurisé
        </span>

        <h3 className="ph-display mt-2 text-lg font-bold text-[#3d2430]">Offrir un examen de dépistage</h3>
        <p className="mt-1 text-xs text-[#684a58] leading-relaxed">
          Grâce à votre don de <strong>2 500 à 5 000 FCFA</strong>, une mère de famille vulnérable bénéficie
          immédiatement d'une consultation et d'une mammographie complète.
        </p>

        <div className="mt-4">
          <button
            onClick={() => setShowDonationModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ea2d6d] py-3 text-xs font-bold text-white shadow hover:bg-[#d81f5c] transition"
          >
            <Heart size={15} className="fill-white" /> Commencer mon don maintenant
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="ph-display text-sm font-bold text-[#580e36]">Associations partenaires éligibles</h3>
        <div className="mt-2 space-y-2">
          {partnerAssociations.map((assoc) => (
            <div key={assoc.id} className="rounded-2xl border border-[#eedde2] bg-white p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#580e36]">
                  {assoc.name} ({assoc.acronym})
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                  Vérifié
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#785b6a]">{assoc.mission}</p>
              <button
                onClick={() => {
                  setSelectedAssociation(assoc);
                  setShowDonationModal(true);
                }}
                className="mt-2 font-bold text-[#ea2d6d] hover:underline block text-[10.5px]"
              >
                Faire un don à {assoc.acronym} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
