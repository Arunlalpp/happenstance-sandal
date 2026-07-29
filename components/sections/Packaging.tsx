'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { VideoSection } from '@/components/ui/VideoSection';
import { VIDEOS, PACKAGING_DETAILS } from '@/lib/constants';

/**
 * The unboxing: a sticky video pins on the left while five packaging
 * details fade in one at a time on the right, same sticky-column +
 * progress-rail mechanism as StorySection. Closes with a full-width reveal
 * of the boxed pair — one deliberate moment instead of a second card.
 */
export function Packaging() {
    const root = useRef<HTMLDivElement>(null);
    const reveal = useRef<HTMLDivElement>(null);
    const reduced = usePrefersReducedMotion();
    const isMobile = useIsMobile();
    const videoSrc = isMobile ? VIDEOS.packaging.mobileSrc : VIDEOS.packaging.src;
    const videoPoster = isMobile ? VIDEOS.packaging.mobilePoster : VIDEOS.packaging.poster;

    useIsomorphicLayoutEffect(() => {
        const el = root.current;
        if (!el || reduced) return;

        const ctx = gsap.context(() => {
            const beats = gsap.utils.toArray<HTMLElement>('.packaging__beat');

            gsap.to('.packaging__rail-fill', {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true },
            });

            beats.forEach((beat) => {
                gsap.fromTo(
                    beat,
                    { opacity: 0.15, filter: 'blur(6px)' },
                    {
                        opacity: 1,
                        filter: 'blur(0px)',
                        scrollTrigger: {
                            trigger: beat,
                            start: 'top 65%',
                            end: 'bottom 55%',
                            scrub: true,
                        },
                    },
                );
            });

            if (reveal.current) {
                gsap.fromTo(
                    reveal.current,
                    { clipPath: 'inset(0% 0% 100% 0%)', y: 60, scale: 1.04 },
                    {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        y: 0,
                        scale: 1,
                        duration: 1.3,
                        ease: 'power4.out',
                        scrollTrigger: { trigger: reveal.current, start: 'top 85%' },
                    },
                );
            }
        }, el);
        return () => ctx.revert();
    }, [reduced]);

    return (
        <section id="packaging" ref={root} className="relative bg-ink px-6 py-32 md:px-10">
            <div className="mx-auto max-w-[1600px]">
                <p className="font-mono text-xs uppercase tracking-label text-bronze">
                    The unboxing
                </p>
                <AnimatedText
                    as="h2"
                    text="Presented as carefully as it's made."
                    className="mt-6 max-w-2xl font-display text-fluid-md leading-[0.95] text-sand"
                />

                <div className="mt-20 grid gap-16 md:grid-cols-[0.9fr_1.1fr]">
                    {/* sticky left: the pair, turning — centered in the viewport while it sticks */}
                    <div className="md:sticky md:top-1/2 md:h-fit md:-translate-y-1/2">
                        {/* aspect ratio matches each source's native framing: the mobile
                            clip is shot portrait, the desktop one 16:9 — cropping either
                            into the other's shape would crop down to mostly background. */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-umber md:aspect-video">
                            <VideoSection
                                src={videoSrc}
                                poster={videoPoster}
                                mode="autoplay"
                                rounded={false}
                                className="h-full w-full"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                            <span className="pointer-events-none absolute bottom-6 left-6 font-mono text-xs uppercase tracking-label text-sand/80">
                                Every pair, boxed by hand
                            </span>
                        </div>
                    </div>

                    {/* right: detail beats + progress rail */}
                    <div className="relative pl-8">
                        <div className="absolute left-0 top-0 h-full w-px bg-sand/10">
                            <div className="packaging__rail-fill h-full w-full origin-top scale-y-0 bg-bronze" />
                        </div>

                        <div className="space-y-32">
                            {PACKAGING_DETAILS.map((detail) => (
                                <div key={detail.index} className="packaging__beat">
                                    <span className="font-mono text-sm text-bronze">
                                        {detail.index}
                                    </span>
                                    <h3 className="mt-4 font-display text-3xl text-sand md:text-4xl">
                                        {detail.title}
                                    </h3>
                                    <p className="mt-4 max-w-md text-lg leading-relaxed text-dune">
                                        {detail.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* closing reveal: the boxed pair */}
                <div
                    ref={reveal}
                    className="relative mt-24 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-umber"
                >
                    <Image
                        src="/images/packaging.jpg"
                        alt="The Happenstance Sandal beside its box, branding foil-stamped on the lid"
                        fill
                        sizes="100vw"
                        loading="lazy"
                        className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                    <p className="absolute bottom-6 left-6 right-6 font-mono text-xs uppercase tracking-label text-sand/80">
                        Arrives ready. No unboxing manual required.
                    </p>
                </div>
            </div>
        </section>
    );
}
