# kodoAI Portfolio Website — Implementation Document

**Version:** 1.0
**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Framer Motion · Cloudinary
**Design language:** Editorial Brutalism (per `DesignSystem.md`)
**Reference:** Monolog studio layout, reinterpreted through the kodoAI banner aesthetic (near-black, acid lime, X-pattern dot matrix, mono labels)

---

## 0. Purpose & Positioning

This is a client-conversion portfolio, not a gallery. Every section answers one client question:

| Section | Client question it answers |
|---|---|
| Hero | Who are you? (identity, instantly memorable) |
| Quotation | Why should I care? (the belief / thesis) |
| Process Timeline | How do you work? (trust through method) |
| Projects | What have you done? (proof) |
| Services | What can you do for me? (offer) |
| Q&A | What's stopping me? (objection handling) |
| Footer | How do I start? (conversion) |

Design principle carried through everything: **typography is the interface.** Huge condensed headlines, monospace scaffolding with `//` prefixes, zero border-radius, one accent color (`#c8f060`) used only where it earns attention.

---

## 1. Tech Stack & Rationale

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15, App Router** | SSG for the whole site (it's static content), image optimization, font optimization, easy Vercel deploy |
| Language | **TypeScript** | Non-negotiable for maintainability |
| Styling | **Tailwind CSS v4 + CSS variables** | Design tokens live in `:root` exactly as `DesignSystem.md` defines them; Tailwind consumes them via `var(--accent)` etc. |
| Smooth scroll | **Lenis** | Required. Synced to GSAP ticker (see §3.1) |
| Scroll animation | **GSAP + ScrollTrigger** | The timeline section, headline reveals, pinned sections. Framer Motion cannot do pinned scrubbed timelines well; GSAP owns scroll |
| Micro-interactions | **Framer Motion** | Hover states, magnetic buttons, FAQ accordion, page transitions |
| Hero background | **Canvas 2D (custom)** | Real-time animated recreation of the WhatsApp banner dot-matrix (see §4.2). No WebGL dependency needed; Canvas 2D at ~3k particles is cheap |
| Video hosting | **Cloudinary** (recommended) | See §7.3 for full comparison |
| Fonts | **next/font/google** | Barlow Condensed (400–900), IBM Plex Sans (400–700), IBM Plex Mono (300–600). Self-hosted via next/font = zero layout shift, no external request |
| Forms | **Server Action + Resend** | "Start a project" form emails you directly; no backend needed |
| Deploy | **Vercel** | Free tier is fine for this |

### Package list

```bash
npx create-next-app@latest kodoai-site --ts --tailwind --app --src-dir
npm i gsap @gsap/react lenis framer-motion
npm i next-cloudinary        # video/image delivery
npm i resend                 # contact form email
```

---

## 2. Project Structure

```
src/
├── app/
│   ├── layout.tsx              # fonts, metadata, <SmoothScroll> provider
│   ├── page.tsx                # single-page composition of all sections
│   ├── globals.css             # :root tokens from DesignSystem.md
│   └── api/contact/route.ts    # optional; or Server Action
├── components/
│   ├── providers/
│   │   └── SmoothScroll.tsx    # Lenis + GSAP ticker sync
│   ├── layout/
│   │   ├── Header.tsx          # fixed nav + CTA
│   │   ├── Footer.tsx          # nav / contacts / socials / CTA + dim canvas bg
│   │   └── Preloader.tsx       # optional counter preloader
│   ├── sections/
│   │   ├── Hero.tsx            # giant KODOAI + canvas background
│   │   ├── Quotation.tsx       # thesis statement, word-by-word reveal
│   │   ├── ProcessTimeline.tsx # pinned horizontal-progress scroll section
│   │   ├── Projects.tsx        # success stories w/ hover-video
│   │   ├── Services.tsx        # giant stacked service list
│   │   ├── FAQ.tsx             # Q&A accordion
│   │   └── CTA.tsx             # pre-footer conversion band (optional)
│   ├── canvas/
│   │   └── DotMatrix.tsx       # the animated banner effect (reused hero + footer)
│   └── ui/
│       ├── Button.tsx          # .btn / .btn.primary from design system
│       ├── Badge.tsx
│       ├── MagneticWrap.tsx    # magnetic hover for CTAs
│       ├── RevealText.tsx      # SplitText-style line/word reveal
│       └── VideoCard.tsx       # hover-to-play Cloudinary video
├── lib/
│   ├── cloudinary.ts
│   └── content.ts              # ALL copy lives here (easy to upgrade later)
└── public/
    └── grain.png               # subtle noise overlay (or SVG feTurbulence)
```

**Rule:** every word of copy lives in `lib/content.ts`. When you upgrade the content later you touch one file.

---

## 3. Global Systems

### 3.1 Smooth Scrolling — Lenis + GSAP sync

```tsx
// components/providers/SmoothScroll.tsx
"use client";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,          // GSAP ticker drives it
        lerp: 0.09,              // heavy, luxurious feel
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

Lenis is disabled for `prefers-reduced-motion` users (check in a `useEffect`, destroy instance).

### 3.2 Design Tokens (globals.css)

Copy the full `:root` block from `DesignSystem.md` verbatim:

```css
:root {
  --bg: #0c0c0b;        --surface: #141412;   --surface-2: #1a1a18;
  --surface-3: #202019; --border: #2a2a26;    --border-2: #3a3a34;
  --ink: #f4f3ee;       --ink-2: #c4c2b8;     --ink-3: #8a887e;
  --muted: #5e5c52;     --accent: #c8f060;    --accent-dim: #6a802e;
  --display: "Barlow Condensed", Impact, sans-serif;
  --sans: "IBM Plex Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}
* { border-radius: 0 !important; }   /* brutalism enforced globally */
html { background: var(--bg); color: var(--ink); }
body { -webkit-font-smoothing: antialiased; }
::selection { background: var(--accent); color: var(--bg); }
```

Custom cursor (optional but on-theme): small `--accent` square that scales up over interactive elements. Keep native cursor visible underneath for usability.

### 3.3 Grain Overlay

Fixed, full-viewport, `pointer-events: none`, `opacity: 0.05`, `mix-blend-mode: overlay`, animated with a 4-step `steps()` keyframe shifting `background-position`. This matches the halftone/noise texture visible in both reference images.

### 3.4 Header

- Fixed, full-width, `padding: 24px 48px`, transparent over hero → gains `backdrop-filter: blur(12px)` + `border-bottom: 1px solid var(--border)` after 100px scroll (toggle class via Lenis scroll callback).
- Left: wordmark `KODO` in `--ink` + `AI` in `--accent` (Barlow Condensed 900, 24px), 10px accent dot.
- Center: nav links `ABOUT · WORK · PROCESS · SERVICES` — mono 12px, `letter-spacing: 0.15em`, `//`-prefixed on hover. Anchor-scroll via `lenis.scrollTo()`.
- Right: **START A PROJECT** — `.btn.primary` (accent bg, dark text, arrow ↗), wrapped in `MagneticWrap` (translate toward cursor within ±8px, spring back on leave — Framer Motion `useSpring`).
- Header hides on scroll-down, reveals on scroll-up (GSAP quickTo on `yPercent`).

---

## 4. Section 01 — HERO

### 4.1 Layout (Monolog structure, kodoAI skin)

```
┌────────────────────────────────────────────────────────┐
│ KODOAI          ABOUT WORK PROCESS SERVICES   [START ↗]│
│                                                        │
│              // FULL STACK AI AUTOMATION               │
│                                                        │
│          IF IT'S MANUAL AND MEASURABLE,                │
│              IT CAN BE AUTOMATED.                      │
│                                                        │
│        Custom AI agent systems for agencies            │
│        that turn repetitive work into revenue.         │
│                                                        │
│                                                        │
│  ██╗  ██╗ ██████╗ ██████╗  ██████╗  █████╗ ██╗        │
│  ─── GIANT WORDMARK: KODOAI ───────────────────        │  ← clipped at bottom
└────────────────────────────────────────────────────────┘
```

- Section: `100svh`, `overflow: hidden`, `position: relative`.
- **Center block** (like Monolog's globe + copy): mono eyebrow `// FULL STACK AI AUTOMATION`, then the manifesto in IBM Plex Sans 20px `--ink-2`, max-width 480px, centered. Above it, a small rotating wireframe globe or a spinning asterisk `✳` in `--accent` (SVG, CSS `animation: spin 12s linear infinite`) as the focal ornament.
- **Giant wordmark**: `KODOAI` pinned to the bottom edge, spanning full viewport width. Implementation: `font-size: clamp(120px, 23vw, 420px)`, Barlow Condensed 900, `line-height: 0.75`, `letter-spacing: -0.03em`, `transform: translateY(18%)` so the baseline is clipped by the viewport exactly like Monolog. The `AI` letters use `color: var(--accent)`; `KODO` uses `--ink` at ~85% opacity so the animated background reads through slightly (`mix-blend-mode: screen` on light letters over the dark canvas gives the Monolog translucency effect).
- **Wordmark entrance**: letters rise from below the fold with GSAP stagger (`yPercent: 100 → 0`, `stagger: 0.05`, `ease: "power4.out"`, `duration: 1.2`) on load, after preloader.
- **Scroll behavior**: hero content parallaxes up at 0.5× speed and the wordmark scales to 0.95 + fades as the quotation section slides over it (ScrollTrigger scrub).

### 4.2 The Animated Background — "Living Banner"

This is the signature element. It recreates the WhatsApp banner's **X-pattern dot matrix cloud** in real time on a `<canvas>`.

**Concept:** a field of small `×` glyphs and dots on a strict grid (28px cell). Each cell has a brightness value driven by layered simplex noise that drifts slowly over time, so the "cloud" formation from the banner breathes, dissolves, and reforms. Cells near the cursor excite (brightness + slight scale). A few random cells flicker to `--accent` for 200ms like signal pings.

```tsx
// components/canvas/DotMatrix.tsx  (core loop, simplified)
"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise"; // npm i simplex-noise

export default function DotMatrix({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const noise3D = createNoise3D();
    const CELL = 28;
    let raf = 0, t = 0;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      ctx.font = "11px 'IBM Plex Mono'";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
    };
    resize();
    window.addEventListener("resize", resize);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove);

    const loop = () => {
      t += 0.0016;                                  // slow drift
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      for (let x = CELL / 2; x < W; x += CELL) {
        for (let y = CELL / 2; y < H; y += CELL) {
          // two noise octaves → cloud shape like the banner
          let n = noise3D(x * 0.0016, y * 0.0022, t) * 0.7
                + noise3D(x * 0.006,  y * 0.006,  t * 2) * 0.3;
          n = (n + 1) / 2;                          // 0..1
          // bias: denser on the left, fades right (banner composition)
          n *= 1.15 - (x / W) * 0.85;
          // cursor excitation
          const d = Math.hypot(mouse.x - x, mouse.y - y);
          const boost = Math.max(0, 1 - d / 180) * 0.6;
          const b = Math.min(1, n * intensity + boost);
          if (b < 0.18) continue;                   // empty cell
          const ping = Math.random() < 0.00006;
          ctx.fillStyle = ping
            ? "#c8f060"
            : `rgba(196, 194, 184, ${(b * 0.55).toFixed(3)})`;
          ctx.fillText(b > 0.45 ? "×" : "·", x, y);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [intensity]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
```

**Performance rules:**
- Cap DPR at 2; pause via `IntersectionObserver` when hero is off-screen.
- `prefers-reduced-motion`: render one static frame, no loop.
- Mobile: raise `CELL` to 36 and drop cursor tracking. Target 60fps; this loop is ~2,500 draw calls, well within Canvas 2D budget.
- Reuse the same component in the footer with `intensity={0.45}` — same DNA, quieter.

Layer order in hero: canvas (z-0) → radial vignette div darkening edges (z-1) → center copy (z-2) → giant wordmark (z-3, blend mode) → grain (z-50, global).

---

## 5. Section 02 — QUOTATION

Full-viewport statement section, dark `--bg`, directly after hero. This is the agency thesis.

**Default copy:**

> // OUR THESIS
>
> "EVERY HOUR YOUR TEAM SPENDS ON REPETITIVE WORK IS AN HOUR A MACHINE SHOULD HAVE TAKEN. WE FIND THOSE HOURS, AND WE GIVE THEM BACK."
>
> — KODOAI · AUTOMATION AGENCY

**Layout & animation:**
- `min-height: 100vh`, content vertically centered, max-width 1100px.
- Quote set in Barlow Condensed 800, `clamp(40px, 6vw, 96px)`, uppercase, `line-height: 1.0`.
- **Scrub reveal**: split into words (each word wrapped in a span at build time — write a tiny `splitWords()` helper, don't ship GSAP SplitText club plugin). All words start at `color: var(--muted)`; a ScrollTrigger scrubbed timeline (`start: "top 75%"`, `end: "bottom 55%"`, `scrub: 1`) staggers each word to `--ink`. The two key phrases (`REPETITIVE WORK`, `GIVE THEM BACK`) resolve to `--accent` instead. This is the classic "reading highlight" effect and it's high-impact + cheap.
- Attribution line: mono 12px `--ink-3`, fades in last.
- A 1px `--border` hairline draws itself across the top of the section (scaleX 0→1, scrubbed).

---

## 6. Section 03 — PROCESS TIMELINE ("How we work")

The complex scroll-animation section. **Pinned horizontal-progress timeline.**

**Default content (3 phases + implicit 4th):**

| # | Phase | Default copy |
|---|---|---|
| 01 | **WE RESEARCH** | We embed in your operation and map every workflow. Where time leaks, where errors repeat, where humans do robot work. Nothing gets automated until it's understood. |
| 02 | **WE CALCULATE** | Every candidate process gets a number: hours saved, error rate removed, payback period. You see the ROI before we write a line of code. |
| 03 | **WE AUTOMATE** | We build, test, and deploy custom AI agent systems into your stack. Human approval gates where they matter, full autonomy where they don't. |
| 04 | **WE MONITOR** *(recommended add — closes the loop, signals ongoing partnership)* | Dashboards, alerts, and monthly optimization. Automation isn't a launch, it's an asset we keep compounding. |

**Implementation — the pin:**

```
Section height: 400vh (100vh per phase)
Inner viewport: position sticky/pinned via ScrollTrigger, 100vh
```

```ts
// ProcessTimeline.tsx (animation skeleton)
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300%",       // 3 transitions across 4 panels
      pin: true,
      scrub: 0.8,
      snap: 1 / 3,         // settle on each phase
    },
  });
  // per phase i → i+1:
  // 1. progress line grows:      tl.to(".t-line", { scaleX: (i+1)/4 })
  // 2. giant number swaps:       yPercent roll 0 → -100, next enters from 100
  // 3. phase title letters out/in with stagger
  // 4. body copy crossfade + y drift
  // 5. background node-graph SVG draws next segment (strokeDashoffset)
}, []);
```

**Visual composition inside the pinned viewport:**
- Top: mono eyebrow `// PROCESS — HOW WE WORK` + progress hairline with 4 tick marks; the filled portion is `--accent`, ticks light up as passed.
- Left 60%: **giant phase number** `01` in Barlow Condensed 900 at ~340px, `--surface-3` colored (ghost), with the phase title `WE RESEARCH` at H1 88px `--ink` overlapping it (Monolog-style layering).
- Right 40%: body copy (Plex Sans 18px `--ink-2`) + 3 mono bullet chips per phase (e.g. `// WORKFLOW MAPPING`, `// TIME AUDIT`, `// BOTTLENECK REPORT`).
- Background: a faint SVG polyline connecting 4 node squares, drawing itself as you progress (`stroke-dashoffset` scrubbed). Nodes echo the dot-matrix X's.
- Mobile fallback: **no pin.** Vertical stack, each phase a full block with a left progress rail, simple `IntersectionObserver` reveals. Pinned scrub sections are miserable on mobile; don't fight it.

---

## 7. Section 04 — PROJECTS ("Success Stories")

Monolog success-stories layout: sticky label left, alternating media + metrics.

### 7.1 Layout per project row

```
┌──────────────┬──────────────────────────────┬─────────────────────┐
│ ● SUCCESS    │                              │ SS ↳ [01/04]        │
│   STORIES    │   [ VIDEO / POSTER 16:9 ]    │ PROJECT NAME (H3)   │
│ (sticky)     │   hover → video plays        │ One-line desc       │
│              │                              │ ┌────────┐          │
│              │                              │ │ 120HRS+│ metric   │
│              │                              │ └────────┘          │
└──────────────┴──────────────────────────────┴─────────────────────┘
```

- Left rail: `position: sticky; top: 45vh`, mono label with accent dot. Stays while rows scroll (exactly the Monolog behavior).
- Rows separated by `1px dashed var(--border-2)` dividers.
- Media enters with a clip-path reveal (`inset(0 0 100% 0)` → `inset(0)`) scrubbed lightly; metrics count up (GSAP `textContent` snap) when 50% visible.
- Metric badge: `--surface` bg, `1px solid var(--border)`, Barlow Condensed 800 40px — value in `--accent`.

### 7.2 Default projects (placeholder content, realistic for kodoAI)

| # | Project | Description | Metric |
|---|---|---|---|
| 01 | **LEAD INTAKE ENGINE** | End-to-end lead qualification agents for a US marketing agency: scoring, enrichment, CRM sync, instant routing. | `120+ HRS` saved monthly |
| 02 | **AI VOICE RECEPTION** | 24/7 voice agents handling booking, rescheduling & FAQs for service businesses. Zero missed calls. | `3.2×` more bookings captured |
| 03 | **REPORTING AUTOPILOT** | Client reporting that writes itself: data pulls, insight generation, branded PDF delivery every Monday 9am. | `40 HRS → 15 MIN` per cycle |
| 04 | **PROPOSAL FACTORY** | Research-to-proposal pipeline: competitor scans, pricing models, ready-to-send decks from a single brief. | `6×` faster turnaround |

### 7.3 Video strategy — hover-to-play

**Recommendation: Cloudinary.** Comparison for your use case (4–8 short looping demo clips, 10–20s each):

| Option | Verdict |
|---|---|
| **Cloudinary** ✅ | Free tier (25 credits/mo) easily covers a portfolio. Automatic format negotiation (`f_auto` → AV1/H.265/VP9 per browser), quality auto (`q_auto`), on-the-fly resizing, and auto-generated poster frames from any video frame. `next-cloudinary` gives a drop-in `<CldVideoPlayer>` / `getCldVideoUrl`. One asset, every device served optimally. |
| Mux | Better for long-form/streaming analytics; paid from the start. Overkill here. |
| Self-hosted MP4 in `/public` | Works but you hand-encode every variant, no adaptive delivery, hits your Vercel bandwidth. Fine as fallback only. |
| YouTube/Vimeo embeds | Iframes: no clean hover-play, brand chrome, layout jank. Rejected. |

**Encoding rules for the clips you upload to Cloudinary:** 1080p max, no audio track (muted anyway), 12–20s loop, let Cloudinary transform to `w_960, q_auto, f_auto` for the cards.

**VideoCard behavior:**

```tsx
// ui/VideoCard.tsx (essentials)
const ref = useRef<HTMLVideoElement>(null);
// 1. Render <video muted loop playsInline preload="none"
//      poster={cloudinaryPoster} /> — poster is a Cloudinary
//      so_2 (frame at 2s) jpg → instant paint, zero video bytes upfront.
// 2. IntersectionObserver at 200px margin → set preload="metadata"
//      (warm up near-viewport videos only).
// 3. onPointerEnter → ref.current.play() + scale poster overlay out
//    onPointerLeave → pause() + currentTime stays (resume feels alive)
// 4. Touch devices (no hover): autoplay when card is ≥60% in viewport,
//    pause when it leaves — IntersectionObserver, threshold 0.6.
// 5. Wrap in a div with overflow hidden; video scales 1 → 1.04 on hover
//    (Framer Motion), cursor label "▶ WATCH" follows pointer (mono 11px).
```

This gives: fast page (posters only), videos stream only on intent, smooth on mobile.

---

## 8. Section 05 — SERVICES ("What we can help with")

Monolog's giant stacked list, verbatim structure.

**Default services:**

1. **AI AGENT SYSTEMS**
2. **WORKFLOW AUTOMATION**
3. **AI VOICE AGENTS**
4. **DATA PIPELINES & REPORTING**
5. **CUSTOM INTEGRATIONS**
6. **AUTOMATION STRATEGY**

**Layout & behavior:**
- Eyebrow: `● WHAT WE CAN HELP WITH` (accent dot + Plex Sans).
- Each item: Barlow Condensed 800, `clamp(48px, 7.5vw, 120px)`, uppercase, `line-height: 1.05`.
- **Focus state (the Monolog trick):** the item nearest viewport center is `--ink` at full opacity; all others sit at `--surface-3`-ish (`opacity 0.18`). Driven by a ScrollTrigger per item (`start: "top 60%", end: "bottom 40%"`, toggling a class with a 0.4s color tween). On pointer hover, hovered item takes focus instead.
- On hover, a mono index `// 0N` and a one-line descriptor slide in beside the title (e.g. AI AGENT SYSTEMS → *"Multi-agent pipelines that think, decide, and execute"*), and the item indents 24px (`x` tween).
- Optional flourish: small floating preview card (like Monolog's right-side image) that swaps a related still per hovered service — Framer Motion `AnimatePresence`, skip on touch.
- Right side keeps generous negative space; this section should feel 90% typography.

**Default descriptors:**

| Service | Descriptor |
|---|---|
| AI Agent Systems | Multi-agent pipelines that think, decide, and execute |
| Workflow Automation | Manual ops turned into self-running systems |
| AI Voice Agents | Calls answered, booked, and logged 24/7 |
| Data Pipelines & Reporting | From raw data to decision-ready reports |
| Custom Integrations | Your stack, finally talking to itself |
| Automation Strategy | Roadmaps ranked by ROI, not hype |

---

## 9. Section 06 — Q&A

Two-column: left sticky header, right accordion.

- Left (sticky): H2 `QUESTIONS, ANSWERED` + mono `// FAQ` + short line "Everything clients ask before starting."
- Right: accordion items, `border-top: 1px solid var(--border)` each, question in Barlow Condensed 700 28px, `+` icon that rotates 45° to `×` on open (accent color when open). Height animation via Framer Motion `AnimatePresence` + `height: auto`. One open at a time.

**Default Q&A:**

1. **What can actually be automated?** — If it's manual and measurable, it's a candidate: lead handling, reporting, scheduling, data entry, follow-ups, research, quoting. We audit first and only automate where ROI is provable.
2. **How long does a project take?** — Discovery in week one. Most systems ship in 2–6 weeks depending on integrations. You see working demos, not slide decks.
3. **Will this replace my team?** — It replaces their busywork. Your people move to work that needs judgment; the agents handle the rest, with human approval gates wherever you want them.
4. **What does it cost?** — Every proposal comes with a calculated payback period. If we can't show the system paying for itself, we'll tell you not to build it.
5. **What tools do you work with?** — Your existing stack first: CRMs, calendars, email, Slack/WhatsApp, sheets, databases. We build custom AI agents on top rather than forcing new software on your team.
6. **What happens after launch?** — Monitoring, dashboards, and monthly optimization. Automations are assets; we keep them compounding.

---

## 10. Section 07 — FOOTER

Monolog footer structure + the living background at low intensity.

```
┌──────────────────────────────────────────────────────────────┐
│   <DotMatrix intensity={0.45}>  (absolute, behind everything)│
│                                                              │
│  ● NAVIGATION            (STUDIO DETAILS)      (SOCIALS)     │
│                                                              │
│  ABOUT ────────────────  ↳ hello@kodoai.dev    LINKEDIN ↗    │
│  WORK  ────────────────  Based in Islamabad,   INSTAGRAM ↗   │
│  PROCESS ──────────────  Pakistan.             X/TWITTER ↗   │
│  SERVICES ─────────────  Working worldwide.    YOUTUBE ↗     │
│  CONTACT ──────────────                                      │
│                          // START A PROJECT                  │
│                          [ LET'S AUTOMATE ↗ ]  (btn.primary) │
│                                                              │
│  ── hairline ─────────────────────────────────────────────── │
│  © 2026 KODOAI          // IF IT'S MANUAL AND MEASURABLE…    │
│                                        BACK TO TOP ↑         │
└──────────────────────────────────────────────────────────────┘
```

- Nav links: Barlow Condensed 800, 56–72px, `--ink`, hairline `border-bottom: 1px dashed var(--border)` under each; on hover the link slides right 16px and an accent `↳` appears.
- Contact email gets the `↳` prefix exactly like Monolog.
- Big CTA button: magnetic, accent bg.
- Footer reveal: the footer sits `position: sticky; bottom: 0; z-index: -1`-style *(curtain reveal — the page lifts to expose it)* or simpler: normal flow with staggered fade-up. Curtain reveal recommended; it's 10 lines of CSS and feels premium.
- Bottom bar: mono 11px, copyright left, tagline center, BACK TO TOP right (`lenis.scrollTo(0, { duration: 1.6 })`).

---

## 11. Animation Inventory (single source of truth)

| # | Element | Trigger | Technique |
|---|---|---|---|
| A1 | Preloader (optional) | load | Counter 0→100 mono, curtain wipe up, then A2 |
| A2 | Hero wordmark letters | after load | GSAP stagger yPercent 100→0, power4.out |
| A3 | Hero background | continuous | Canvas noise field (§4.2) |
| A4 | Hero parallax/fade | scroll | ScrollTrigger scrub |
| A5 | Quotation word highlight | scroll | Scrubbed color stagger (§5) |
| A6 | Process timeline | scroll | Pin + scrub + snap, 4 phases (§6) |
| A7 | Project media reveal | enter viewport | clip-path inset scrub |
| A8 | Metric count-up | 50% visible | gsap.to textContent, snap 1 |
| A9 | Hover video | pointer/IO | play/pause + scale 1.04 (§7.3) |
| A10 | Services focus | scroll center / hover | class toggle + color tween (§8) |
| A11 | FAQ accordion | click | Framer Motion height auto |
| A12 | Footer curtain | scroll | sticky reveal |
| A13 | Magnetic CTAs | pointer | Framer useSpring translate |
| A14 | Header hide/show | scroll dir | GSAP quickTo yPercent |
| A15 | Section hairlines | enter | scaleX 0→1, origin left |

**Global rules:** every scroll reveal uses `once: false` scrub or `once: true` entrance — never re-trigger entrances on scroll-up (feels buggy). All animations gated behind `prefers-reduced-motion` check: reduced users get opacity-only fades and a static hero frame.

---

## 12. Content File Shape

```ts
// lib/content.ts
export const site = {
  name: "kodoAI",
  tagline: "IF IT'S MANUAL AND MEASURABLE, IT CAN BE AUTOMATED",
  sub: "Custom AI agent systems for agencies",
  email: "hello@kodoai.dev",
  location: "Based in Islamabad, Pakistan. Working worldwide.",
  socials: [{ label: "LINKEDIN", href: "#" }, /* … */],
};
export const quotation = { eyebrow: "// OUR THESIS", text: "…", highlights: ["REPETITIVE WORK", "GIVE THEM BACK"] };
export const process = [ { n: "01", title: "WE RESEARCH", body: "…", chips: ["…"] }, /* … */ ];
export const projects = [ { n: "01", title: "LEAD INTAKE ENGINE", desc: "…", metric: { value: "120+", unit: "HRS", label: "saved monthly" }, videoId: "kodoai/lead-engine", posterSec: 2 }, /* … */ ];
export const services = [ { title: "AI AGENT SYSTEMS", desc: "…" }, /* … */ ];
export const faq = [ { q: "…", a: "…" }, /* … */ ];
```

---

## 13. Performance, A11y, SEO

- **LCP target < 2.0s**: hero is text + canvas (no image LCP). Fonts via `next/font` with `display: swap` off (block briefly; condensed fallback causes ugly FOUT).
- Videos: `preload="none"` + Cloudinary posters (§7.3). Nothing video loads before intent.
- Canvas paused off-screen (IntersectionObserver both hero & footer instances).
- `content-visibility: auto` on below-fold sections.
- Semantic landmarks: `header / main / section[aria-labelledby] / footer`. Accordion uses `button[aria-expanded]`. Giant wordmark is `aria-hidden` with an `sr-only` h1.
- Focus styles: 2px `--accent` outline offset 4px (never remove outlines).
- Metadata: OG image = the WhatsApp banner (already perfect), title "kodoAI — If it's manual and measurable, it can be automated".

---

## 14. Build Order (phased)

| Phase | Scope | Est. |
|---|---|---|
| **1. Skeleton** | Next app, tokens, fonts, Lenis+GSAP providers, Header/Footer static, all sections with real copy, no animation | Day 1 |
| **2. Hero** | DotMatrix canvas, wordmark entrance, parallax | Day 2 |
| **3. Scroll systems** | Quotation reveal, Services focus list, hairlines, footer curtain | Day 3 |
| **4. Process timeline** | Pin/scrub/snap + mobile fallback | Day 4 |
| **5. Projects** | Cloudinary setup, VideoCard, metrics count-up | Day 5 |
| **6. Polish** | FAQ, magnetic buttons, custom cursor, grain, preloader, reduced-motion pass | Day 6 |
| **7. Ship** | Lighthouse pass (≥95 perf/a11y), OG/meta, contact form via Resend, deploy Vercel | Day 7 |

Each phase is independently shippable; the site looks intentional even at Phase 1 because the typography IS the design.

---

## 15. Decisions Made For You (change if you disagree)

1. **Canvas 2D over WebGL/shader** for the banner effect — identical look at this density, zero dependency weight, trivially reusable in footer.
2. **Added a 4th process phase (WE MONITOR)** — 3-step timelines end at delivery; a 4th signals retainer revenue and ongoing partnership. Delete if you want strict 3.
3. **Cloudinary over Mux** — free tier, poster generation, `f_auto/q_auto` is exactly the hover-card use case.
4. **No GSAP SplitText** (paid plugin) — a 15-line word-splitting helper does everything the quotation section needs.
5. **Single page, anchor nav** — for an agency portfolio at launch, one continuous scroll converts better than multi-page; the Monolog reference is also effectively one narrative. Project detail pages can come later as `/work/[slug]`.
6. **Mobile process = vertical, no pin** — pinned scrub on touch is the #1 source of janky agency sites.

---

*End of implementation document. All copy is placeholder-grade and structured in `lib/content.ts` for one-file upgrades.*
