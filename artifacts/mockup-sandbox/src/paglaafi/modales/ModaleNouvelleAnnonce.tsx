import { useAnnonces } from "../etat/contextes";
import { Bandeau, Bouton, Champ, Feuille, ListeDeroulante, ZoneTexte } from "../composants/ui";

// Affiches des partenaires proposées en un appui
const AFFICHES = [
  { url: "/images/affiche-evenement-beneere.webp", legende: "Affiche Caravane BE NEERE FOR CAUSE", nom: "BE NEERE" },
  { url: "/images/affiche-wtm-odc.webp", legende: "Affiche Hackathon WTM & Orange Digital Center", nom: "WTM / ODC" },
  { url: "/images/affiche-genit-care.webp", legende: "Affiche Clinique GENIT CARE", nom: "GENIT CARE" },
];

/** Publication d'une annonce par une structure : elle part toujours en attente de validation. */
export function ModaleNouvelleAnnonce() {
  const { handlePublishAnnouncementSubmit, newAnnouncement: n, setNewAnnouncement, setShowNewAnnouncementModal, showNewAnnouncementModal } = useAnnonces();
  const maj = (champs: Partial<typeof n>) => setNewAnnouncement({ ...n, ...champs });

  return (
    <Feuille
      ouverte={showNewAnnouncementModal}
      onFermer={() => setShowNewAnnouncementModal(false)}
      titre="Publier une annonce"
      sousTitre="Soumise à la validation du superadmin"
      pied={
        <Bouton type="submit" form="form-nouvelle-annonce" taille="grand" pleineLargeur>
          Soumettre pour validation
        </Bouton>
      }
    >
      <form id="form-nouvelle-annonce" onSubmit={handlePublishAnnouncementSubmit} className="space-y-4">
        <Champ libelle="Titre de l'événement" required placeholder="Ex : Dépistage gratuit au marché…" value={n.title} onChange={(e) => maj({ title: e.target.value })} />
        <div className="grid gap-4 min-[420px]:grid-cols-2">
          <Champ libelle="Ville ou localité" value={n.city} onChange={(e) => maj({ city: e.target.value })} />
          <ListeDeroulante libelle="Mois concerné" value={n.month} onChange={(e) => maj({ month: e.target.value })}>
            <option value="Octobre 2026">Octobre 2026 (en cours)</option>
            <option value="Novembre 2026">Novembre 2026</option>
            <option value="Décembre 2026">Décembre 2026</option>
          </ListeDeroulante>
        </div>
        <Champ libelle="Date et heure" value={n.date} onChange={(e) => maj({ date: e.target.value })} />

        <fieldset className="space-y-3 rounded-carte border border-bordure p-3">
          <legend className="px-1 text-petit font-semibold text-prune-900">Affiche ou photo de l'événement</legend>
          <div className="flex flex-wrap gap-2">
            {AFFICHES.map((a) => (
              <button
                key={a.url}
                type="button"
                aria-pressed={n.imageUrl === a.url}
                onClick={() => maj({ imageUrl: a.url, imageCaption: a.legende })}
                className={`min-h-11 rounded-full px-4 text-petit font-semibold ${n.imageUrl === a.url ? "bg-carte-prune text-white" : "border border-bordure text-texte"}`}
              >
                {a.nom}
              </button>
            ))}
          </div>
          <Champ libelle="Ou lien de votre affiche" placeholder="https://…" value={n.imageUrl || ""} onChange={(e) => maj({ imageUrl: e.target.value })} />
          {n.imageUrl && <img src={n.imageUrl} alt="Aperçu de l'affiche" className="aspect-[16/9] w-full rounded-bouton object-cover" />}
        </fieldset>

        <ZoneTexte
          libelle="Description de l'événement"
          required
          rows={4}
          placeholder="Précisez le lieu exact, les bénéficiaires, la gratuité ou les subventions…"
          value={n.content}
          onChange={(e) => maj({ content: e.target.value })}
        />
        <Champ libelle="Contact téléphonique public" type="tel" placeholder="+226 70 00 00 00" value={n.contact} onChange={(e) => maj({ contact: e.target.value })} />
        <Bandeau ton="horsLigne">
          <strong>Règle de publication :</strong> pour garantir la véracité des informations médicales, votre annonce sera examinée et validée par le
          Superadmin National avant diffusion. Elle reste en attente de validation jusque-là.
        </Bandeau>
      </form>
    </Feuille>
  );
}
