export type SplitWord = { text: string; highlight: boolean };

/**
 * Tiny word-splitter used by the Quotation reveal (IMPLEMENTATION.md §5 / decision #4).
 * Replaces the paid GSAP SplitText club plugin: splits `text` into words and flags
 * the ones that fall inside a highlight phrase (multi-word phrases stay per-word so
 * each still animates individually, they just resolve to the accent colour).
 */
export function splitWords(text: string, highlights: string[] = []): SplitWord[] {
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = escaped.length ? new RegExp(`(${escaped.join("|")})`, "g") : null;
  const parts = re ? text.split(re) : [text];

  const words: SplitWord[] = [];
  for (const part of parts) {
    if (!part) continue;
    const highlight = highlights.includes(part);
    for (const w of part.split(/\s+/)) {
      if (w) words.push({ text: w, highlight });
    }
  }
  return words;
}
