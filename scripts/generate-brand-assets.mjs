// -----------------------------------------------------------------------------
// BRAND ASSET GENERATOR   ->   npm run assets
//
// Renders every icon / logo / placeholder the site and its off-site surfaces
// (browser tabs, home screens, email, SEO) need, from the vector geometry in
// brand.mjs. Everything is deterministic: delete public/brand, public/icons,
// public/avatars and re-run to rebuild byte-identical output.
//
// Text is rendered with the real Barlow Condensed / IBM Plex Mono TTFs in
// scripts/fonts (OFL, see OFL.txt). They are exposed to sharp's renderer through
// a throwaway fontconfig file, which is why sharp is imported dynamically —
// fontconfig reads its env vars the first time it initialises.
// -----------------------------------------------------------------------------

import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import {
  C,
  MARK,
  markShapes,
  iconSvg,
  markSvg,
  horizontalSvg,
  squareSvg,
  wordmarkText,
  maskSvg,
} from "./brand.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (...p) => path.join(root, "public", ...p);

// -- fontconfig ---------------------------------------------------------------
const fontDir = path.join(root, "scripts", "fonts").replace(/\\/g, "/");
const fcDir = path.join(os.tmpdir(), "kodoai-fontconfig");
mkdirSync(path.join(fcDir, "cache"), { recursive: true });
const fcFile = path.join(fcDir, "fonts.conf");
writeFileSync(
  fcFile,
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>
  <dir>${fontDir}</dir>
  <cachedir>${path.join(fcDir, "cache").replace(/\\/g, "/")}</cachedir>
</fontconfig>`,
);
process.env.FONTCONFIG_FILE = fcFile;
process.env.FONTCONFIG_PATH = fcDir;

const { default: sharp } = await import("sharp");

// -- helpers ------------------------------------------------------------------
const written = [];
const dir = (...p) => {
  mkdirSync(pub(...p), { recursive: true });
};
const png = async (svg, file, size) => {
  let img = sharp(Buffer.from(svg));
  if (size) img = img.resize(size, size, { fit: "contain" });
  await img.png({ compressionLevel: 9 }).toFile(pub(file));
  written.push(file);
};
const svgFile = (svg, file) => {
  writeFileSync(pub(file), svg.trim() + "\n");
  written.push(file);
};

/**
 * Measure a string's real ink box by rendering it oversized and trimming the
 * transparent margin. Returns the side bearing and ascent needed to place the
 * text so its ink lands exactly where the layout wants it — far more reliable
 * than deriving positions from nominal font metrics.
 */
async function measureText(text, { fontFamily, weight = 400, fontSize }) {
  const pad = Math.ceil(fontSize);
  const W = Math.ceil(fontSize * (text.length + 2) * 1.2);
  const H = Math.ceil(fontSize * 3);
  const baseline = Math.round(H * 0.7);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><text x="${pad}" y="${baseline}" font-family="${fontFamily}" font-weight="${weight}" font-size="${fontSize}" fill="#fff">${text}</text></svg>`;
  const { info } = await sharp(Buffer.from(svg)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const left = -info.trimOffsetLeft; // px cropped off the left
  const top = -info.trimOffsetTop;
  return {
    fontSize,
    inkW: info.width,
    inkH: info.height,
    lsb: left - pad, // left side bearing: ink starts this far after the anchor
    ascent: baseline - top, // ink top sits this far above the baseline
  };
}

/** Multi-size .ico (Vista+ format: each entry is a whole PNG). */
async function ico(sizes, file) {
  const images = await Promise.all(
    sizes.map((s) =>
      sharp(Buffer.from(iconSvg({ size: s * 4, pad: 0.12 })))
        .resize(s, s)
        .png({ compressionLevel: 9 })
        .toBuffer(),
    ),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = images.map((buf, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0); // width  (0 means 256)
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1); // height
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    return e;
  });
  writeFileSync(pub(file), Buffer.concat([header, ...entries, ...images]));
  written.push(file);
}

// Wordmark metrics, keyed by the cap height the layout wants. One reference
// measurement gives the cap-height-per-em ratio; everything else derives from it.
const REF = await measureText("KODOAI", { fontFamily: "Barlow Condensed", weight: 800, fontSize: 1000 });
const capRatio = REF.inkH / 1000;
const wm = (capH) =>
  measureText("KODOAI", {
    fontFamily: "Barlow Condensed",
    weight: 800,
    fontSize: Math.round(capH / capRatio),
  });

// -- 1. Browser tab / favicons ------------------------------------------------
dir("icons");
await ico([16, 32, 48], "favicon.ico");
// Scalable tab icon (Chrome/Firefox prefer this when offered).
svgFile(iconSvg({ size: 512, pad: 0.12 }), "icons/favicon.svg");
for (const s of [16, 32, 48, 64, 96, 128, 256]) {
  await png(iconSvg({ size: s * 4, pad: 0.12 }), `icons/favicon-${s}x${s}.png`, s);
}

// -- 2. Apple touch icon ------------------------------------------------------
// Opaque, no transparency, no rounding (iOS masks it itself), extra padding so
// the mark survives the corner mask.
await png(iconSvg({ size: 720, pad: 0.18 }), "icons/apple-touch-icon.png", 180);
await png(iconSvg({ size: 720, pad: 0.18 }), "icons/apple-touch-icon-152x152.png", 152);
await png(iconSvg({ size: 720, pad: 0.18 }), "icons/apple-touch-icon-167x167.png", 167);

// -- 3. Android / PWA ---------------------------------------------------------
for (const s of [192, 256, 384, 512]) {
  await png(iconSvg({ size: 1024, pad: 0.16 }), `icons/android-chrome-${s}x${s}.png`, s);
}
// Maskable: Android crops to a circle/squircle, so the mark must fit the inner
// 80% safe zone — hence the much larger padding.
for (const s of [192, 512]) {
  await png(iconSvg({ size: 1024, pad: 0.28 }), `icons/maskable-icon-${s}x${s}.png`, s);
}

// -- 4. Safari pinned tab (monochrome mask) -----------------------------------
svgFile(maskSvg(), "icons/safari-pinned-tab.svg");

// -- 5. Windows tiles ---------------------------------------------------------
for (const s of [70, 150, 310]) {
  await png(iconSvg({ size: 1240, pad: 0.2 }), `icons/mstile-${s}x${s}.png`, s);
}
// Wide tile: 310x150, mark left-aligned with the wordmark.
{
  const [w, h, markH] = [310, 150, 78];
  const scale = markH / MARK.h;
  const markW = MARK.w * scale;
  const m = await wm(48);
  const x = (w - (markW + 22 + m.inkW)) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${
    C.bg
  }"/><g transform="translate(${x} ${(h - markH) / 2}) scale(${scale})">${markShapes({
    neutral: C.ink,
    accent: C.accent,
  })}</g>${wordmarkText({ x: x + markW + 22, top: (h - m.inkH) / 2, m })}</svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pub("icons/mstile-310x150.png"));
  written.push("icons/mstile-310x150.png");
}

// -- 6. Website logos ---------------------------------------------------------
dir("brand");
// Icon-only (the mark on its own), full colour + both mono treatments.
svgFile(markSvg({ neutral: C.ink }), "brand/kodoai-mark-light.svg");
svgFile(markSvg({ neutral: C.bg }), "brand/kodoai-mark-dark.svg");
await png(markSvg({ neutral: C.ink, height: 1024 }), "brand/kodoai-mark-light.png");
await png(markSvg({ neutral: C.bg, height: 1024 }), "brand/kodoai-mark-dark.png");

// Horizontal lockups. "light" = light ink, for dark backgrounds; "dark" = dark
// ink, for light backgrounds. Transparent SVG + PNG of each.
{
  const [s, l] = [await wm(120), await wm(240)];
  svgFile(horizontalSvg({ markH: 200, m: s, neutral: C.ink, wordInk: C.ink }), "brand/kodoai-logo-horizontal-light.svg");
  svgFile(horizontalSvg({ markH: 200, m: s, neutral: C.bg, wordInk: C.bg }), "brand/kodoai-logo-horizontal-dark.svg");
  await png(horizontalSvg({ markH: 400, m: l, neutral: C.ink, wordInk: C.ink }), "brand/kodoai-logo-horizontal-light.png");
  await png(horizontalSvg({ markH: 400, m: l, neutral: C.bg, wordInk: C.bg }), "brand/kodoai-logo-horizontal-dark.png");
}

// Square lockups (mark over wordmark) — profile pictures, directory listings.
{
  const [s, l] = [await wm(88), await wm(176)];
  svgFile(squareSvg({ size: 512, m: s, bg: C.bg, neutral: C.ink, wordInk: C.ink }), "brand/kodoai-logo-square-light.svg");
  svgFile(squareSvg({ size: 512, m: s, bg: C.ink, neutral: C.bg, wordInk: C.bg }), "brand/kodoai-logo-square-dark.svg");
  await png(squareSvg({ size: 1024, m: l, bg: C.bg, neutral: C.ink, wordInk: C.ink }), "brand/kodoai-logo-square-light.png");
  await png(squareSvg({ size: 1024, m: l, bg: C.ink, neutral: C.bg, wordInk: C.bg }), "brand/kodoai-logo-square-dark.png");

  // -- 7. Structured data logo (schema.org Organization.logo) -----------------
  // Google wants a plain, opaque, square-ish logo, min 112px.
  await png(squareSvg({ size: 1024, m: l, bg: C.bg, neutral: C.ink, wordInk: C.ink }), "brand/kodoai-logo-seo.png", 512);
}

// -- 8. Email ----------------------------------------------------------------
// Email clients do not render SVG: PNG only, and drawn at 2x for retina.
await sharp(
  Buffer.from(
    horizontalSvg({ markH: 120, m: await wm(72), bg: C.bg, neutral: C.ink, wordInk: C.ink, pad: 0.38 }),
  ),
)
  .png({ compressionLevel: 9 })
  .toFile(pub("brand/kodoai-email-logo.png"));
written.push("brand/kodoai-email-logo.png");

{
  // 1200x400 header banner: mark beside the wordmark, tagline under, one accent
  // hairline along the bottom. Sized for the common 600px email column at 2x.
  const [w, h, markH] = [1200, 400, 150];
  const scale = markH / MARK.h;
  const markW = MARK.w * scale;
  const m = await wm(112);
  const tag = await measureText(
    "// IF IT&#39;S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED",
    { fontFamily: "IBM Plex Mono", weight: 500, fontSize: 19 },
  );
  const lockW = markW + 40 + m.inkW;
  const lockX = (w - lockW) / 2;
  const lockY = 108;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="4%" r="76%">
        <stop offset="0%" stop-color="${C.accent}" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="${C.bg}"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <g transform="translate(${lockX} ${lockY}) scale(${scale})">${markShapes({
      neutral: C.ink,
      accent: C.accent,
    })}</g>
    ${wordmarkText({ x: lockX + markW + 40, top: lockY + (markH - m.inkH) / 2, m })}
    <text x="${((w - tag.inkW) / 2 - tag.lsb).toFixed(2)}" y="${(lockY + markH + 54 + tag.ascent).toFixed(
      2,
    )}" font-family="IBM Plex Mono" font-weight="500" font-size="${tag.fontSize}" fill="${
      C.ink3
    }">// IF IT&#39;S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED</text>
    <rect x="0" y="${h - 6}" width="${w}" height="6" fill="${C.accent}"/>
  </svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pub("brand/kodoai-email-banner.png"));
  written.push("brand/kodoai-email-banner.png");
}

// -- 9. Testimonial avatars ---------------------------------------------------
// Deterministic block "portraits" in the brand language rather than stock faces:
// a mirrored 5x5 grid, one cell always accent. Assign any of them to any quote.
dir("avatars");
{
  const S = 256;
  const G = 5;
  const cell = S / G;
  const inks = [C.border, C.muted, C.ink3];
  for (let v = 0; v < 6; v++) {
    // Small deterministic LCG so a given avatar index always renders the same.
    let seed = (v + 1) * 2654435761;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    const cells = [];
    const grid = [];
    for (let y = 0; y < G; y++) {
      grid[y] = [];
      for (let x = 0; x < Math.ceil(G / 2); x++) grid[y][x] = rnd() > 0.45 ? 1 + Math.floor(rnd() * 3) : 0;
      for (let x = 0; x < G; x++) if (x >= Math.ceil(G / 2)) grid[y][x] = grid[y][G - 1 - x]; // mirror
    }
    const ax = Math.floor(rnd() * G);
    const ay = Math.floor(rnd() * G);
    for (let y = 0; y < G; y++) {
      for (let x = 0; x < G; x++) {
        const isAccent = x === ax && y === ay;
        if (!grid[y][x] && !isAccent) continue;
        const fill = isAccent ? C.accent : inks[(grid[y][x] - 1) % inks.length];
        cells.push(
          `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${fill}"/>`,
        );
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" fill="${
      C.surface2
    }"/>${cells.join("")}</svg>`;
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pub(`avatars/avatar-0${v + 1}.png`));
    written.push(`avatars/avatar-0${v + 1}.png`);
  }
}

// -- 10. Loading / placeholder images ----------------------------------------
// Shown while real media loads: brand surface, faint rule grid, ghosted mark.
dir("placeholder");
const ratios = { "16x9": [1600, 900], "4x3": [1200, 900], "1x1": [1000, 1000], "3x2": [1200, 800] };
for (const [name, [w, h]] of Object.entries(ratios)) {
  const markH = Math.min(w, h) * 0.26;
  const scale = markH / MARK.h;
  const step = Math.round(Math.min(w, h) / 12);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><pattern id="g" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
      <path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${C.border}" stroke-width="1"/>
    </pattern></defs>
    <rect width="${w}" height="${h}" fill="${C.surface}"/>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <g opacity="0.5" transform="translate(${(w - MARK.w * scale) / 2} ${(h - markH) / 2}) scale(${scale})">${markShapes(
      { neutral: C.border, accent: C.accentDim },
    )}</g>
  </svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pub(`placeholder/placeholder-${name}.png`));
  written.push(`placeholder/placeholder-${name}.png`);
}

// Tiny LQIP used as next/image blurDataURL — emitted as TS so it is typed and
// inlined at build time instead of costing a request.
{
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" fill="${C.surface}"/><rect x="10" y="5" width="5" height="5" fill="${C.accentDim}"/><rect x="17" y="5" width="5" height="11" fill="${C.border}"/><rect x="10" y="11" width="5" height="5" fill="${C.border}"/></svg>`;
  const buf = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  const file = path.join(root, "src", "lib", "placeholder.ts");
  writeFileSync(
    file,
    `// GENERATED by scripts/generate-brand-assets.mjs — do not edit by hand.
// Tiny branded LQIP for next/image \`placeholder="blur"\`.

export const blurDataURL =
  "data:image/png;base64,${buf.toString("base64")}";

/** Full-size branded placeholders, for posters and empty media slots. */
export const placeholders = {
  "16x9": "/placeholder/placeholder-16x9.png",
  "4x3": "/placeholder/placeholder-4x3.png",
  "3x2": "/placeholder/placeholder-3x2.png",
  "1x1": "/placeholder/placeholder-1x1.png",
} as const;
`,
  );
  written.push("../src/lib/placeholder.ts");
}

// -- 11. Keep the legacy header mark in sync ---------------------------------
// public/logo-mark.png predates this pipeline; regenerate it from the vector so
// anything still pointing at it matches.
await sharp(Buffer.from(markSvg({ neutral: C.muted, height: 1024 })))
  .png({ compressionLevel: 9 })
  .toFile(pub("logo-mark.png"));
written.push("logo-mark.png");

rmSync(path.join(fcDir, "cache"), { recursive: true, force: true });
console.log(`Generated ${written.length} assets:\n  ${written.join("\n  ")}`);
