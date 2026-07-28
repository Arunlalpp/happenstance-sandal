'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { SITE } from '@/lib/constants';

/**
 * Cinematic intro: a counter climbs to 100 while the wordmark settles,
 * then the curtain lifts. Skipped instantly under reduced-motion.
 */
export function Preloader() {
    const root = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);
    const [done, setDone] = useState(false);
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) {
            setDone(true);
            document.body.dataset.loaded = 'true';
            return;
        }
        const counter = { v: 0 };
        const tl = gsap.timeline({
            onComplete: () => {
                setDone(true);
                document.body.dataset.loaded = 'true';
            },
        });

        tl.to(counter, {
            v: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (countRef.current) countRef.current.textContent = String(Math.round(counter.v));
            },
        })
            .to(
                '.preloader__word',
                { yPercent: -110, stagger: 0.06, duration: 0.7, ease: 'power4.in' },
                '-=0.3',
            )
            .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.1');

        return () => {
            tl.kill();
        };
    }, [reduced]);

    if (done) return null;

    return (
        <div
            ref={root}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
            aria-hidden="true"
        >
            <div className="overflow-hidden">
                <div className="preloader__word font-display text-fluid-md text-sand">
                    {SITE.name}
                </div>
            </div>
            <div className="mt-6 font-mono text-sm tracking-label text-dune">
                <span ref={countRef}>0</span>
                <span className="text-bronze"> / 100</span>
            </div>
        </div>
    );
}
