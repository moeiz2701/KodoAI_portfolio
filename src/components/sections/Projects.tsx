import { projects, projectsEyebrow } from "@/lib/content";
import Hairline from "@/components/ui/Hairline";

/**
 * Section 04 — PROJECTS / SUCCESS STORIES (IMPLEMENTATION.md §7).
 * Phase 1: sticky rail + static rows with poster placeholders. The
 * hover-to-play Cloudinary VideoCard and metric count-up arrive in Phase 5.
 */
export default function Projects() {
  return (
    <section id="projects" className="relative bg-bg py-24 md:py-32">
      <Hairline className="absolute inset-x-0 top-0" />
      <div className="shell grid gap-12 md:grid-cols-[200px_1fr]">
        {/* sticky left rail */}
        <div className="md:sticky md:top-[45vh] md:h-max">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
            {projectsEyebrow}
          </p>
        </div>

        {/* rows */}
        <div className="flex flex-col">
          {projects.map((p) => (
            <article
              key={p.n}
              className="grid gap-6 border-t border-dashed border-border-2 py-12 md:grid-cols-2 md:gap-10"
            >
              {/* media placeholder — Cloudinary video wired in Phase 5 */}
              <div className="relative aspect-video w-full overflow-hidden border border-border bg-surface-2">
                <span className="absolute bottom-3 left-3 font-mono text-[11px] uppercase tracking-widest text-ink-3">
                  ▶ WATCH
                </span>
              </div>

              {/* info */}
              <div className="flex flex-col">
                <p className="eyebrow mb-4">SS ↳ [{p.n}/04]</p>
                <h3 className="font-display text-[clamp(28px,3.5vw,44px)] font-extrabold uppercase leading-tight tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-ink-2">{p.desc}</p>
                <div className="mt-6 inline-flex w-max flex-col border border-border bg-surface px-5 py-4">
                  <span className="font-display text-4xl font-extrabold leading-none text-accent">
                    {p.metric.value}
                    {p.metric.unit ? ` ${p.metric.unit}` : ""}
                  </span>
                  <span className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-3">
                    {p.metric.label}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
