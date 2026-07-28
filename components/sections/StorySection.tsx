'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { STORY_BEATS } from '@/lib/constants';

/**
 * Sticky storytelling: the heading pins while three beats cross-fade in,
 * with a progress rail that fills as you move through the section.
 */
export function StorySection() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>('.story__beat');

      // fill the rail across the whole scroll
      gsap.to('.story__rail-fill', {
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
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="story" className="relative bg-ink px-6 py-32 md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-16 md:grid-cols-[0.9fr_1.1fr]">
        {/* sticky left column */}
        <div className="md:sticky md:top-32 md:h-fit">
          <p className="font-mono text-xs uppercase tracking-label text-bronze">The philosophy</p>
          <AnimatedText
            as="h2"
            text="A sandal you keep, not consume."
            className="mt-6 font-display text-fluid-md leading-[0.95] text-sand"
          />
          <p className="mt-6 max-w-md text-dune">
            Three ideas hold the Happenstance together. None of them are new — they
            are just rarely all in the same pair.
          </p>
        </div>

        {/* right column beats + progress rail */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 h-full w-px bg-sand/10">
            <div className="story__rail-fill h-full w-full origin-top scale-y-0 bg-bronze" />
          </div>

          <div className="space-y-32">
            {STORY_BEATS.map((beat) => (
              <div key={beat.index} className="story__beat">
                <span className="font-mono text-sm text-bronze">{beat.index}</span>
                <h3 className="mt-4 font-display text-4xl text-sand md:text-5xl">{beat.title}</h3>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-dune">{beat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
