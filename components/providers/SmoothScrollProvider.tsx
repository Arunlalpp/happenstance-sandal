'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Wires Lenis smooth scrolling into GSAP's ticker and keeps ScrollTrigger in sync.
 * Disabled entirely when the user prefers reduced motion (native scroll instead).
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.6,
        });

        // Drive Lenis from GSAP's ticker for a single, jank-free rAF loop.
        lenis.on('scroll', ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(raf);
            lenis.destroy();
        };
    }, [reduced]);

    return <>{children}</>;
}
