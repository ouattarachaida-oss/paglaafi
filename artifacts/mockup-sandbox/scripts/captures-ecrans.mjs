/**
 * Captures d'écran de non-régression visuelle (outil temporaire de la phase 1).
 *
 * Usage : node scripts/captures-ecrans.mjs <dossier-de-sortie> [url]
 *   - url par défaut : http://localhost:4173 (vite preview)
 *
 * Utilise le Chrome déjà installé sur la machine (channel "chrome") : aucun
 * navigateur Playwright n'est téléchargé. L'horloge du navigateur est figée
 * pour obtenir des images identiques d'une exécution à l'autre, et les tuiles
 * OpenStreetMap sont remplacées par une image vide.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.argv[2] || "captures");
const baseUrl = process.argv[3] || "http://localhost:4173";
mkdirSync(outDir, { recursive: true });

const LARGEUR = 412;
const HAUTEUR = 915;
const DATE_FIGEE = new Date("2026-10-26T09:00:00Z");
// PNG transparent 1x1 pour remplacer les tuiles de carte
const PNG_VIDE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

const PROFILS = {
  utilisatrice: "Aminata O.",
  centre: "Mme Sawadogo",
  docteur: "Dr. Sanou",
  association: "Dr. Sawadogo",
  superadmin: "Alimata Kaboré",
};

const SECTIONS_MENU = {
  accueil: "Accueil",
  centres: "Carte des Soins (OpenStreetMap)",
  cycle: "Règles & Autopalpation",
  comprendre: "Comprendre (Français · Anglais · Mooré · Dioula)",
  roseia: "Rose IA (Assistance Vocale)",
  annonces: "Annonces & Événements",
  accompagnant: "L'Accompagnant (À deux)",
};

// Options Chrome pour un rendu identique d'une exécution à l'autre
const browser = await chromium.launch({
  channel: "chrome",
  args: [
    "--disable-gpu",
    "--force-color-profile=srgb",
    "--disable-partial-raster",
    "--disable-skia-runtime-opts",
    "--font-render-hinting=none",
    "--disable-lcd-text",
  ],
});
const erreurs = [];
let page;

async function nouvelleSession() {
  if (page) await page.context().close();
  const context = await browser.newContext({
    viewport: { width: LARGEUR, height: HAUTEUR },
    deviceScaleFactor: 1,
    locale: "fr-FR",
    timezoneId: "Africa/Ouagadougou",
    serviceWorkers: "block",
    reducedMotion: "reduce",
  });
  await context.route(/tile\.openstreetmap\.org/, (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: PNG_VIDE }),
  );
  // Math.random déterministe (codes de reçu, d'orientation...)
  await context.addInitScript(() => {
    let graine = 42;
    Math.random = () => {
      graine = (graine * 16807) % 2147483647;
      return (graine - 1) / 2147483646;
    };
  });
  page = await context.newPage();
  page.on("pageerror", (e) => erreurs.push(`pageerror: ${e.message}`));
  await page.clock.install({ time: DATE_FIGEE });
  await page.clock.pauseAt(DATE_FIGEE);
  await page.goto(baseUrl, { waitUntil: "load" });
  await stabiliser();
}

/** Fait avancer l'horloge (toasts, réponses différées) et attend le rendu. */
async function avancer(ms) {
  await page.clock.runFor(ms);
  await page.waitForTimeout(150);
}

async function stabiliser() {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}

/**
 * Capture l'écran en agrandissant la fenêtre pour afficher tout le contenu
 * défilable du conteneur principal (et des modales ouvertes).
 */
async function capture(nom) {
  const hauteurContenu = await page.evaluate(() => {
    let extra = 0;
    document.querySelectorAll("*").forEach((el) => {
      const s = getComputedStyle(el);
      if ((s.overflowY === "auto" || s.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) {
        extra = Math.max(extra, el.scrollHeight - el.clientHeight);
      }
    });
    return extra;
  });
  const hauteur = Math.min(HAUTEUR + hauteurContenu, 9000);
  await page.setViewportSize({ width: LARGEUR, height: hauteur });
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, `${nom}.png`), animations: "disabled", caret: "hide" });
  await page.setViewportSize({ width: LARGEUR, height: HAUTEUR });
  await page.waitForTimeout(100);
}

const cliquerTexte = (texte, exact = false) => page.getByText(texte, { exact }).first().click();
const barreLaterale = () => page.locator("div.max-w-\\[325px\\]");

async function passerSplash() {
  await cliquerTexte("Passer", true);
  await avancer(100);
}

async function connecter(profil) {
  await passerSplash();
  await cliquerTexte(PROFILS[profil], true);
  await avancer(4000); // laisse disparaître le toast de bienvenue
}

async function allerA(section) {
  await page.getByLabel("Ouvrir le menu").click();
  await avancer(50);
  await barreLaterale().getByText(SECTIONS_MENU[section], { exact: true }).first().click();
  await avancer(1000);
  await stabiliser();
}

async function scenario(nom, fn) {
  try {
    await nouvelleSession();
    await fn();
    console.log(`✓ ${nom}`);
  } catch (e) {
    erreurs.push(`${nom}: ${e.message.split("\n")[0]}`);
    console.log(`✗ ${nom} : ${e.message.split("\n")[0]}`);
  }
}

// --- Démarrage & authentification ---------------------------------------
await scenario("splash", async () => capture("00-splash"));
await scenario("connexion", async () => {
  await passerSplash();
  await capture("01-connexion");
  await cliquerTexte("Créer un compte", true);
  await avancer(50);
  await capture("02-inscription");
});

// --- Toutes les sections pour chacun des 5 profils -----------------------
for (const profil of Object.keys(PROFILS)) {
  await scenario(`${profil} : sections`, async () => {
    await connecter(profil);
    await capture(`10-${profil}-accueil`);
    for (const section of Object.keys(SECTIONS_MENU).slice(1)) {
      await allerA(section);
      await capture(`11-${profil}-${section}`);
    }
    // Section Dons (uniquement via la barre de navigation du bas)
    await page.getByRole("navigation", { name: "Navigation principale" }).getByText("Faire un don").click();
    await avancer(500);
    await capture(`12-${profil}-dons`);
  });
  await scenario(`${profil} : menus`, async () => {
    await connecter(profil);
    await page.getByLabel("Ouvrir le menu").click();
    await avancer(50);
    await capture(`13-${profil}-menu-lateral`);
    await page.keyboard.press("Escape");
    await page.mouse.click(LARGEUR - 10, HAUTEUR / 2);
    await avancer(50);
    await page.locator("header button[title*='Cliquez pour gérer']").click();
    await avancer(50);
    await capture(`14-${profil}-menu-profil`);
  });
}

// --- Centres : liste et fiche détaillée -----------------------------------
await scenario("centres liste & fiche", async () => {
  await connecter("utilisatrice");
  await allerA("centres");
  await cliquerTexte(/^Liste \(/);
  await avancer(300);
  await capture("20-centres-liste");
  await cliquerTexte("Détails", true);
  await avancer(300);
  await capture("21-centre-fiche");
});

// --- Rose IA : échange de messages ----------------------------------------
await scenario("rose ia message", async () => {
  await connecter("utilisatrice");
  await allerA("roseia");
  await page.locator("form input, form textarea").last().fill("J'ai senti une boule dans le sein");
  await page.locator("form input, form textarea").last().press("Enter");
  await avancer(1500);
  await capture("22-roseia-reponse");
});

// --- Modales --------------------------------------------------------------
async function modaleDepuisMenu(profil, libelle, nom, suite) {
  await scenario(`modale ${nom}`, async () => {
    await connecter(profil);
    await page.getByLabel("Ouvrir le menu").click();
    await avancer(50);
    await barreLaterale().getByText(libelle).first().click();
    await avancer(300);
    await capture(`30-${nom}`);
    if (suite) await suite();
  });
}

await modaleDepuisMenu("superadmin", "Panneau Superadmin", "superadmin-stats", async () => {
  await cliquerTexte(/^📢 Annonces/);
  await avancer(100);
  await capture("30-superadmin-annonces");
  await cliquerTexte(/^🏥 Inscriptions/);
  await avancer(100);
  await capture("30-superadmin-inscriptions");
});
await modaleDepuisMenu("association", "Tableau de Bord Admin", "admin-tableau-de-bord");
await modaleDepuisMenu("docteur", "Entraîner Rose IA (Docteur)", "docteur-entrainement-1", async () => {
  await cliquerTexte("Passer à la formulation médicale (Étape 2) →");
  await avancer(100);
  await capture("30-docteur-entrainement-2");
  await cliquerTexte("Lancer la simulation en direct (Étape 3) →");
  await avancer(4000);
  await capture("30-docteur-entrainement-3");
  await cliquerTexte("Valider et passer à la signature (Étape 4) →");
  await avancer(100);
  await capture("30-docteur-entrainement-4");
});
await modaleDepuisMenu("docteur", "Orienter une Patiente", "orientation");
await modaleDepuisMenu("centre", "Mettre à jour mon centre sur la carte", "mise-a-jour-centre");
await modaleDepuisMenu("utilisatrice", "Faire un don", "don-1", async () => {
  await cliquerTexte(/^Valider le don de/);
  await avancer(100);
  await capture("30-don-2");
  await cliquerTexte("Autoriser le paiement", true);
  await avancer(4000);
  await capture("30-don-3");
  await cliquerTexte("Confirmer le don", true);
  await avancer(4000);
  await capture("30-don-4");
});
await modaleDepuisMenu("utilisatrice", "Confidentialité & Données", "confidentialite");
await modaleDepuisMenu("utilisatrice", "Installer l'App Mobile", "installation-pwa");

await scenario("modale vidéo autopalpation", async () => {
  await connecter("utilisatrice");
  await allerA("comprendre");
  await cliquerTexte("Regarder la vidéo démonstrative 🎬", true);
  await avancer(100);
  await capture("31-video-autopalpation");
});
await scenario("modale affiche & nouvelle annonce", async () => {
  await connecter("association");
  await allerA("annonces");
  await cliquerTexte(/Agrandir/);
  await avancer(100);
  await capture("32-affiche");
});
await scenario("modale nouvelle annonce", async () => {
  await connecter("association");
  await allerA("annonces");
  await cliquerTexte("+ Publier", true);
  await avancer(100);
  await capture("33-nouvelle-annonce");
});

await browser.close();
writeFileSync(path.join(outDir, "_erreurs.txt"), erreurs.join("\n") + "\n");
console.log(`\n${erreurs.length} erreur(s) — captures dans ${outDir}`);
