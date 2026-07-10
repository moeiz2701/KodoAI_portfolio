import { nav, site } from "@/lib/content";
import Button from "@/components/ui/Button";

/**
 * Fixed nav (IMPLEMENTATION.md §3.4). Static in Phase 1 — the scroll
 * hide/show, blur-on-scroll and magnetic CTA arrive in later phases.
 */
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-6 py-6 md:px-12">
        {/* wordmark */}
        <a href="#top" className="flex items-center gap-2" aria-label={`${site.name} home`}>
          <span className="font-display text-2xl font-black leading-none tracking-tight">
            <span className="text-ink">{site.wordmark.light}</span>
            <span className="text-accent">{site.wordmark.accent}</span>
          </span>
          <span className="block h-[10px] w-[10px] bg-accent" aria-hidden />
        </a>

        {/* center nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="eyebrow transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Button href={site.cta.href} primary arrow>
          {site.cta.label}
        </Button>
      </div>
    </header>
  );
}
