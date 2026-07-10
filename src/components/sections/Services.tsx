import { services, servicesEyebrow } from "@/lib/content";

/**
 * Section 05 — SERVICES (IMPLEMENTATION.md §8).
 * Phase 1: the giant stacked list, static and fully legible. The scroll/hover
 * focus effect (dim others, indent, floating preview) is wired in Phase 3.
 */
export default function Services() {
  return (
    <section id="services" className="relative border-t border-border bg-bg py-24 md:py-32">
      <div className="shell">
        <p className="eyebrow mb-16 flex items-center gap-2">
          <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
          {servicesEyebrow}
        </p>

        <ul className="flex flex-col">
          {services.map((s, i) => (
            <li key={s.title} className="border-t border-border py-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
                <span className="eyebrow shrink-0 text-accent">{`// 0${i + 1}`}</span>
                <h3 className="font-display text-[clamp(40px,7.5vw,120px)] font-extrabold uppercase leading-[1.02] tracking-tight text-ink">
                  {s.title}
                </h3>
              </div>
              <p className="mt-2 max-w-[52ch] text-ink-3 md:ml-[calc(3ch+1.5rem)]">{s.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
