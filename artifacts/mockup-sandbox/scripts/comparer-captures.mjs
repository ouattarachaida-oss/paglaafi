/**
 * Comparaison pixel par pixel de deux dossiers de captures (outil temporaire de la phase 1).
 *
 * Usage : node scripts/comparer-captures.mjs <dossier-avant> <dossier-apres> [dossier-diff]
 * Pour chaque image différente : nombre de pixels modifiés, zone concernée,
 * et image de différence (pixels modifiés en rouge) dans le dossier-diff.
 */
import { chromium } from "playwright";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const [avant, apres, diffDir = path.join(apres, "_diff")] = process.argv.slice(2).map((p) => path.resolve(p));
mkdirSync(diffDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.setContent("<canvas></canvas>");

let nbDiff = 0;
const fichiers = readdirSync(avant).filter((f) => f.endsWith(".png"));
for (const f of fichiers) {
  if (!existsSync(path.join(apres, f))) {
    console.log(`MANQUANTE ${f}`);
    nbDiff++;
    continue;
  }
  const a = readFileSync(path.join(avant, f));
  const b = readFileSync(path.join(apres, f));
  if (a.equals(b)) continue;

  const res = await page.evaluate(
    async ([da, db]) => {
      const charger = (src) =>
        new Promise((ok) => {
          const img = new Image();
          img.onload = () => ok(img);
          img.src = src;
        });
      const [ia, ib] = await Promise.all([charger(da), charger(db)]);
      const w = Math.max(ia.width, ib.width);
      const h = Math.max(ia.height, ib.height);
      const lire = (img) => {
        const c = new OffscreenCanvas(w, h);
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, w, h);
      };
      const pa = lire(ia);
      const pb = lire(ib);
      const out = new ImageData(w, h);
      let n = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let i = 0; i < pa.data.length; i += 4) {
        const diff =
          Math.abs(pa.data[i] - pb.data[i]) + Math.abs(pa.data[i + 1] - pb.data[i + 1]) + Math.abs(pa.data[i + 2] - pb.data[i + 2]);
        const p = i / 4;
        if (diff > 0) {
          n++;
          const x = p % w, y = Math.floor(p / w);
          x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
          out.data.set([255, 0, 0, 255], i);
        } else {
          const g = (pa.data[i] + pa.data[i + 1] + pa.data[i + 2]) / 3;
          out.data.set([g, g, g, 60], i);
        }
      }
      const c = new OffscreenCanvas(w, h);
      c.getContext("2d").putImageData(out, 0, 0);
      const blob = await c.convertToBlob({ type: "image/png" });
      const buf = new Uint8Array(await blob.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      return { n, tailles: `${ia.width}x${ia.height} / ${ib.width}x${ib.height}`, zone: n ? [x0, y0, x1, y1] : null, png: btoa(bin) };
    },
    [`data:image/png;base64,${a.toString("base64")}`, `data:image/png;base64,${b.toString("base64")}`],
  );
  if (res.n === 0) continue;
  nbDiff++;
  writeFileSync(path.join(diffDir, f), Buffer.from(res.png, "base64"));
  console.log(`DIFF ${f} : ${res.n} px, tailles ${res.tailles}, zone ${JSON.stringify(res.zone)}`);
}
await browser.close();
console.log(`\n${nbDiff} image(s) différente(s) sur ${fichiers.length}`);
process.exitCode = nbDiff ? 1 : 0;
