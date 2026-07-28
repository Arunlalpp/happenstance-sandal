'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useScrollScrub } from '@/hooks/useScrollScrub';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { clamp } from '@/utils/lerp';
import { cn } from '@/utils/cn';
import { SITE, VIDEOS } from '@/lib/constants';

/**
 * Floating glass particles behind the headline. Each idles on its own loop
 * (framer-motion) while a separate cursor-parallax offset — applied to the
 * wrapping <div>, not the animated child — nudges it toward the pointer.
 * Splitting the two onto different nodes avoids GSAP and framer-motion
 * fighting over the same element's transform.
 */
const PARTICLES = [
    { size: 96, top: '22%', left: '10%', depth: 0.35, shape: 'rounded-2xl border-sand/15 bg-sand/5', floatY: -18, floatRotate: 6, duration: 7 },
    { size: 64, top: '40%', right: '14%', depth: 0.5, shape: 'rounded-full border-bronze/30 bg-bronze/10', floatY: 22, floatRotate: -8, duration: 9 },
    { size: 22, top: '66%', left: '22%', depth: 0.75, shape: 'rounded-full border-sand/20 bg-sand/10', floatY: 14, floatRotate: 0, duration: 5.5 },
    { size: 34, top: '74%', right: '26%', depth: 0.6, shape: 'rounded-xl border-bronze/25 bg-bronze/5', floatY: -12, floatRotate: 10, duration: 8 },
    { size: 14, top: '16%', right: '32%', depth: 0.95, shape: 'rounded-full border-sand/25 bg-sand/15', floatY: 10, floatRotate: 0, duration: 4.5 },
] as const;

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
    const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
    const reduced = usePrefersReducedMotion();
    const isMobile = useIsMobile();

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

    // Cursor parallax: each particle drifts toward the pointer, scaled by its
    // own depth, so closer ones move more than farther ones. Window-relative
    // (not element-relative) since the section itself is 450vh tall — only
    // the pinned 100svh slice is ever visible, and that always fills the
    // viewport.
    useEffect(() => {
        if (reduced || isMobile) return;
        const movers = particleRefs.current.map((el) =>
            el ? { x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }) } : null,
        );
        const onMove = (e: PointerEvent) => {
            const px = (e.clientX / window.innerWidth) * 2 - 1;
            const py = (e.clientY / window.innerHeight) * 2 - 1;
            PARTICLES.forEach((p, i) => {
                movers[i]?.x(px * 60 * p.depth);
                movers[i]?.y(py * 60 * p.depth);
            });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, [reduced, isMobile]);

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

                {/* floating glass particles — idle loop + cursor parallax */}
                {!reduced &&
                    PARTICLES.map((p, i) => (
                        <div
                            key={i}
                            ref={(el) => {
                                particleRefs.current[i] = el;
                            }}
                            aria-hidden
                            className="pointer-events-none absolute will-change-transform"
                            style={{
                                top: p.top,
                                left: 'left' in p ? p.left : undefined,
                                right: 'right' in p ? p.right : undefined,
                                width: p.size,
                                height: p.size,
                            }}
                        >
                            <motion.div
                                className={cn('h-full w-full border backdrop-blur-md', p.shape)}
                                animate={{ y: [0, p.floatY, 0], rotate: [0, p.floatRotate, 0] }}
                                transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>
                    ))}

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
                                <span className="hero__inner block will-change-transform">
                                    {line}
                                </span>
                            </span>
                        ))}
                    </h1>

                    <div className="hero__meta mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center">
                        <MagneticButton href="#cta">Reserve a pair</MagneticButton>
                        <MagneticButton href="#story" variant="ghost">
                            See the craft
                        </MagneticButton>
                    </div>
                </div>

                {/* scrub HUD */}
                {!reduced && (
                    <div
                        aria-hidden
                        className="hero__meta absolute inset-x-6 bottom-8 z-10 mx-auto flex max-w-[1600px] items-center gap-3 font-mono text-[11px] uppercase tracking-label text-dune md:inset-x-10"
                    >
                        <span ref={tcRef} className="text-sand">
                            0.0s
                        </span>
                        <span className="relative h-px flex-1 overflow-hidden bg-sand/15">
                            <span
                                ref={fillRef}
                                className="absolute inset-y-0 left-0 w-0 bg-bronze"
                            />
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
