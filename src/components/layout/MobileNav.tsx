"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { footer, site, socials, type NavLink } from "@/lib/content";
import BookCallButton from "@/components/ui/BookCallButton";
import LogoMark from "@/components/ui/LogoMark";

/**
 * Mobile navigation (md:hidden). A hamburger in the header opens a full-screen,
 * footer-styled menu: giant Barlow Condensed links, studio contact, socials and
 * the booking CTA. Opening stops Lenis + locks scroll; an anchor link restarts
 * it and smooth-scrolls to its section, a route link (e.g. "/") just navigates.
 * The reveal is CSS-transition driven so the global prefers-reduced-motion
 * kill-switch (globals.css) degrades it to static.
 *
 * `links` / `homeHref` default to the single-page footer nav; case study pages
 * pass a single HOME link so the mobile menu matches their header.
 */
export default function MobileNav({
  links = footer.nav,
  homeHref = "#top",
}: {
  links?: NavLink[];
  homeHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();

  // Portal target only exists on the client.
  useEffect(() => setMounted(true), []);

  // While open: freeze the page (Lenis if present, native overflow otherwise)
  // and close on Escape. Cleanup restores scroll on close/unmount.
  useEffect(() => {
    if (!open) return;
    if (lenis) lenis.stop();
    else document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lenis) lenis.start();
      else document.body.style.overflow = "";
    };
  }, [open, lenis]);

  // Anchor links dismiss the menu then smooth-scroll to the section (Lenis if
  // available, native hash jump under reduced motion). Route links (e.g. "/")
  // just close the menu and let the browser navigate normally.
  function goTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#")) {
      setOpen(false); // let the default <a> navigation proceed
      return;
    }
    e.preventDefault();
    setOpen(false);
    if (lenis) {
      lenis.start();
      lenis.scrollTo(href, { offset: 0, force: true });
    } else {
      window.location.hash = href;
    }
  }

  const ease = "cubic-bezier(0.22,1,0.36,1)";
  // The contact block reveals just after the last nav link.
  const contactDelay = open ? `${120 + links.length * 70}ms` : "0ms";

  const overlay = (
    <div
      id="mobile-menu"
      inert={!open}
      className={`fixed inset-0 z-[60] overflow-y-auto bg-bg transition-opacity duration-500 md:hidden ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ transitionTimingFunction: ease }}
    >
      {/* accent glow, same DNA as the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(90% 50% at 50% 0%, var(--accent-glow), transparent 70%)" }}
      />

      <div className="relative flex min-h-full flex-col">
        {/* top bar mirrors the header row so logo + toggle stay put */}
        <div className="flex items-center justify-between px-6 py-6">
          <a
            href={homeHref}
            onClick={(e) => goTo(e, homeHref)}
            className="flex items-center"
            aria-label={`${site.name} home`}
          >
            <LogoMark title={site.name} className="h-9 w-auto text-muted" />
          </a>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="group relative inline-flex h-11 w-11 items-center justify-center"
          >
            <span className="absolute h-[2px] w-7 rotate-45 bg-ink transition-colors group-hover:bg-accent" />
            <span className="absolute h-[2px] w-7 -rotate-45 bg-ink transition-colors group-hover:bg-accent" />
          </button>
        </div>

        {/* navigation — giant links, dashed dividers, footer style */}
        <nav className="shell flex-1 py-8" aria-label="Mobile">
          <p className="eyebrow mb-6 flex items-center gap-2">
            <span className="h-[8px] w-[8px] bg-accent" aria-hidden />
            {footer.navHeading}
          </p>
          <ul className="flex flex-col">
            {links.map((l, i) => (
              <li
                key={l.href}
                className={`border-b border-dashed border-border transition-[opacity,transform] duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{
                  transitionTimingFunction: ease,
                  transitionDelay: open ? `${120 + i * 70}ms` : "0ms",
                }}
              >
                <a
                  href={l.href}
                  onClick={(e) => goTo(e, l.href)}
                  className="nav-fill block px-3 py-4 font-display text-6xl font-extrabold uppercase leading-none tracking-tight text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* contact + CTA */}
        <div
          className={`shell flex flex-col gap-6 pb-14 pt-6 transition-[opacity,transform] duration-500 ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionTimingFunction: ease, transitionDelay: contactDelay }}
        >
          <div>
            <p className="eyebrow mb-3">{footer.detailsHeading}</p>
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-ink-2 transition-colors hover:text-ink"
            >
              <span className="text-accent">↳ </span>
              {site.email}
            </a>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm uppercase tracking-widest text-ink-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <BookCallButton>{footer.ctaLabel}</BookCallButton>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger — lives in the header row, aligned with the logo. */}
      <button
        type="button"
        aria-label="Open menu"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="header-item group inline-flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:hidden"
      >
        <span className="h-[2px] w-7 bg-ink transition-colors group-hover:bg-accent" />
        <span className="h-[2px] w-7 bg-ink transition-colors group-hover:bg-accent" />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
