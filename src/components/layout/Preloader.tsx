"use client";

import { useEffect, useState } from "react";
import { markLoaded } from "@/lib/loaded";
import LogoMark from "@/components/ui/LogoMark";

/**
 * Full-screen preloader (IMPLEMENTATION.md §11 A1). Solid --bg (same as the page
 * background) with the mark centred, its accent block beating like a pulse
 * monitor (`.logo-beat` in globals.css) while the page loads. Waits for the
 * fonts and the window load event (plus a small minimum so it never just
 * flashes, and an 8s safety cap), then fades out smoothly and unmounts.
 * Rendered on the server too, so it covers the page from the very first paint.
 */
export default function Preloader() {
  const [done, setDone] = useState(false); // loaded → begin fade
  const [gone, setGone] = useState(false); // fade finished → unmount

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      setDone(true);
      markLoaded(); // release the hero + header entrances as the curtain lifts
      window.setTimeout(() => {
        if (!cancelled) setGone(true);
      }, 700); // matches the fade duration below
    };

    const waitLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    const waitFonts = "fonts" in document ? document.fonts.ready : Promise.resolve();
    const minShow = new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    const maxWait = new Promise<void>((resolve) => window.setTimeout(resolve, 8000));

    Promise.race([Promise.all([waitLoad, waitFonts, minShow]), maxWait]).then(finish);

    return () => {
      cancelled = true;
    };
  }, []);

  // Lock page scroll (and its scrollbar) while the preloader covers the page;
  // restore the previous value once it unmounts so Lenis takes over cleanly.
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-bg transition-opacity duration-700 ease-out ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <LogoMark className="h-20 w-auto text-muted md:h-24" accentClassName="logo-beat" />
    </div>
  );
}
