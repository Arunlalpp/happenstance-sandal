'use client';

import dynamic from 'next/dynamic';
import { AnimatedText } from '@/components/ui/AnimatedText';

// R3F is client-only and heavy — load it lazily, never on the server.
const SandalScene = dynamic(
  () => import('@/components/three/SandalScene').then((m) => m.SandalScene),
  { ssr: false, loading: () => <div className="absolute inset-0 grid place-items-center text-dune font-mono text-xs">loading scene…</div> },
);

/** Full-height interactive WebGL moment with mouse parallax + particles. */
export function SceneSection() {
  return (
    <section id="scene" className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <SandalScene />

      {/* overlaid copy, non-blocking to pointer so the canvas stays interactive */}
      <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1600px] flex-col justify-center px-6 md:px-10">
        <p className="font-mono text-xs uppercase tracking-label text-bronze">In motion</p>
        <AnimatedText
          as="h2"
          text="Turn it over."
          className="mt-4 font-display text-fluid-lg leading-[0.9] text-sand"
        />
        <p className="mt-6 max-w-sm text-dune">
          Move your cursor. Every angle was made to be looked at from more than one.
        </p>
      </div>
    </section>
  );
}
