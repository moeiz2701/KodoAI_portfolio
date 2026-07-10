import { hero, site } from "@/lib/content";

/**
 * Section 01 — HERO (IMPLEMENTATION.md §4).
 * Phase 1: static composition. The DotMatrix canvas (§4.2) drops into the
 * background slot in Phase 2, and the wordmark entrance stagger follows.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Real heading for a11y — the giant wordmark below is decorative. */}
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>

      {/* background slot: DotMatrix canvas lands here in Phase 2 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* center block */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="spin-slow mb-6 text-2xl text-accent" aria-hidden>
          ✳
        </span>
        <p className="eyebrow mb-6">{hero.eyebrow}</p>
        <h2 className="mb-6 max-w-[18ch] font-display text-[clamp(32px,5vw,64px)] font-extrabold uppercase leading-[0.95] tracking-tight text-ink">
          {hero.headline}
        </h2>
        <p className="max-w-[480px] text-lg leading-relaxed text-ink-2 md:text-xl">{hero.sub}</p>
      </div>

      {/* giant wordmark pinned to the bottom edge, baseline clipped */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
        style={{ transform: "translateY(18%)" }}
      >
        <span
          className="font-display font-black leading-[0.75]"
          style={{ fontSize: "clamp(120px, 23vw, 420px)", letterSpacing: "-0.03em" }}
        >
          <span style={{ color: "var(--ink)", opacity: 0.85 }}>{site.wordmark.light}</span>
          <span style={{ color: "var(--accent)" }}>{site.wordmark.accent}</span>
        </span>
      </div>
    </section>
  );
}
