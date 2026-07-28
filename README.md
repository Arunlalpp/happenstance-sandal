# Happenstance Sandal — cinematic landing page

A dark, luxury, video-driven single-product experience built with **Next.js 15
(App Router)**, **TypeScript**, **Tailwind**, **React Three Fiber**, **GSAP +
ScrollTrigger**, **Framer Motion**, and **Lenis** smooth scrolling.

Design language: warm espresso-and-leather palette, `Fraunces` display + `Inter`
body + `JetBrains Mono` labels, glassmorphism, cinematic spacing.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Placeholder videos/images are already in `public/` so it runs immediately.
Swap in your own assets — see `public/videos/README.md` and
`public/images/README.md`. All copy + asset paths live in `lib/constants.ts`.

```bash
npm run build        # production build
npm run typecheck    # strict TS check
```

## Architecture

```
app/                     Server components + layout, fonts, metadata, globals
  layout.tsx             Fonts, Preloader, Navbar, Cursor, SmoothScrollProvider
  page.tsx               Composes the 8 sections in storytelling order
components/
  providers/             Lenis smooth scroll + cinematic Preloader
  layout/                Navbar (glass, responsive) + CustomCursor
  sections/              Hero, Story, VideoShowcase, Scene, Features, Stats, Gallery, FinalCTA
  ui/                    VideoSection*, AnimatedText, MagneticButton, FeatureCard, Footer
  three/                 SandalScene (R3F) + SoleMesh + particles
hooks/                   reduced-motion, media query, mouse, GSAP reveal, iso layout effect
lib/                     gsap plugin registration + constants (content model)
utils/                   cn(), lerp/clamp/mapRange
public/videos, /images   your assets (placeholders included)
```

`* VideoSection` is the reusable core: lazy poster, IntersectionObserver
play/pause, an optional **scroll-scrubbed** playback mode, custom controls,
replay, smooth blur-in — all reduced-motion aware.

## How the animation system fits together

- **Lenis** runs off GSAP's single ticker (`SmoothScrollProvider`) so smooth
  scroll and every ScrollTrigger share one rAF loop — no jank, no double loops.
- **GSAP `context()`** scopes and auto-reverts every animation on unmount.
- **Reduced motion** is honored in two layers: each JS hook checks
  `prefers-reduced-motion` and short-circuits, and `globals.css` neutralizes
  transitions as a backstop.

## Performance notes (targeting 95+ Lighthouse)

- R3F scene is `dynamic(..., { ssr: false })` — zero WebGL cost until scrolled to.
- DPR clamped + `AdaptiveDpr` + `PerformanceMonitor` auto-downgrade; particle
  counts drop on mobile; scene falls back to a CSS glow under reduced motion.
- Videos are `preload="metadata"` with poster frames carrying the LCP; off-screen
  videos pause via IntersectionObserver.
- Fonts via `next/font` (self-hosted, `display: swap`).
- **Do**: compress your MP4s (`crf 26`, `+faststart`) and add `.webm` sources.
- **Do**: convert gallery `<img>` to `next/image` once real assets land.

## Swapping the 3D model

`components/three/SoleMesh.tsx` uses a stylized transmission form. To use a real
model, drop a `.glb` in `public/` and replace the mesh with:

```tsx
import { useGLTF } from '@react-three/drei';
const { scene } = useGLTF('/sandal.glb');
return <primitive object={scene} />;
```

## Optional upgrades

- **Bloom / depth-of-field**: `npm i @react-three/postprocessing` and wrap the
  scene in `<EffectComposer><Bloom/><DepthOfField/></EffectComposer>`.
- **GSAP SplitText**: `AnimatedText` is a dependency-free split; swap in the
  official plugin if you have a Club GreenSock license.
