@AGENTS.md

# CLAUDE.md

kodoAI is a single-page, static agency portfolio (client-conversion site, not a
gallery). One continuous scroll: Hero → Quotation → Process Timeline → Projects →
Services → FAQ → Footer. The thesis carried through everything: **typography is the
interface** — huge Barlow Condensed headlines, IBM Plex Mono `//` scaffolding, zero
border-radius, one accent (`#c8f060`).

`AGENTS.md` (imported above) holds the non-negotiable rules; this file covers how to
build, where things live, and the conventions the code actually follows.

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build — the real gate; run before calling anything done
npm run lint     # eslint (flat config, eslint-config-next)
```

There is **no test runner and no typecheck script** — `next build` is what catches
type and lint errors. Verify visual/scroll work in the browser (`npm run dev`); GSAP
pins and scrubs cannot be checked any other way.

Shell here is **PowerShell on Windows** (a Bash tool is also available for POSIX
scripts). Paths use backslashes; prefer the dedicated file tools over shell `cat`/`grep`.

## Source-of-truth docs (read in this order)

- **IMPLEMENTATION.md** — the build spec, section by section. Components carry `§N`
  references back to it in their doc comments. Build in the phase order of §14.
- **DesignSystem.md** — every colour, type, and spacing token, plus the base component
  CSS (`.btn`, `.badge`, `.card`, …). Never invent a value outside it.
- **reference/banner.png** (`public/reference/`) — visual target for the DotMatrix
  canvas (§4.2). It is the OG image too. Do NOT sample its pixels or use it as a texture.

## Architecture

Next 15 App Router, all client-side interactivity, statically rendered. `src/app/layout.tsx`
loads the three `next/font` families as CSS variables, wraps everything in `<SmoothScroll>`
(Lenis + GSAP ticker), and renders `<Header> / <main>{page}</main> / <Footer>` + a fixed
grain overlay. `src/app/page.tsx` just composes the section components in order.

```
src/
├── app/
│   ├── layout.tsx        # fonts, metadata/OG, SmoothScroll + Header/Footer/grain
│   ├── page.tsx          # section composition (single page)
│   └── globals.css       # tokens, @theme bridge, helper classes, grain, reduced-motion
├── components/
│   ├── providers/SmoothScroll.tsx   # Lenis, autoRaf off, driven by gsap.ticker
│   ├── layout/           # Header, Footer
│   ├── sections/         # Hero, Quotation, ProcessTimeline, Projects, Services, FAQ
│   ├── canvas/DotMatrix.tsx         # animated banner; reused in hero + footer via `intensity`
│   └── ui/               # Button, Badge, Hairline
└── lib/
    ├── content.ts        # ALL copy + its types (see below)
    └── splitWords.ts     # word-split helper for the Quotation scrub (no paid SplitText)
```

Path alias: `@/*` → `src/*` (use `@/components/...`, `@/lib/...`, never deep relative paths).

## Conventions (from the actual code)

- **All copy lives in `src/lib/content.ts`.** Components import strings; zero hardcoded
  copy in JSX. Each section has typed exports (`process`, `projects`, `services`, `faq`,
  `site`, `nav`, …). Adding content means editing this one file.
- **Colours only via CSS variables.** `globals.css` defines the `:root` tokens verbatim
  from DesignSystem.md, then an `@theme inline` block re-exports them as Tailwind v4
  utilities (`bg-bg`, `text-ink-2`, `border-border`, `font-display`, …). Use those
  utilities or `var(--token)`; never a raw hex in a component.
- **Shared classes live in `globals.css`, not repeated in JSX:** `.shell` (max-width
  1280px + responsive padding), `.eyebrow` (mono 12px label), `.btn` / `.btn.primary`,
  `.badge` / `.badge.accent`, `.grain`, `.spin-slow`. Reach for these before writing
  Tailwind soup.
- **GSAP:** register plugins once at module scope (`gsap.registerPlugin(ScrollTrigger)`),
  animate inside `useGSAP(() => {...}, { scope: ref })`. `ScrollTrigger` is the source of
  truth for scroll; Framer Motion is for micro-interactions (accordion, magnetic, hover)
  only.
- **Reduced motion & mobile are handled with `gsap.matchMedia()`**, not ad-hoc checks —
  see `ProcessTimeline.tsx`: the pinned/scrubbed panel is gated to
  `(min-width: 768px) and (prefers-reduced-motion: no-preference)`, with a plain vertical
  stack for mobile/reduced-motion. Every animation must degrade to static; `globals.css`
  also kills animations globally under `prefers-reduced-motion: reduce`. Mirror this
  dual-path pattern in any new scroll animation. **No pinned scrub on touch** (decision §6).
- **`border-radius: 0 !important`** is enforced globally in `globals.css` — do not add
  radius anywhere. Focus outlines are a 2px accent ring; never remove them.
- **Copy style:** no em dashes (use commas/colons/parentheses); mono labels are
  UPPERCASE and `//`-prefixed; headlines uppercase.

## Build state

Phases 1–4 are committed (skeleton, hero canvas + wordmark, scroll systems, process
timeline). Sections 04–07 currently render as **static Phase-1 placeholders**. Still to
do per IMPLEMENTATION.md §14:

- **Phase 5 — Projects:** Cloudinary wiring (`lib/cloudinary.ts`), a `ui/VideoCard`
  (hover-to-play, poster-first), metric count-up. `next-cloudinary` is installed but
  unused; `projects[].videoId` public IDs are placeholders.
- **Phase 6 — Polish:** FAQ accordion, `MagneticWrap` CTAs, custom cursor, optional
  preloader, full reduced-motion pass.
- **Phase 7 — Ship:** Lighthouse (≥95 perf/a11y), contact form via Resend
  (`resend` is installed, no route yet), Vercel deploy.

**One phase per commit**, in that order. `next` is pinned to `^15.5.0` on purpose —
do not bump to 16 without discussing (see AGENTS.md).
