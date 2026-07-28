'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { clamp } from '@/utils/lerp';

interface ScrollScrubOptions {
    /** The tall pinned/spacer element that defines the scrub distance. */
    trigger: RefObject<HTMLElement | null>;
    /** The <video> element to scrub. */
    video: RefObject<HTMLVideoElement | null>;
    /** Easing factor for the currentTime lerp (0..1). Lower = smoother/laggier. */
    ease?: number;
    /** Disable scrubbing entirely (e.g. reduced motion) — caller handles fallback. */
    enabled?: boolean;
    /** Called every frame with scrub progress 0..1 (for overlay fades, HUD, etc.). */
    onProgress?: (progress: number) => void;
}

/**
 * Scroll-controlled video playback.
 *
 * A ScrollTrigger measures progress across `trigger`; a gsap.ticker loop eases
 * the video's `currentTime` toward `progress * duration` so seeking feels smooth
 * rather than jumpy. Requires an all-keyframe encode for instant seeks
 * (`ffmpeg -g 1 -keyint_min 1 -sc_threshold 0 ...`) — a normal GOP structure
 * makes arbitrary seeks decode-heavy and the scrub stutters.
 */
export function useScrollScrub({
    trigger,
    video,
    ease = 0.12,
    enabled = true,
    onProgress,
}: ScrollScrubOptions): void {
    const progressRef = useRef(0);
    const currentRef = useRef(0);
    const seekingRef = useRef(false);
    const seekStartRef = useRef(0);
    const readyRef = useRef(false);

    useEffect(() => {
        const vid = video.current;
        const trg = trigger.current;
        if (!vid || !trg || !enabled) return;

        const onMeta = () => {
            readyRef.current = Number.isFinite(vid.duration) && vid.duration > 0;
            // Reset the eased accumulator too: if the element's resource was ever
            // reloaded mid-session, duration briefly reports NaN, and NaN entering
            // this lerp via `+=` poisons it permanently (NaN arithmetic never
            // recovers), silently freezing the seek forever.
            currentRef.current = 0;
            seekingRef.current = false;
            try {
                vid.pause();
                vid.currentTime = 0;
            } catch {
                /* noop */
            }
        };
        if (vid.readyState >= 1 && vid.duration) onMeta();
        vid.addEventListener('loadedmetadata', onMeta);
        vid.addEventListener('loadeddata', onMeta);

        const onSeeked = () => {
            seekingRef.current = false;
        };
        vid.addEventListener('seeked', onSeeked);

        const st = ScrollTrigger.create({
            trigger: trg,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                progressRef.current = clamp(self.progress);
            },
        });

        const tick = () => {
            const p = progressRef.current;
            onProgress?.(p);

            if (!readyRef.current || !Number.isFinite(vid.duration)) return;

            const target = p * vid.duration;
            currentRef.current += (target - currentRef.current) * ease;
            if (Math.abs(target - currentRef.current) < 0.004) currentRef.current = target;

            // release a stuck seek latch if a 'seeked' event was missed
            if (seekingRef.current && performance.now() - seekStartRef.current > 120) {
                seekingRef.current = false;
            }

            if (
                !seekingRef.current &&
                vid.readyState >= 2 &&
                Math.abs(vid.currentTime - currentRef.current) > 0.01
            ) {
                seekingRef.current = true;
                seekStartRef.current = performance.now();
                try {
                    vid.currentTime = currentRef.current;
                } catch {
                    seekingRef.current = false;
                }
            }
        };

        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            st.kill();
            vid.removeEventListener('loadedmetadata', onMeta);
            vid.removeEventListener('loadeddata', onMeta);
            vid.removeEventListener('seeked', onSeeked);
        };
    }, [trigger, video, ease, enabled, onProgress]);
}
