# kodoAI Portfolio — agent notes

**Stack is LOCKED to Next.js 15** (App Router) + TypeScript + Tailwind v4 + GSAP/ScrollTrigger
+ Lenis + Framer Motion + Cloudinary. `next` is pinned to `^15.5.0` on purpose — do not bump to
16 without discussing first (the spec targets 15, and create-next-app now defaults to 16).

Source of truth, in order:

- **IMPLEMENTATION.md** — the build spec. Follow it section by section; build in the phase order of §14, one phase per commit.
- **DesignSystem.md** — all colour / typography tokens. Never invent values outside it.
- **reference/banner.png** — visual target for the DotMatrix canvas (§4.2). Do NOT sample its pixels or use it as a texture.

Hard rules: `border-radius: 0` on everything; colours only via CSS variables; accent `#c8f060`
for CTAs / active states / highlighted words only; no em dashes in copy; all copy lives in
`src/lib/content.ts`; every animation respects `prefers-reduced-motion`.
