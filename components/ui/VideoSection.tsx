'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw } from 'react-icons/fi';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { clamp } from '@/utils/lerp';
import { cn } from '@/utils/cn';

type Mode = 'autoplay' | 'inview' | 'scrub';

type Props = {
    src: string;
    poster?: string;
    className?: string;
    /**
     * autoplay: muted loop, plays whenever mounted.
     * inview : plays when >=50% visible, pauses when off-screen (default).
     * scrub  : playback position is driven by scroll progress over the section.
     */
    mode?: Mode;
    controls?: boolean;
    rounded?: boolean;
    overlay?: React.ReactNode;
    /** Extra scroll length (in viewport heights) for scrub mode pinning. */
    scrubLength?: number;
};

/**
 * Reusable, performance-minded video block:
 *  - lazy metadata + poster for fast LCP
 *  - IntersectionObserver play/pause (saves battery + GPU off-screen)
 *  - scroll-scrubbed playback option (GSAP)
 *  - smooth fade-in, custom controls, replay
 *  - reduced-motion: shows the poster frame, no auto motion
 */
export function VideoSection({
    src,
    poster,
    className,
    mode = 'inview',
    controls = false,
    rounded = true,
    overlay,
    scrubLength = 1.5,
}: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);
    const [playing, setPlaying] = useState(false);
    const reduced = usePrefersReducedMotion();

    // Fade in once the wrapper enters the viewport.
    useIsomorphicLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el || reduced) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { opacity: 0, scale: 0.96, filter: 'blur(12px)' },
                {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                },
            );
        }, el);
        return () => ctx.revert();
    }, [reduced]);

    // Reload when `src` changes after mount (e.g. a consumer swapping
    // between desktop/mobile sources via useIsMobile, which starts false on
    // the server). A <source> child's src attribute changing doesn't make
    // the browser pick it up on its own — it needs an explicit load().
    useEffect(() => {
        videoRef.current?.load();
    }, [src]);

    // inview + autoplay playback control
    useEffect(() => {
        const video = videoRef.current;
        if (!video || mode === 'scrub') return;

        if (mode === 'autoplay') {
            video.play().catch(() => {});
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video
                        .play()
                        .then(() => setPlaying(true))
                        .catch(() => {});
                } else {
                    video.pause();
                    setPlaying(false);
                }
            },
            { threshold: 0.5 },
        );
        io.observe(video);
        return () => io.disconnect();
    }, [mode, src]);

    // scrub mode: map scroll progress -> currentTime
    useIsomorphicLayoutEffect(() => {
        const video = videoRef.current;
        const el = wrapRef.current;
        if (!video || !el || mode !== 'scrub' || reduced) return;

        let st: ScrollTrigger | undefined;
        const setup = () => {
            const duration = video.duration || 1;
            st = ScrollTrigger.create({
                trigger: el,
                start: 'top top',
                end: `+=${scrubLength * 100}%`,
                pin: true,
                scrub: 0.6,
                onUpdate: (self) => {
                    video.currentTime = clamp(self.progress) * duration;
                },
            });
        };
        if (video.readyState >= 1) setup();
        else video.addEventListener('loadedmetadata', setup, { once: true });

        return () => st?.kill();
    }, [mode, reduced, scrubLength, src]);

    const toggle = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play();
            setPlaying(true);
        } else {
            v.pause();
            setPlaying(false);
        }
    }, []);

    const replay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = 0;
        v.play();
        setPlaying(true);
    }, []);

    return (
        <div
            ref={wrapRef}
            className={cn('relative overflow-hidden bg-umber', rounded && 'rounded-3xl', className)}
        >
            <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={poster}
                muted
                loop={mode !== 'scrub'}
                playsInline
                preload="metadata"
                // scrub videos must not autoplay; inview handled by observer
                autoPlay={mode === 'autoplay'}
                // Either event can win the race depending on cache/network timing —
                // whichever fires first reveals the video and retires the poster.
                onLoadedData={() => setReady(true)}
                onPlaying={() => setReady(true)}
            >
                <source src={src} type="video/mp4" />
            </video>

            {/* graceful poster fallback while loading / reduced motion */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-700',
                    ready && !reduced ? 'opacity-0' : 'opacity-100',
                )}
                style={poster ? { backgroundImage: `url(${poster})` } : undefined}
            />

            {/* cinematic vignette so overlaid text stays legible */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

            {overlay && <div className="absolute inset-0">{overlay}</div>}

            {controls && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute bottom-4 right-4 flex gap-2"
                >
                    <button
                        onClick={toggle}
                        aria-label={playing ? 'Pause video' : 'Play video'}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/20 bg-ink/50 text-sand backdrop-blur-md transition hover:bg-ink/80"
                    >
                        {playing ? <FiPause /> : <FiPlay />}
                    </button>
                    <button
                        onClick={replay}
                        aria-label="Replay video"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/20 bg-ink/50 text-sand backdrop-blur-md transition hover:bg-ink/80"
                    >
                        <FiRotateCcw />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
