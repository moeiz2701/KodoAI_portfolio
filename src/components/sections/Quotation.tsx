import { quotation } from "@/lib/content";
import type { ReactNode } from "react";

/**
 * Section 02 — QUOTATION (IMPLEMENTATION.md §5).
 * Phase 1: renders the resolved (final) state. The scrubbed word-by-word
 * highlight reveal is wired in Phase 3 via a splitWords() helper.
 */
function renderQuote(text: string, highlights: string[]): ReactNode[] {
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part, i) =>
    highlights.includes(part) ? (
      <span key={i} className="text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function Quotation() {
  return (
    <section id="quotation" className="relative flex min-h-screen items-center bg-bg">
      <div className="absolute inset-x-0 top-0 h-px bg-border" aria-hidden />
      <div className="shell">
        <p className="eyebrow mb-10">{quotation.eyebrow}</p>
        <blockquote className="max-w-[1100px] font-display text-[clamp(40px,6vw,96px)] font-extrabold uppercase leading-none tracking-tight text-ink">
          {renderQuote(quotation.text, quotation.highlights)}
        </blockquote>
        <p className="eyebrow mt-10">— {quotation.attribution}</p>
      </div>
    </section>
  );
}
