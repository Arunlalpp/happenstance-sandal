'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { STATS } from '@/lib/constants';

/** Counter animations: each value tweens from 0 when it scrolls into view. */
export function Stats() {
    const root = useRef<HTMLDivElement>(null);
    const reduced = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        const el = root.current;
        if (!el) return;

        const nums = gsap.utils.toArray<HTMLElement>('.stat__num');

        if (reduced) {
            nums.forEach((n) => (n.textContent = n.dataset.value ?? '0'));
            return;
        }

        const ctx = gsap.context(() => {
            nums.forEach((n) => {
                const end = Number(n.dataset.value ?? 0);
                const obj = { v: 0 };
                gsap.to(obj, {
                    v: end,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: n, start: 'top 85%' },
                    onUpdate: () => (n.textContent = String(Math.round(obj.v))),
                });
            });
        }, el);
        return () => ctx.revert();
    }, [reduced]);

    return (
        <section
            ref={root}
            className="relative border-y border-sand/10 bg-umber/40 px-6 py-24 md:px-10"
        >
            <div className="mx-auto grid max-w-[1600px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map((s) => (
                    <div key={s.label} className="text-center md:text-left">
                        <div className="font-display text-6xl text-sand md:text-7xl">
                            <span className="stat__num" data-value={s.value}>
                                0
                            </span>
                            <span className="text-bronze">{s.suffix}</span>
                        </div>
                        <p className="mt-3 font-mono text-xs uppercase tracking-label text-dune">
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
