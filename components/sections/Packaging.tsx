'use client';

import { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { VideoSection } from '@/components/ui/VideoSection';
import { VIDEOS } from '@/lib/constants';

/**
 * The unboxing: a quiet beat before the final CTA. The turning pair on one
 * side, the finished box on the other — both curtain-reveal into place as
 * the section scrolls into view, then drift at slightly different rates.
 */
export function Packaging() {
    const root = useRef<HTMLDivElement>(null);
    const reduced = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        const el = root.current;
        if (!el || reduced) return;

        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray<HTMLElement>('.packaging__panel');
            panels.forEach((panel, i) => {
                gsap.fromTo(
                    panel,
                    { clipPath: 'inset(0% 0% 100% 0%)', y: 60 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        y: 0,
                        duration: 1.3,
                        ease: 'power4.out',
                        delay: i * 0.15,
                        scrollTrigger: { trigger: el, start: 'top 75%' },
                    },
                );
                const media = panel.querySelector('.packaging__media');
                if (media) {
                    gsap.to(media, {
                        yPercent: -8,
                        ease: 'none',
                        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
                    });
                }
            });
        }, el);
        return () => ctx.revert();
    }, [reduced]);

    return (
        <section id="packaging" ref={root} className="relative bg-ink px-6 py-32 md:px-10">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-14 flex items-end justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-label text-bronze">The unboxing</p>
                        <AnimatedText
                            as="h2"
                            text="Presented as carefully as it's made."
                            className="mt-6 font-display text-fluid-md leading-[0.95] text-sand"
                        />
                    </div>
                    <span className="hidden font-mono text-xs uppercase tracking-label text-dune md:inline">
                        Every pair, boxed by hand
                    </span>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="packaging__panel relative aspect-[4/5] overflow-hidden rounded-3xl bg-umber md:aspect-[3/4]">
                        <div className="packaging__media absolute inset-0 h-[112%] w-full will-change-transform">
                            <VideoSection
                                src={VIDEOS.packaging.src}
                                poster={VIDEOS.packaging.poster}
                                mode="inview"
                                rounded={false}
                                className="h-full w-full"
                            />
                        </div>
                    </div>

                    <div className="packaging__panel relative aspect-[4/5] overflow-hidden rounded-3xl bg-umber md:aspect-[3/4]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/packaging.jpg"
                            alt="The Happenstance Sandal beside its box, branding foil-stamped on the lid"
                            loading="lazy"
                            className="packaging__media h-[112%] w-full scale-105 object-cover will-change-transform"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                        <p className="absolute bottom-6 left-6 right-6 font-mono text-xs uppercase tracking-label text-sand/80">
                            Arrives ready. No unboxing manual required.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
