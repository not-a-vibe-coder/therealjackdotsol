# Portfolio

Art-directed creative developer portfolio — React + Vite + TypeScript, Tailwind v4, GSAP ScrollTrigger, Lenis, Three.js.

```sh
bun install
bun run dev      # http://localhost:5173
bun run build    # type-check + production build (index + /playground/)
bun run lint
```

## Make it yours

- `src/data/site.ts` — name, role, availability, playground/legal links, and contact URLs
  (GitHub, X, email) used by the footer's social card.
- `src/data/projects.ts` — titles, years, optional `href` (case study) and `image`
  (e.g. `/projects/mirage.webp` in `public/`). Without an image, an original generated
  visual from `ProjectVisual.tsx` is used. `layout` controls the desktop composition.
- `src/data/toolkit.ts` — toolkit cards (colours, glyphs, hover notes).
- `src/playground/Playground.tsx` — the `/playground/` destination and legal notice placeholder.

## shadcn / UI components

The project follows the shadcn layout: `components.json`, the `@/` → `src/` alias, `cn()` in
`src/lib/utils.ts`, and reusable primitives in `src/components/ui/` (e.g. `social-card.tsx`).
Adding more with `bunx shadcn@latest add <component>` will place them there too.

## Structure

| Section | File | Motion |
| --- | --- | --- |
| Hero | `components/Hero3D.tsx`, `lib/heroScene.ts` | Lazy Three.js pebble; pinned frame contracts into a window |
| Manifesto | `components/IntroTypography.tsx` | Pinned, scrubbed per-character reveal, detaching letters, word exit |
| Journey + bridge | `components/JourneySection.tsx`, `GradientBridge.tsx`, `lib/bridgeTimeline.ts` | One pinned timeline: First → Then → Today → "I bridge" panels → "the two." field |
| Toolkit | `components/ToolkitSection.tsx` | Pinned: two hands of cards pile, fan, and swap with a cream wipe |
| Projects | `components/ProjectGallery.tsx` | Scattered titles, pointer-following preview, keyboard focus support |
| Playground / Closing / Footer | `PlaygroundSection.tsx`, `ClosingTypography.tsx`, `Footer.tsx` | Word reveals, per-letter gradient "Together", grainy gradient panel |

Pinned layouts are applied by GSAP (`.is-staged`) only when motion is allowed, so with
`prefers-reduced-motion` or no JavaScript every section renders as a readable stacked page.
Mobile swaps the pinned toolkit for a simple staggered reveal.
