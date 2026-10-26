/**
 * Associations partenaires éligibles aux dons.
 *
 * ⚠️ Données de démonstration NON VÉRIFIÉES (statuts, tarifs, contacts, traductions) : à faire valider par des partenaires de santé avant toute publication.
 */

import type { PartnerAssociation } from "../types";

/**
 * Associations partenaires officielles éligibles aux dons & actions terrain
 */
export const partnerAssociations: PartnerAssociation[] = [
  {
    id: 1,
    name: "BE NEERE FOR CAUSE",
    acronym: "BE NEERE",
    mission: "Organisation burkinabè pionnière : cliniques mobiles de dépistage gratuit, sensibilisation de proximité et prise en charge des femmes en milieu rural et périurbain.",
    city: "Ouagadougou, Bobo & Centre-Nord",
    verified: true,
    beneficiariesCount: "2 800 femmes dépistées et accompagnées",
  },
  {
    id: 2,
    name: "WOMENTECHMAKERS & ORANGE DIGITAL CENTER",
    acronym: "WTM / ODC",
    mission: "Synergie d'innovation numérique et sociale : développement de solutions e-santé locales, vulgarisation technologique contre le cancer et ateliers de sensibilisation pour les femmes.",
    city: "Ouagadougou & Bobo-Dioulasso",
    verified: true,
    beneficiariesCount: "1 950 femmes formées et orientées",
  },
  {
    id: 3,
    name: "GENIT CARE BURKINA",
    acronym: "GENIT CARE",
    mission: "Centre de référence en santé génésique de la femme : consultations gynécologiques bienveillantes, dépistage précoce, bilans sénologiques et prise en charge de l'endométriose.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "3 200 examens et bilans réalisés",
  },
  {
    id: 4,
    name: "Fonds de Solidarité Patientes — CMA de Schiphra",
    acronym: "Fonds Schiphra",
    mission: "Subvention immédiate des mammographies, échographies et biopsies pour les patientes démunies adressées avec fiche d'orientation.",
    city: "Ouagadougou (Tanghin)",
    verified: true,
    beneficiariesCount: "620 examens pris en charge",
  },
  {
    id: 5,
    name: "Association Burkinabè d'Action contre le Cancer",
    acronym: "ABAC",
    mission: "Sensibilisation communautaire et plaidoyer pour l'accès universel aux traitements oncologiques au Burkina Faso.",
    city: "Ouagadougou",
    verified: true,
    beneficiariesCount: "1 450 femmes touchées",
  },
];
