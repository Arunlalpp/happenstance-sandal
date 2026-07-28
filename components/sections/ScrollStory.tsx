'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useScrollScrub } from '@/hooks/useScrollScrub';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { clamp } from '@/utils/lerp';
import { VIDEOS } from '@/lib/constants';

const BEATS = [
  {
    eyebrow: 'In motion',
    title: 'Every angle, considered.',
    body: 'Turn it over. Every curve was made to be looked at from more than one side.',
  },
  {
    eyebrow: 'In motion',
    title: 'Turning, in the light.',
    body: 'A single hide, a single pour of cork — caught mid-rotation.',
  },
  {
    eyebrow: 'Packaging',
    title: 'Ready for the box.',
    body: 'The same care that shapes the sandal shapes what it travels in.',
  },
  {
    eyebrow: 'Packaging',
    title: 'Boxed by hand.',
    body: 'Foil-stamped, hand-folded, closed with a soft click.',
  },
  {
    eyebrow: 'Yours',
    title: 'Packaged. Ready.',
    body: 'Everything you just watched happens to every pair, every time.',
  },
] as const;

/**
 * Pinned, scroll-scrubbed product film: the sandal floats and turns in
 * frame-by-frame lockstep with scroll (same useScrollScrub pattern as the
 * Hero video), while text beats crossfade underneath at even intervals
 * across the same progress value.
 */
export function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  const onProgress = useCallback((p: number) => {
    const t = clamp(p) * (BEATS.length - 1);
    const nearest = Math.round(t);
    // Only the nearest beat is ever shown — a narrow fade band with a brief
    // blank gap between beats, rather than a full crossfade. Two headlines
    // occupying the same spot read as noise when blended; a clean handoff
    // (fade out, pause, fade in) doesn't.
    beatRefs.current.forEach((el, i) => {
      if (!el) return;
      const o = i === nearest ? clamp(1 - Math.abs(t - i) / 0.35) : 0;
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - o) * 16}px)`;
      el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
    });
  }, []);

  useScrollScrub({ trigger: root, video: videoRef, enabled: !reduced, onProgress });

  // Reduced motion: quiet autoplay loop instead of scroll-scrubbing.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !reduced) return;
    v.loop = true;
    v.muted = true;
    v.play().catch(() => undefined);
  }, [reduced]);

  if (reduced) {
    return (
      <section id="scene" className="relative h-[100svh] w-full overflow-hidden bg-ink">
        <video
          ref={videoRef}
          poster={VIDEOS.scene.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEOS.scene.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
        <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1600px] flex-col justify-center px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-label text-bronze">In motion</p>
          <AnimatedText as="h2" text="Packaged, ready." className="mt-4 font-display text-fluid-lg leading-[0.9] text-sand" />
          <p className="mt-6 max-w-sm text-dune">Every pair is boxed by hand before it reaches you.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="scene" ref={root} className="relative h-[400vh] w-full bg-ink">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <video
          ref={videoRef}
          poster={VIDEOS.scene.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEOS.scene.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

        {BEATS.map((beat, i) => (
          <div
            key={beat.title}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
            className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1600px] flex-col justify-center px-6 opacity-0 will-change-transform md:px-10"
          >
            <p className="font-mono text-xs uppercase tracking-label text-bronze">{beat.eyebrow}</p>
            <h2 className="mt-4 max-w-xl font-display text-fluid-lg leading-[0.9] text-sand">{beat.title}</h2>
            <p className="mt-6 max-w-sm text-dune">{beat.body}</p>
            {i === BEATS.length - 1 && (
              <div className="pointer-events-auto mt-8">
                <MagneticButton href="#cta">Shop now — $240</MagneticButton>
              </div>
            )}
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-6 bottom-8 z-10 flex justify-between font-mono text-[10px] uppercase tracking-label text-dune md:inset-x-10">
          <span>Scroll to unfold</span>
          <span>4× viewport</span>
        </div>
      </div>
    </section>
  );
}
