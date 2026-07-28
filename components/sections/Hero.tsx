'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useScrollScrub } from '@/hooks/useScrollScrub';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { clamp } from '@/utils/lerp';
import { SITE, VIDEOS } from '@/lib/constants';

/**
 * Pinned, scroll-scrubbed reveal: the sandal's parts settle together and
 * turn into view as you scroll, frame-by-frame, instead of just playing on
 * a timer. The headline sits over it and fades out in the first ~16% of
 * the scroll so the product takes over.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const onProgress = useCallback((p: number) => {
    const fade = 1 - clamp(p / 0.16);
    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(fade);
      overlayRef.current.style.transform = `translateY(${-(1 - fade) * 24}px)`;
      overlayRef.current.style.pointerEvents = fade < 0.05 ? 'none' : 'auto';
    }
    if (fillRef.current) fillRef.current.style.width = `${(p * 100).toFixed(2)}%`;
    if (tcRef.current) {
      const dur = videoRef.current?.duration ?? 0;
      const t = p * dur;
      tcRef.current.textContent = `${t.toFixed(1)}s`;
    }
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

  // Intro: headline lines clip-reveal after the preloader clears. Unrelated
  // to scroll — this always plays once, on mount.
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero__line .hero__inner', {
        yPercent: 115,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 2.5,
      });
      gsap.from('.hero__meta', { opacity: 0, y: 20, duration: 1, delay: 3.2, stagger: 0.1 });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const lines = ['Made for the walk', 'you did not plan.'];

  return (
    <section
      ref={root}
      id="top"
      aria-label="Watch the Happenstance Sandal come together"
      className={reduced ? 'relative h-[100svh] w-full' : 'relative h-[450vh] w-full'}
    >
      <div
        className={
          reduced
            ? 'relative h-[100svh] w-full overflow-hidden'
            : 'sticky top-0 h-[100svh] w-full overflow-hidden'
        }
      >
        {/* fullscreen scroll-scrubbed video */}
        <video
          ref={videoRef}
          poster={VIDEOS.hero.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={VIDEOS.hero.src} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

        {/* floating glass elements */}
        {!reduced && (
          <>
            <motion.div
              aria-hidden
              className="absolute left-[12%] top-[28%] h-24 w-24 rounded-2xl border border-sand/15 bg-sand/5 backdrop-blur-md"
              animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="absolute right-[14%] top-[40%] h-16 w-16 rounded-full border border-bronze/30 bg-bronze/10 backdrop-blur-md"
              animate={{ y: [0, 22, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        {/* content — fades out early as the reveal scrub takes over */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 mx-auto flex max-w-[1600px] flex-col justify-end px-6 pb-20 md:px-10 md:pb-28"
        >
          <p className="hero__meta font-mono text-xs uppercase tracking-label text-bronze">
            {SITE.name} — Vol. 01
          </p>

          <h1 className="mt-6 font-display text-fluid-lg leading-[0.88] tracking-tightest text-sand">
            {lines.map((line, i) => (
              <span key={i} className="hero__line block overflow-hidden">
                <span className="hero__inner block will-change-transform">{line}</span>
              </span>
            ))}
          </h1>

          <div className="hero__meta mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
            <MagneticButton href="#cta">Reserve a pair</MagneticButton>
            <MagneticButton href="#story" variant="ghost">See the craft</MagneticButton>
          </div>
        </div>

        {/* scrub HUD */}
        {!reduced && (
          <div
            aria-hidden
            className="hero__meta absolute inset-x-6 bottom-8 z-10 mx-auto flex max-w-[1600px] items-center gap-3 font-mono text-[11px] uppercase tracking-label text-dune md:inset-x-10"
          >
            <span ref={tcRef} className="text-sand">0.0s</span>
            <span className="relative h-px flex-1 overflow-hidden bg-sand/15">
              <span ref={fillRef} className="absolute inset-y-0 left-0 w-0 bg-bronze" />
            </span>
            <span className="whitespace-nowrap">Scroll to reveal</span>
          </div>
        )}

        {reduced && (
          <motion.div
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-sand/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            aria-hidden
          >
            <FiArrowDown size={22} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
