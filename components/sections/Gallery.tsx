'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { GALLERY } from '@/lib/constants';
import { cn } from '@/utils/cn';

const spanMap: Record<string, string> = {
    tall: 'row-span-2',
    wide: 'col-span-2',
    square: '',
};

/** Editorial masonry-ish grid with clip-path reveals + gentle parallax. */
export function Gallery() {
    const root = useRef<HTMLDivElement>(null);
    const reduced = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        const el = root.current;
        if (!el || reduced) return;
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray<HTMLElement>('.gallery__item');
            items.forEach((item, i) => {
                gsap.fromTo(
                    item,
                    { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        y: 0,
                        duration: 1.1,
                        ease: 'power4.out',
                        scrollTrigger: { trigger: item, start: 'top 90%' },
                        delay: (i % 3) * 0.08,
                    },
                );
                // subtle parallax on the inner image
                const img = item.querySelector('.gallery__img');
                if (img) {
                    gsap.to(img, {
                        yPercent: -12,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    });
                }
            });
        }, el);
        return () => ctx.revert();
    }, [reduced]);

    return (
        <section id="gallery" ref={root} className="relative bg-ink px-6 py-32 md:px-10">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-14 flex items-end justify-between">
                    <AnimatedText
                        as="h2"
                        text="Worn in."
                        className="font-display text-fluid-md text-sand"
                    />
                    <span className="font-mono text-xs uppercase tracking-label text-dune">
                        Field archive
                    </span>
                </div>

                <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-4">
                    {GALLERY.map((g) => (
                        <div
                            key={g.src}
                            className={cn(
                                'gallery__item group relative overflow-hidden rounded-2xl bg-umber',
                                spanMap[g.span],
                            )}
                        >
                            <Image
                                src={g.src}
                                alt={g.alt}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                loading="lazy"
                                className="gallery__img scale-105 object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <span className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-widest text-sand opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                {g.alt}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
