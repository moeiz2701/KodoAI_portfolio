import { footer, site, socials } from "@/lib/content";
import Button from "@/components/ui/Button";

/**
 * Footer (IMPLEMENTATION.md §10). Static in Phase 1 — the low-intensity
 * DotMatrix background and curtain reveal land in Phases 2/3.
 */
export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-border bg-surface">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-3">
          {/* NAVIGATION */}
          <div>
            <p className="eyebrow mb-6 flex items-center gap-2">
              <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
              {footer.navHeading}
            </p>
            <ul className="flex flex-col">
              {footer.nav.map((l) => (
                <li key={l.href} className="border-b border-dashed border-border">
                  <a
                    href={l.href}
                    className="block py-3 font-display text-5xl font-extrabold uppercase leading-none tracking-tight text-ink transition-colors hover:text-accent md:text-6xl"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* STUDIO DETAILS */}
          <div>
            <p className="eyebrow mb-6">{footer.detailsHeading}</p>
            <p className="mb-6 font-mono text-ink-2">
              <span className="text-accent">↳ </span>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-ink">
                {site.email}
              </a>
            </p>
            <div className="mb-10 text-ink-3">
              {site.location.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="eyebrow mb-3">{footer.ctaEyebrow}</p>
            <Button href="#footer" primary arrow>
              {footer.ctaLabel}
            </Button>
          </div>

          {/* SOCIALS */}
          <div>
            <p className="eyebrow mb-6">{footer.socialsHeading}</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="font-mono text-sm uppercase tracking-widest text-ink-2 transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* hairline + bottom bar */}
        <div className="mt-16 h-px w-full bg-border" aria-hidden />
        <div className="mt-6 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-widest text-ink-3 md:flex-row md:items-center md:justify-between">
          <span>{footer.copyright}</span>
          <span className="text-muted">{footer.tagline}</span>
          <a href="#top" className="transition-colors hover:text-accent">
            {footer.backToTop} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
