/**
 * Tests de normalisation phonétique pour la synthèse vocale de Rose IA :
 * Évite les défauts de prononciation courants (« sœur » lu « sue » au lieu de « soeur »,
 * « Rose IA » lu « Rose ya », lecture d'astérisques Markdown, etc.).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normaliserTextePourVoix, trouverVoixFeminine } from "../../../src/paglaafi/lib/voix";

describe("normalisation phonétique pour la voix de Rose IA", () => {
  it("remplace la ligature œ par oe pour que « sœur » ne soit pas prononcé « sue »", () => {
    const entree = "Bonjour ma sœur bien-aimée, écoute la voix de ton cœur.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.match(sortie, /ma soeur/);
    assert.match(sortie, /ton coeur/);
    assert.doesNotMatch(sortie, /œ/);
  });

  it("gère les ligatures majuscules Œ", () => {
    const entree = "Œuvrons ensemble pour la santé des femmes.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.match(sortie, /Oeuvrons/);
    assert.doesNotMatch(sortie, /Œ/);
  });

  it("nettoie le balisage Markdown pour éviter la lecture des astérisques", () => {
    const entree = "Voici un conseil **très important** : pratique l'autopalpation *régulièrement*.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.equal(sortie, "Voici un conseil très important : pratique l'autopalpation régulièrement.");
  });

  it("nettoie les liens Markdown tout en conservant le texte", () => {
    const entree = "Consultez [le guide des 4 gestes](https://paglaafi.bf/guide) pour vous auto-examiner.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.equal(sortie, "Consultez le guide des 4 gestes pour vous auto-examiner.");
  });

  it("articule « Rose IA » en « Rose I-A » pour une diction claire", () => {
    const entree = "Je suis Rose IA, à votre écoute.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.match(sortie, /Rose I-A/);
  });

  it("articule « PagLaafi » en « Pag-Laafi »", () => {
    const entree = "Bienvenue sur l'application PagLaafi.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.match(sortie, /Pag-Laafi/);
  });

  it("remplace les tirets cadratins par une pause (virgule)", () => {
    const entree = "Le cancer du sein — détecté tôt — se guérit dans 9 cas sur 10.";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.match(sortie, /sein, détecté tôt, se guérit/);
  });

  it("gère correctement une chaîne vide ou blanche", () => {
    assert.equal(normaliserTextePourVoix("", "fr"), "");
  });

  it("corrige « ma sue » en « ma soeur » pour parer aux anomalies phonétiques", () => {
    const entree = "Bonjour ma sue, comment vas-tu ?";
    const sortie = normaliserTextePourVoix(entree, "fr");
    assert.match(sortie, /ma soeur/);
    assert.doesNotMatch(sortie, /ma sue/);
  });
});

describe("sélection de voix féminine pour Rose IA", () => {
  it("privilégie Microsoft Hortense ou Julie face à Microsoft Paul", () => {
    const faussesVoix = [
      { name: "Microsoft Paul - French (France)", lang: "fr-FR", localService: true, default: true, voiceURI: "" },
      { name: "Microsoft Hortense - French (France)", lang: "fr-FR", localService: true, default: false, voiceURI: "" },
      { name: "Microsoft Julie", lang: "fr-FR", localService: true, default: false, voiceURI: "" },
    ] as unknown as SpeechSynthesisVoice[];

    const choisie = trouverVoixFeminine("fr", faussesVoix);
    assert.equal(choisie?.name, "Microsoft Hortense - French (France)");
  });

  it("exclut formellement les voix masculines connues et sélectionne une voix féminine", () => {
    const faussesVoix = [
      { name: "Claude (Male)", lang: "fr-FR", localService: true, default: false, voiceURI: "" },
      { name: "Pierre (Homme)", lang: "fr-FR", localService: true, default: false, voiceURI: "" },
      { name: "Amélie", lang: "fr-FR", localService: true, default: false, voiceURI: "" },
    ] as unknown as SpeechSynthesisVoice[];

    const choisie = trouverVoixFeminine("fr", faussesVoix);
    assert.equal(choisie?.name, "Amélie");
  });
});
