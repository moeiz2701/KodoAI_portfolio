import { faq, faqEyebrow, faqIntro } from "@/lib/content";

/**
 * Section 06 — Q&A (IMPLEMENTATION.md §9).
 * Phase 1: accessible native <details> accordion (no JS). The Framer Motion
 * height-auto animation and single-open behaviour are added in Phase 6.
 */
export default function FAQ() {
  return (
    <section id="faq" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="shell grid gap-12 md:grid-cols-[0.4fr_0.6fr]">
        {/* left sticky header */}
        <div className="md:sticky md:top-32 md:h-max">
          <h2 className="font-display text-[clamp(36px,5vw,56px)] font-extrabold uppercase leading-none tracking-tight text-ink">
            Questions,
            <br />
            Answered
          </h2>
          <p className="eyebrow mt-6">{faqEyebrow}</p>
          <p className="mt-3 text-ink-3">{faqIntro}</p>
        </div>

        {/* right accordion */}
        <div className="flex flex-col">
          {faq.map((item) => (
            <details key={item.q} className="group border-t border-border py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl font-bold uppercase tracking-tight text-ink md:text-[28px] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 font-sans text-2xl text-ink-3 transition-transform duration-300 group-open:rotate-45 group-open:text-accent"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[60ch] text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
