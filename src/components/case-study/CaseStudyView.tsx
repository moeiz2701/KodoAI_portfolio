"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { CaseStudy, CSCard, CSHeading } from "@/lib/caseStudies";
import BookCallButton from "@/components/ui/BookCallButton";

gsap.registerPlugin(ScrollTrigger);

/**
 * Long-form case study page, rebuilt on kodoAI's design tokens (see
 * src/lib/caseStudies.ts for content). It keeps the source's section order
 * (hero → problem → what was built → how it works → ROI → outcomes → CTA) but
 * uses the site's own chrome: the shared Header (rendered by the route with a
 * single HOME link), the seamless `.depth-band` surface, big/bold headlines,
 * one accent, zero radius, and GSAP scroll reveals instead of Framer Motion.
 *
 * Reveal: every `.cs-reveal` element inside a `.cs-section` fades up on enter,
 * staggered. Reduced motion early-returns → everything renders static.
 */
export default function CaseStudyView({ cs }: { cs: CaseStudy }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // elements stay at their natural (visible) state

      gsap.utils.toArray<HTMLElement>(".cs-section").forEach((sec) => {
        const items = sec.querySelectorAll(".cs-reveal");
        if (!items.length) return;
        gsap.from(items, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sec, start: "top 82%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <main ref={root} className="depth-band text-ink">
      {/* ═══════════════  HERO  ═══════════════ */}
      <section className="cs-section relative overflow-hidden border-b border-border pt-40 pb-24 md:pt-48 md:pb-32">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[-3%] top-[16%] hidden select-none whitespace-nowrap font-display text-[24vw] font-black uppercase leading-[0.8] text-ink opacity-[0.03] lg:block"
        >
          {cs.ambient}
        </span>

        <div className="shell relative z-10">
          <Eyebrow className="cs-reveal">{"// CASE STUDY"}</Eyebrow>

          <h1 className="cs-reveal mt-8 font-display text-[clamp(48px,10vw,128px)] font-black uppercase leading-[0.86] tracking-tight text-ink">
            {cs.title}
            <br />
            <span className="text-muted">{cs.titleSub}</span>
          </h1>

          <p className="cs-reveal mt-10 max-w-3xl text-[17px] leading-relaxed text-ink-2 md:text-xl">
            {cs.lead}
          </p>

          <div className="cs-reveal mt-10 flex flex-wrap items-center gap-3 md:gap-4">
            {cs.meta.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-2 border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest"
              >
                <span className="text-ink-3">{m.label}</span>
                <span className="text-ink">{m.value}</span>
              </div>
            ))}
            {cs.rating && (
              <div className="flex items-center gap-1.5 border border-accent bg-surface px-4 py-2">
                <span className="text-[11px] leading-none text-accent" aria-hidden>
                  ★★★★★
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Upwork</span>
              </div>
            )}
          </div>

          <ul className="cs-reveal mt-8 flex flex-wrap gap-2">
            {cs.techStack.map((t) => (
              <li
                key={t}
                className="border border-border bg-surface px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-3 transition-colors hover:border-accent hover:text-ink"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══════════════  THE PROBLEM  ═══════════════ */}
      <section className="cs-section border-b border-border py-24 md:py-32">
        <div className="shell grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow className="cs-reveal mb-6">{"// THE PROBLEM"}</Eyebrow>
            <Heading
              h={cs.problem.heading}
              className="cs-reveal font-display text-[clamp(40px,6.5vw,88px)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink"
            />
          </div>
          <div className="space-y-6 lg:col-span-7">
            {cs.problem.body.map((p, i) => (
              <p key={i} className="cs-reveal text-base leading-[1.8] text-ink-2">
                {p}
              </p>
            ))}
            <div className="cs-reveal border border-border bg-surface p-6 md:p-8">
              <p className="text-lg italic leading-[1.7] text-ink">&ldquo;{cs.problem.quote}&rdquo;</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════  WHAT WAS BUILT / PIPELINE  ═══════════════ */}
      <section className="cs-section border-b border-border py-24 md:py-32">
        <div className="shell">
          <Eyebrow className="cs-reveal mb-6">{cs.built.eyebrow}</Eyebrow>
          <Heading h={cs.built.heading} className={SECTION_H} />
          <p className="cs-reveal mt-8 max-w-3xl text-base leading-relaxed text-ink-2">{cs.built.intro}</p>

          <div className={`mt-16 grid grid-cols-1 gap-0 sm:grid-cols-2 ${gridColsClass(cs.built.cards.length)}`}>
            {cs.built.cards.map((c) => (
              <FeatureCard key={c.num} card={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════  HOW IT WORKS  ═══════════════ */}
      <section className="cs-section border-b border-border py-24 md:py-32">
        <div className="shell">
          <Eyebrow className="cs-reveal mb-6">{cs.how.eyebrow}</Eyebrow>
          <Heading h={cs.how.heading} className={SECTION_H} />
          <p className="cs-reveal mt-8 max-w-3xl text-base leading-relaxed text-ink-2">{cs.how.intro}</p>

          <div className="mt-14">
            {cs.how.rows.map((r) => (
              <div key={r.num} className="cs-reveal group border-b border-border first:border-t">
                <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:gap-8">
                  <div className="flex items-start gap-4 md:col-span-5">
                    <span className="mt-1 shrink-0 font-mono text-xs tracking-[0.3em] text-ink-3">{r.num}</span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-accent md:text-3xl">
                      {r.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-[15px] leading-relaxed text-ink-2">{r.description}</p>
                    <TagRow tags={r.tags} className="mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════  ROI (optional)  ═══════════════ */}
      {cs.roi && (
        <section className="cs-section border-b border-border py-24 md:py-32">
          <div className="shell">
            <Eyebrow className="cs-reveal mb-6">{cs.roi.eyebrow}</Eyebrow>
            <Heading h={cs.roi.heading} className={SECTION_H} />
            <p className="cs-reveal mt-8 max-w-3xl text-base leading-relaxed text-ink-2">{cs.roi.intro}</p>

            <div className="mt-16 grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
              {cs.roi.cards.map((m) => (
                <div
                  key={m.title}
                  className="cs-reveal group border border-border bg-surface p-6 transition-colors hover:border-accent md:p-8"
                >
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-ink transition-colors group-hover:text-accent md:text-xl">
                    {m.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-2">{m.description}</p>
                  <div className="mt-6 border-t border-border pt-4">
                    <div className="font-display text-[clamp(28px,3.5vw,44px)] font-extrabold leading-none text-accent">
                      {m.metric}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-3">{m.metricLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════  OUTCOMES  ═══════════════ */}
      <section className="cs-section border-b border-border py-24 md:py-32">
        <div className="shell">
          <Eyebrow className="cs-reveal mb-6">{cs.outcomes.eyebrow}</Eyebrow>
          <h2 className="cs-reveal mb-16 font-display text-[clamp(52px,9vw,120px)] font-black uppercase leading-[0.86] tracking-tight text-ink">
            RESULTS<span className="text-accent">.</span>
          </h2>

          <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
            {cs.outcomes.metrics.map((o) => (
              <div key={o.label} className="cs-reveal border border-border bg-surface p-6 md:p-8">
                <div className="font-display text-[clamp(36px,5.5vw,64px)] font-black leading-none text-accent">
                  {o.value}
                </div>
                <div className="mt-3 font-display text-base font-bold uppercase tracking-wide text-ink md:text-lg">
                  {o.label}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-3">{o.sublabel}</div>
              </div>
            ))}
          </div>

          {cs.outcomes.checklist && (
            <div className="cs-reveal mt-12 border border-border bg-surface p-8">
              <ul className="space-y-4">
                {cs.outcomes.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-accent" aria-hidden>
                      ✓
                    </span>
                    <span className="text-[15px] leading-relaxed text-ink-2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════  CTA  ═══════════════ */}
      <section className="cs-section py-24 text-center md:py-36">
        <div className="shell">
          <Eyebrow className="cs-reveal mb-6 justify-center">{"// LET'S TALK"}</Eyebrow>
          <Heading
            h={cs.cta.heading}
            className="cs-reveal mx-auto font-display text-[clamp(48px,9vw,120px)] font-black uppercase leading-[0.86] tracking-tight text-ink"
          />
          <p className="cs-reveal mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink-2">{cs.cta.body}</p>
          <div className="cs-reveal mt-12 flex justify-center">
            <BookCallButton>{cs.cta.label}</BookCallButton>
          </div>
        </div>
      </section>
    </main>
  );
}

// -- shared styles & building blocks ------------------------------------------

/** Big/bold section headline, matching the site's Highlights/Footer scale. */
const SECTION_H =
  "cs-reveal font-display text-[clamp(44px,7.5vw,104px)] font-extrabold uppercase leading-[0.88] tracking-tight text-ink";

/** Mono `//` label with the accent bar, matching the footer eyebrow. */
function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-2 ${className}`}>
      <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
      {children}
    </p>
  );
}

/** Multi-line display heading; the tail line is accent or muted. */
function Heading({ h, className = "" }: { h: CSHeading; className?: string }) {
  return (
    <h2 className={className}>
      {h.lead.map((l) => (
        <span key={l} className="block">
          {l}
        </span>
      ))}
      <span className={`block ${h.tailAccent ? "text-accent" : "text-muted"}`}>{h.tail}</span>
    </h2>
  );
}

function TagRow({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((t) => (
        <li
          key={t}
          className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-3"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function FeatureCard({ card }: { card: CSCard }) {
  return (
    <div className="cs-reveal group border border-border bg-surface p-6 transition-colors hover:border-accent md:p-8">
      <span className="font-mono text-[11px] tracking-[0.35em] text-ink-3">{card.num}</span>
      <h3 className="mt-4 font-display text-2xl font-extrabold uppercase text-ink transition-colors group-hover:text-accent md:text-3xl">
        {card.title}
      </h3>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{card.description}</p>
      <TagRow tags={card.tags} className="mt-6" />
    </div>
  );
}

/** Third column only kicks in at lg for 3+ / 4-up card grids. */
function gridColsClass(n: number): string {
  return n >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
}
