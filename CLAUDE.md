@AGENTS.md

# CLAUDE.md

kodoAI is a single-page, static agency portfolio (client-conversion site, not a
gallery). Behind a full-screen preloader, one continuous scroll: Hero → Quotation →
Process → Highlights → Services → FAQ → Footer. The thesis carried through everything:
**typography is the interface** — huge Barlow Condensed headlines, IBM Plex Mono `//`
scaffolding, zero border-radius, one accent (`#c8f060`).

`AGENTS.md` (imported above) holds the non-negotiable rules; this file covers how to
build, where things live, and the conventions the code actually follows.

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build — the real gate; run before calling anything done
npm run lint     # eslint (flat config, eslint-config-next)
```

There is **no test runner and no typecheck script**. `next build` is the full gate;
for a fast, non-destructive check use `npx tsc --noEmit` + `npm run lint`. Verify
visual/scroll work in the browser (`npm run dev`); GSAP scrubs and reveals cannot be
checked any other way.

> **Do not run `next build` while a `next dev` server is running against the same
> `.next`.** The production output clobbers the dev cache and the dev server then
> throws `Cannot find module './NNN.js'` / phantom `pages/_document`. Fix: stop dev,
> delete `.next`, restart. Prefer `tsc --noEmit`+`lint` for verification mid-session.

Shell here is **PowerShell on Windows** (a Bash tool is also available for POSIX
scripts). Paths use backslashes; prefer the dedicated file tools over shell `cat`/`grep`.

## Source-of-truth docs (read in this order)

- **IMPLEMENTATION.md** — the build spec, section by section. Components carry `§N`
  references back to it in their doc comments. Some sections have since been reworked
  past the spec (see Build state) — trust the code where they differ.
- **DesignSystem.md** — every colour, type, and spacing token, plus the base component
  CSS (`.btn`, `.badge`, `.card`, …). Never invent a value outside it.
- **reference/banner.png** (`public/reference/`) — visual target for the DotMatrix
  canvas (§4.2), read as a soft dot *cloud*. It is the OG image too. Do NOT sample its
  pixels or use it as a texture.

## Architecture

Next 15 App Router, all client-side interactivity, statically rendered. `src/app/layout.tsx`
loads the three `next/font` families as CSS variables, wraps everything in `<SmoothScroll>`
(Lenis + GSAP ticker), and renders `<Header> / <main>{page}</main> / <Footer>` + a fixed
grain overlay + `<Preloader>`. `src/app/page.tsx` composes the sections and wraps the
mid-page run in one `.depth-band`.

```
src/
├── app/
│   ├── layout.tsx        # fonts, metadata/OG, SmoothScroll + Header/Footer/grain + Preloader
│   ├── page.tsx          # section composition; Quotation…FAQ wrapped in one .depth-band
│   └── globals.css       # tokens (+ accent-glow), @theme bridge, .depth-band, grain, reduced-motion
├── components/
│   ├── providers/SmoothScroll.tsx   # Lenis, autoRaf off, driven by gsap.ticker
│   ├── layout/           # Header (logo mark), Footer, Preloader
│   ├── sections/         # Hero, Quotation, ProcessTimeline, Projects, Services, FAQ
│   ├── canvas/DotMatrix.tsx         # animated dot-cloud; reused in hero + footer via `intensity`
│   └── ui/               # Button, Badge, Hairline, ProjectMedia (hover/tap-to-play video)
└── lib/
    ├── content.ts        # ALL copy + types (EXCEPT the Highlights/Projects data)
    ├── projects.ts       # Highlights data, distilled from previous_projects/*.md
    └── splitWords.ts     # word-split helper for the Quotation scrub (no paid SplitText)
```

`public/`: `logo-mark.png` (tight crop of `logo.png`, used in the header + preloader),
`projects/*.{jpg,png}` (Highlights pictures, downscaled), `reference/banner.png`.
Path alias: `@/*` → `src/*` (use `@/components/...`, `@/lib/...`, never deep relative paths).

## Conventions (from the actual code)

- **Copy lives in `src/lib/content.ts`** (typed exports: `site`, `nav`, `process`,
  `services`, `faq`, …); components import strings, zero hardcoded copy in JSX. The one
  exception is the **Highlights/Projects data in `src/lib/projects.ts`** — distilled
  from `previous_projects/*.md`, with pictures under `public/projects/` and demo clips as
  Cloudinary **mp4 URLs** (played through a plain `<video>`, so `next-cloudinary` stays
  unused).
- **Colours only via CSS variables.** `globals.css` defines the `:root` tokens verbatim
  from DesignSystem.md, then an `@theme inline` block re-exports them as Tailwind v4
  utilities (`bg-bg`, `text-ink-2`, `border-border`, `font-display`, …). Two derived
  tokens, `--accent-glow` / `--accent-glow-soft` (translucent accent via `color-mix`),
  power the green depth. Use the utilities or `var(--token)`; never a raw hex.
- **One seamless background for the mid-page.** Quotation → FAQ are transparent and sit
  inside a single `.depth-band` div (in `page.tsx`) that paints one accent-tinted
  gradient, so the run reads as one surface with no per-section banding. Hero and Footer
  own their own backgrounds/glows. Don't give a mid-page section its own `bg-*`.
- **Shared classes live in `globals.css`:** `.shell` (max-width 1280px + responsive
  padding), `.eyebrow` (mono 12px label), `.btn` / `.btn.primary`, `.badge` /
  `.badge.accent`, `.depth-band`, `.grain`, `.spin-slow`. Reach for these first.
- **GSAP:** register plugins once at module scope, animate inside
  `useGSAP(() => {...}, { scope: ref })`. ScrollTrigger is the source of truth for
  scroll; Framer Motion is for micro-interactions only.
- **React-controlled style vs GSAP — don't cross the streams.** `Services` and
  `Projects` drive each item's `opacity`/`transform` from React state (focus dim, scroll
  blur). Never *also* animate those same properties on the same element with GSAP — they
  fight. Put the reveal on an inner wrapper (`.svc-inner`) or a separate layer (see the
  parallax layer in `ProjectMedia`) instead.
- **Reduced motion.** Each section's `useGSAP` early-returns on
  `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and renders static;
  `globals.css` also kills animations globally under `prefers-reduced-motion: reduce`.
  Mirror this in any new animation. No pinned scrub on touch.
- **`border-radius: 0 !important`** is enforced globally — do not add radius anywhere.
  Focus outlines are a 2px accent ring; never remove them.
- **Copy style:** no em dashes (use commas/colons/parentheses); mono labels are UPPERCASE
  and `//`-prefixed; headlines uppercase.

## Build state

Phases 1–4 are committed; the working tree carries a large visual/interaction pass on top
(uncommitted). Current behaviour of the code:

**Working:**
- **Preloader** (`layout/Preloader.tsx`) — logo spinning on solid `--bg`; waits for
  `fonts.ready` + window `load` (min 600ms, 8s cap), then fades out and unmounts.
- **Hero** — DotMatrix is now a dense **dot cloud** (small filled dots sized by noise
  brightness, not the old sparse `×` grid); giant wordmark raised + low-opacity; tagline
  small/muted; accent glow. Header uses the **logo image**, not the text wordmark.
- **Green depth** — `.depth-band` seamless gradient + `--accent-glow` tokens; glows in
  hero and footer.
- **Process** (`ProcessTimeline.tsx`) — reworked from the spec's pinned horizontal scroll
  to **normal vertical scroll**: full-bleed bands alternating dark / accent-green (green =
  black content), giant ghost number + title left, body + chips right, a green centre line
  that scrubs, and a per-band entrance timeline.
- **Highlights** (`Projects.tsx` + `ui/ProjectMedia.tsx`) — full-width centred
  `OUR HIGHLIGHTS` heading; large centred blocks; scroll focus that blurs off-frame
  projects; media is poster-first, hover (or tap on touch) reveals a WATCH pill, click
  plays the Cloudinary clip in place; poster has a scroll parallax. No metric count-up
  (tech-stack chips instead).
- **Enter reveals** — FAQ, Services, Process, and Footer content fade up on enter.

**Still to do (per IMPLEMENTATION.md §14 / Phase 6–7):**
- Header scroll hide/show + blur-on-scroll + magnetic CTA (currently static).
- FAQ: Framer Motion height-auto + single-open (currently native `<details>`).
- Custom cursor.
- Contact form via **Resend** (installed, no route yet); Lighthouse ≥95 perf/a11y;
  Vercel deploy.

**One phase per commit.** `next` is pinned to `^15.5.0` on purpose — do not bump to 16
without discussing (see AGENTS.md).
