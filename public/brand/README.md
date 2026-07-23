# kodoAI brand assets

Everything in `public/brand`, `public/icons`, `public/avatars`, `public/placeholder`,
plus `public/favicon.ico` and `public/logo-mark.png`, is **generated**. Do not edit
these files by hand: change `scripts/brand.mjs` (geometry, palette, lockups) or
`scripts/generate-brand-assets.mjs` (the asset list) and re-run:

```bash
npm run assets
```

Text is set in the real Barlow Condensed ExtraBold / IBM Plex Mono TTFs vendored
in `scripts/fonts` (SIL Open Font License, see `OFL.txt`), exposed to sharp's
renderer through a throwaway fontconfig file.

## Naming

`light` = **light-coloured artwork, for dark backgrounds**.
`dark` = **dark-coloured artwork, for light backgrounds**.

## What's here

| File | Use |
| --- | --- |
| `kodoai-mark-{light,dark}.{svg,png}` | Icon-only mark, no wordmark, transparent |
| `kodoai-logo-horizontal-{light,dark}.{svg,png}` | Primary lockup: mark + wordmark, transparent |
| `kodoai-logo-square-{light,dark}.{svg,png}` | Stacked lockup on a solid tile: profiles, directories |
| `kodoai-logo-seo.png` | 512px square for `schema.org/Organization.logo` (wired up in `src/app/layout.tsx`) |
| `kodoai-email-logo.png` | 600x180 header logo for email (clients don't render SVG) |
| `kodoai-email-banner.png` | 1200x400 email/newsletter banner |

Browser and platform icons live in [`../icons`](../icons) and are declared in
`src/app/layout.tsx` (`metadata.icons`), `public/site.webmanifest`, and
`public/browserconfig.xml`.

`../avatars/avatar-0N.png` are abstract block portraits for testimonials, in the
brand language rather than stock photography — assign any of the six to any quote.

`../placeholder/placeholder-*.png` are branded loading states for media slots.
`src/lib/placeholder.ts` (also generated) exports a matching inline `blurDataURL`
for `next/image`'s `placeholder="blur"`.

## In-app mark

The mark rendered *inside* the site (header, mobile nav, preloader) is not an
image: it's `src/components/ui/LogoMark.tsx`, which mirrors the same vector
geometry so it stays crisp and can be recoloured and animated. Keep it in sync
with `scripts/brand.mjs` if the geometry ever changes.
