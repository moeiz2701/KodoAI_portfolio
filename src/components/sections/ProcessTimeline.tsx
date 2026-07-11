import { process, processEyebrow } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

/**
 * Section 03 — PROCESS TIMELINE (IMPLEMENTATION.md §6).
 * Phase 1: the mobile-style vertical stack (which is also the ≤768px fallback).
 * The pinned horizontal-progress scrub timeline is built in Phase 4.
 */
export default function ProcessTimeline() {
  return (
    <section id="process" className="relative bg-bg py-24 md:py-32">
      <Hairline className="absolute inset-x-0 top-0" />
      <div className="shell">
        <p className="eyebrow mb-16 flex items-center gap-2">
          <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
          {processEyebrow}
        </p>

        <ol className="flex flex-col">
          {process.map((p) => (
            <li
              key={p.n}
              className="grid gap-6 border-t border-border py-12 md:grid-cols-[0.6fr_0.4fr] md:gap-12"
            >
              {/* left: ghost number with overlapping title */}
              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none block font-display font-black leading-none text-surface-3"
                  style={{ fontSize: "clamp(90px, 14vw, 220px)" }}
                >
                  {p.n}
                </span>
                <h3 className="mt-[-0.35em] font-display text-[clamp(36px,5vw,72px)] font-extrabold uppercase leading-none tracking-tight text-ink">
                  {p.title}
                </h3>
              </div>

              {/* right: body + mono chips */}
              <div className="flex flex-col gap-6">
                <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2">{p.body}</p>
                <ul className="flex flex-wrap gap-2">
                  {p.chips.map((c) => (
                    <li key={c} className="badge">
                      {`// ${c}`}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
