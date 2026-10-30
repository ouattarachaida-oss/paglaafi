import { MessageCircle, MessageSquareText } from "lucide-react";
import { useLangue, useUi } from "../etat/contextes";
import { Bouton, Carte, choisirTexte, MentionTraduction, PucesLangue } from "../composants/ui";

// Conseils d'accompagnement (soutien, sans contenu médical)
const CONSEILS = [
  "Proposez une date et allez ensemble au centre de santé.",
  "Écoutez sans juger : la peur du dépistage est normale.",
  "Aidez à noter les questions à poser au soignant.",
];

/** L'Accompagnant : langue du message, aperçu, envoi par WhatsApp ou SMS (sans internet), 3 conseils. */
export function Accompagnant() {
  const { appShareUrl, notify, appLanguage } = useUi();
  const { handleSelectAppLanguage } = useLangue();
  // Messages d'invitation (texte français et traduction mooré inchangés)
  const choix = choisirTexte(
    {
      fr: `Bonjour ma soeur, je t'invite à faire notre dépistage du sein ensemble sur PagLaafi : ${appShareUrl}`,
      moore: `Ne y beogo m maaso, m boola fo tɩ d kẽng a yiibu n ges d yĩnsa laafi ne PagLaafi : ${appShareUrl}`,
    },
    appLanguage,
  );
  const message = choix.texte;

  return (
    <section className="anim-apparition">
      <h1 className="text-display text-prune-900">L'Accompagnant</h1>
      <p className="mt-1 text-corps text-texte-2">
        Aller faire son dépistage, c'est plus facile à deux. Invitez une proche par WhatsApp ou par SMS simple (sans connexion internet).
      </p>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Carte className="space-y-4">
          <div>
            <p className="mb-2 text-petit font-semibold text-prune-900">Langue du message</p>
            <PucesLangue valeur={appLanguage} onChange={handleSelectAppLanguage} libelle="Langue des contenus" />
          </div>
          <div>
            <p className="mb-2 text-petit font-semibold text-prune-900">Aperçu du message</p>
            <blockquote className="rounded-bouton bg-surface-2 p-3 text-corps text-texte" data-langue-contenu={choix.langue}>
              {message}
            </blockquote>
            {choix.manquante && <MentionTraduction langue={appLanguage} />}
          </div>
          <Bouton
            taille="grand"
            pleineLargeur
            icone={<MessageCircle size={20} aria-hidden />}
            onClick={() => {
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
              notify("Invitation WhatsApp prête à l'envoi.");
            }}
          >
            Envoyer par WhatsApp
          </Bouton>
          <Bouton
            variante="secondaire"
            pleineLargeur
            icone={<MessageSquareText size={20} aria-hidden />}
            onClick={() => {
              window.open(`sms:?body=${encodeURIComponent(message)}`, "_blank");
              notify("Application SMS ouverte pour envoi direct.");
            }}
          >
            Envoyer par SMS (sans internet)
          </Bouton>
        </Carte>

        <section aria-labelledby="titre-conseils">
          <h2 id="titre-conseils" className="mb-3 text-sous-titre text-prune-900">
            Bien accompagner
          </h2>
          <ol className="space-y-3">
            {CONSEILS.map((c, i) => (
              <li key={c} className="flex items-start gap-3 rounded-carte border border-bordure bg-surface p-4 shadow-carte">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 text-petit font-bold text-prune-900" aria-hidden>
                  {i + 1}
                </span>
                <p className="text-corps text-texte">{c}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
