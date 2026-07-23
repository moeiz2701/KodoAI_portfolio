// -----------------------------------------------------------------------------
// BRAND GEOMETRY + SVG BUILDERS
// Single source of truth for every generated asset (see generate-brand-assets.mjs).
// The mark was vectorised from the original public/logo-mark.png: four rounded
// squares on a 2x2 grid, the top-left one in accent green, the right column
// merged into one shape by a bridge on its left edge (that is the notch/slit).
//
// The React mirror of these exact shapes lives in src/components/ui/LogoMark.tsx —
// keep the two in sync if the geometry ever changes.
// -----------------------------------------------------------------------------

/** Palette — mirrors the :root tokens in src/app/globals.css. */
export const C = {
  bg: "#0c0c0b",
  surface: "#141412",
  surface2: "#1a1a18",
  border: "#2a2a26",
  ink: "#f4f3ee",
  ink3: "#8a887e",
  muted: "#5e5c52",
  accent: "#c8f060",
  accentDim: "#6a802e",
};

/** Mark geometry, in the mark's own 674 x 670 user space. */
export const MARK = {
  w: 674,
  h: 670,
  box: 324, // square side
  r: 80, // corner radius
  col2: 350, // x of the right column
  row2: 346, // y of the bottom row
  bridgeW: 66, // width of the piece welding the right column into one shape
};

/**
 * The four boxes as raw <rect> markup. `neutral` paints the three grey blocks,
 * `accent` the single highlighted one. Pass the same colour for both to get the
 * monochrome silhouette (Safari mask icon).
 */
export function markShapes({ neutral, accent }) {
  const { box, r, col2, row2, bridgeW } = MARK;
  return [
    `<rect x="${col2}" y="0" width="${box}" height="${box}" rx="${r}" fill="${neutral}"/>`,
    `<rect x="${col2}" y="${row2}" width="${box}" height="${box}" rx="${r}" fill="${neutral}"/>`,
    // Bridge: straightens the right column's left edge across the gap between the
    // two boxes, leaving only the horizontal slit that gives the mark its shape.
    // It has to span both corner arcs (box-r .. row2+r) or the arcs curving away
    // from its square corners leave a step in the edge.
    `<rect x="${col2}" y="${box - r}" width="${bridgeW}" height="${row2 - box + r * 2}" fill="${neutral}"/>`,
    `<rect x="0" y="${row2}" width="${box}" height="${box}" rx="${r}" fill="${neutral}"/>`,
    `<rect x="0" y="0" width="${box}" height="${box}" rx="${r}" fill="${accent}"/>`,
  ].join("");
}

/**
 * Square icon: the mark centred on a canvas of `size`, with `pad` fraction of
 * breathing room per side. `bg` null → transparent.
 */
export function iconSvg({ size = 512, pad = 0.16, bg = C.bg, neutral = C.ink, accent = C.accent } = {}) {
  const inner = size * (1 - pad * 2);
  const scale = inner / Math.max(MARK.w, MARK.h);
  const w = MARK.w * scale;
  const h = MARK.h * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${
    bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ""
  }<g transform="translate(${x} ${y}) scale(${scale})">${markShapes({ neutral, accent })}</g></svg>`;
}

/** Icon-only logo, tight to the mark, no padding, transparent. */
export function markSvg({ neutral = C.ink, accent = C.accent, height = 670 } = {}) {
  const scale = height / MARK.h;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(MARK.w * scale)}" height="${Math.round(
    height,
  )}" viewBox="0 0 ${MARK.w} ${MARK.h}">${markShapes({ neutral, accent })}</svg>`;
}

/**
 * The KODO + AI wordmark as an SVG <text> node, positioned so its *ink* box
 * starts exactly at (x, top). Callers pass metrics measured at render time
 * (see measureText in generate-brand-assets.mjs) rather than guessing at the
 * font's side bearings, which is what keeps the lockups tight.
 */
export function wordmarkText({ x, top, m, wordInk = C.ink, accent = C.accent }) {
  return `<text x="${(x - m.lsb).toFixed(2)}" y="${(top + m.ascent).toFixed(
    2,
  )}" font-family="Barlow Condensed" font-weight="800" font-size="${m.fontSize}" fill="${wordInk}">KODO<tspan fill="${accent}">AI</tspan></text>`;
}

/**
 * Horizontal lockup: mark, then the wordmark, optically centred on the mark.
 * `markH` drives everything; the canvas is sized to the measured ink box.
 */
export function horizontalSvg({
  markH = 200,
  m,
  bg = null,
  neutral = C.ink,
  accent = C.accent,
  wordInk = C.ink,
  pad = 0.3,
} = {}) {
  const scale = markH / MARK.h;
  const markW = MARK.w * scale;
  const gap = markH * 0.3;
  const padX = markH * pad;
  const padY = markH * pad * 0.66;
  const w = Math.round(padX * 2 + markW + gap + m.inkW);
  const h = Math.round(padY * 2 + markH);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${
    bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""
  }<g transform="translate(${padX} ${padY}) scale(${scale})">${markShapes({ neutral, accent })}</g>
${wordmarkText({ x: padX + markW + gap, top: padY + (markH - m.inkH) / 2, m, wordInk, accent })}</svg>`;
}

/** Square lockup: mark stacked over the wordmark, for profile tiles / SEO. */
export function squareSvg({ size = 512, m, bg = C.bg, neutral = C.ink, accent = C.accent, wordInk = C.ink } = {}) {
  const markH = size * 0.38;
  const scale = markH / MARK.h;
  const markW = MARK.w * scale;
  const markY = (size - markH - size * 0.1 - m.inkH) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${
    bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ""
  }<g transform="translate(${(size - markW) / 2} ${markY}) scale(${scale})">${markShapes({ neutral, accent })}</g>
${wordmarkText({ x: (size - m.inkW) / 2, top: markY + markH + size * 0.1, m, wordInk, accent })}</svg>`;
}

/**
 * Safari pinned-tab mask: one solid black silhouette, no fills or extra attrs
 * (Safari recolours it itself). Uses a 16x16 viewBox per Apple's guidance.
 */
export function maskSvg() {
  const scale = 16 / MARK.w;
  const yOff = (16 - MARK.h * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g transform="translate(0 ${yOff.toFixed(
    3,
  )}) scale(${scale.toFixed(6)})">${markShapes({ neutral: "black", accent: "black" })}</g></svg>`;
}
