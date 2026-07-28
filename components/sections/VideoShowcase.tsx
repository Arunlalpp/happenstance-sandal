'use client';

import { useRef } from 'react';
import { SandalBuild } from '@/components/ui/SandalBuild';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Scroll-scrubbed photo sequence: the sandal's layers hang exploded, then
 * assemble into the finished pair as you scroll through the pinned frame.
 * Identical on touch and pointer devices, since it's driven by scroll
 * position, not the cursor.
 */
export function VideoShowcase() {
  const triggerRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="showcase"
      ref={triggerRef}
      className={reduced ? 'relative h-[100svh]' : 'relative h-[400vh]'}
    >
      <div
        className={
          reduced
            ? 'relative h-[100svh] overflow-hidden bg-ink'
            : 'sticky top-0 h-[100svh] overflow-hidden bg-ink'
        }
      >
        <SandalBuild triggerRef={triggerRef} className="absolute inset-0" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink/80 via-transparent to-ink/30"
        />

        <div className="pointer-events-none absolute inset-0 z-[2] grid content-end px-6 pb-20 md:px-10 md:pb-28">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="font-mono text-xs uppercase tracking-label text-bronze">
              The making — keep scrolling
            </p>
            <AnimatedText
              as="h2"
              text="Forty hours in the hand."
              className="mt-6 max-w-2xl font-display text-fluid-md leading-[0.95] text-sand"
            />
            <p className="mt-6 max-w-md text-lg leading-relaxed text-dune">
              Every pair passes through one bench, one maker, and a great deal of
              patience — straps, footbed, midsole, and outsole, settling together
              in front of you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
