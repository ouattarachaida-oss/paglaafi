import {
  BarChart3,
  X,
} from "lucide-react";
import { useAdministration } from "../etat/contextes";

/**
 * Tableau de bord des administrateurs (dons et fréquentation, données de démo).
 */
export function TableauDeBordAdmin() {
  const { setShowAdminDashboardModal, showAdminDashboardModal } = useAdministration();

  if (!(showAdminDashboardModal)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:absolute sm:rounded-[36px]">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto border-2 border-[#522538]">
        <div className="flex items-center justify-between border-b border-[#f2e1e6] pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#522538] text-white">
              <BarChart3 size={18} className="text-rose-300" />
            </div>
            <div>
              <h3 className="ph-display text-sm font-bold text-[#351c2a]">Tableau de Bord Admin</h3>
              <p className="text-[10px] text-[#834f66] font-bold">Dons Orange Money & Statistiques</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminDashboardModal(false)}
            className="grid h-8 w-8 place-items-center rounded-full text-[#8a5b70] hover:bg-[#faedf1]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3">
            <p className="text-[9.5px] font-bold text-rose-800 uppercase">Dons collectés (OM)</p>
            <p className="text-base font-extrabold text-[#6c1543] mt-0.5">3 850 000 F</p>
            <p className="text-[9px] text-[#7d5164]">412 donateurs vérifiés</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
            <p className="text-[9.5px] font-bold text-emerald-800 uppercase">Examens financés</p>
            <p className="text-base font-extrabold text-emerald-700 mt-0.5">385 femmes</p>
            <p className="text-[9px] text-[#4d6a5c]">100% prises en charge</p>
          </div>
        </div>

        <div className="mt-3.5 border-t border-[#f2e1e6] pt-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-[#580e36]">Dernières collectes Orange Money :</p>
            <span className="text-[10px] text-[#f16e00] font-extrabold">#144#</span>
          </div>

          <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
            {[
              { id: "OM-ANON-904123", donor: "Donatrice anonyme (Chiffré AES)", amount: 10000, date: "Aujourd'hui 17h42", assoc: "ABAC" },
              { id: "OM-BF-893102", donor: "Ouedraogo A.", amount: 5000, date: "Aujourd'hui 15h18", assoc: "ABAC" },
              { id: "OM-ANON-872291", donor: "Donatrice anonyme (Chiffré AES)", amount: 25000, date: "Hier 19h10", assoc: "Beneere For A Cause" },
              { id: "OM-BF-861109", donor: "Traoré S.", amount: 2500, date: "14/10/2026", assoc: "GenitCare" },
              { id: "OM-BF-850012", donor: "Association WTM", amount: 50000, date: "13/10/2026", assoc: "WomenTech Makers" },
            ].map((tx) => (
              <div key={tx.id} className="rounded-xl border border-[#ebdbe2] bg-[#fffbfd] p-2 flex items-center justify-between text-[10.5px]">
                <div>
                  <span className="font-bold text-[#580e36]">{tx.donor}</span>
                  <p className="text-[9px] text-[#7a5969]">{tx.assoc} · {tx.date}</p>
                </div>
                <span className="font-bold text-[#f16e00]">+{tx.amount.toLocaleString("fr-FR")} F</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
