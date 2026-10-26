/**
 * Demandes d'adhésion fictives présentées au Superadmin (démo).
 */

import type { PendingRegistration } from "../types";

/**
 * Inscriptions en attente pour le Superadmin
 */
export const initialPendingRegistrations: PendingRegistration[] = [
  {
    id: 101,
    structure: "Association Espoir Féminin Koudougou",
    responsable: "Mme Bado Aminata",
    telephone: "70 45 67 89",
    type: "Association",
    ville: "Koudougou",
    date: "15/10/2026",
    status: "pending",
  },
  {
    id: 102,
    structure: "Clinique Maternelle Yennenga",
    responsable: "Dr. Sanou Ibrahim",
    telephone: "76 12 34 56",
    type: "Centre de Santé",
    ville: "Ouagadougou",
    date: "14/10/2026",
    status: "pending",
  },
];
