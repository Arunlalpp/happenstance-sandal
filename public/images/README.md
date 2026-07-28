# Drop your images here

Placeholders are auto-generated brand swatches. Replace with real stills,
keeping the filenames (or edit `lib/constants.ts`).

- `hero-poster.jpg`, `story-poster.jpg`, `showcase-poster.jpg` — poster frames
  shown instantly while each video loads (they carry your LCP, so keep them
  sharp and well-compressed).
- `gallery-1.jpg` … `gallery-6.jpg` — editorial grid. Mixed aspect ratios are
  intentional (see the `span` field in `GALLERY`).

Export as optimized JPG or WebP (~1600px on the long edge, quality ~80).
Once real images are in, switch the gallery `<img>` tags to `next/image` for
automatic responsive sizing.
