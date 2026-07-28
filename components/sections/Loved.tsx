'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { gsap } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useGsapReveal } from '@/hooks/useGsapReveal';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { VideoSection } from '@/components/ui/VideoSection';
import { clamp } from '@/utils/lerp';
import { REVIEWS, REVIEW_SUMMARY, VIDEOS } from '@/lib/constants';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 text-bronze" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating - i;
        if (filled >= 1) return <FaStar key={i} size={12} />;
        if (filled >= 0.5) return <FaStarHalfAlt key={i} size={12} />;
        return <FaRegStar key={i} size={12} />;
      })}
    </span>
  );
}

/**
 * Social proof: a sticky rating bar pins beneath the heading while
 * reviews scroll past underneath it, echoing a running "spine" through
 * the section. Mirrors oryzo.ai's testimonial pattern, restyled to fit.
 *
 * The circular media above it tracks whichever review is "active" — hover
 * a row and it swaps in that row's shot; scroll past one (no hover needed,
 * e.g. on touch) and it swaps too, via the row nearest the viewport centre.
 */
export function Loved() {
  const popRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const rowElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const rowsRef = useGsapReveal<HTMLDivElement>({ childSelector: '.review-row', stagger: 0.1, y: 24 });

  // The disc chases the cursor anywhere across the header band, offset from
  // its own resting (flex-centered) position — same technique as
  // MagneticButton, just with a much larger range and a static "home" rect
  // (homeRef never gets a transform, so its center is a stable reference —
  // measuring off the disc itself would feed its own moved position back in).
  const onHeaderMove = (e: React.MouseEvent) => {
    if (isMobile || reduced || !homeRef.current || !circleRef.current) return;
    const rect = homeRef.current.getBoundingClientRect();
    const x = clamp(e.clientX - (rect.left + rect.width / 2), -260, 260);
    const y = clamp(e.clientY - (rect.top + rect.height / 2), -70, 120);
    gsap.to(circleRef.current, { x, y, duration: 0.7, ease: 'power3.out' });
  };
  const onHeaderLeave = () => {
    if (!circleRef.current) return;
    gsap.to(circleRef.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' });
  };

  // Scroll-linked "which review is active" — the row crossing the viewport's
  // vertical centre wins, so the disc updates on scroll even without a hover.
  useEffect(() => {
    const rows = rowElsRef.current.filter((el): el is HTMLDivElement => el !== null);
    if (!rows.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = rowElsRef.current.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActive(i);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    rows.forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, []);

  // A small "pop" every time the active review changes, on its own nested
  // element so it doesn't fight the parallax transform on mediaRef above.
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = popRef.current;
    if (!el) return;
    gsap.fromTo(el, { scale: 1.08 }, { scale: 1, duration: 0.6, ease: 'power3.out' });
  }, [active, reduced]);

  return (
    <section id="loved" className="relative bg-ink px-6 py-32 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <AnimatedText
            as="h2"
            text="People all around the world love the Happenstance."
            className="font-display text-fluid-md leading-[0.95] text-sand"
          />
          <p className="max-w-md text-lg leading-relaxed text-dune md:justify-self-end md:text-right">
            Do not take our word for it — see what people say after living in
            theirs.
          </p>
        </div>

        {/* Circle + rating bar stick together at the top of the viewport
            while the reviews scroll past beneath, so the disc is always
            there to react to whichever row you're on. */}
        <div
          className="sticky top-24 z-10 -mx-6 mt-16 border-y border-dashed border-sand/15 bg-ink/90 px-6 pb-5 pt-8 backdrop-blur-md md:-mx-10 md:mt-20 md:px-10"
          onMouseMove={onHeaderMove}
          onMouseLeave={onHeaderLeave}
        >
          <div ref={homeRef} className="mb-6 flex justify-center">
            <div
              ref={circleRef}
              className="relative h-[140px] w-[140px] overflow-hidden rounded-full border border-sand/15 shadow-glass will-change-transform sm:h-[170px] sm:w-[170px] md:h-[200px] md:w-[200px]"
            >
              <div ref={popRef} className="absolute inset-0">
                {/* Own wrapper for the opacity toggle: VideoSection drives its
                    own GSAP reveal via inline style on its root, which would
                    fight a className-based opacity toggle applied directly to it. */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${active === null ? 'opacity-100' : 'opacity-0'}`}
                >
                  <VideoSection
                    src={VIDEOS.loved.src}
                    poster={VIDEOS.loved.poster}
                    mode="inview"
                    rounded={false}
                    className="h-full w-full"
                  />
                </div>
                {REVIEWS.map((r, i) => (
                  <Image
                    key={r.name}
                    src={r.image}
                    alt=""
                    fill
                    sizes="200px"
                    className={`absolute inset-0 object-cover transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-dashed border-sand/15 pt-4 font-mono text-[11px] uppercase tracking-label md:text-xs">
            <span className="text-dune">Rating &amp; reviews</span>
            <span className="flex flex-wrap items-center gap-3 text-sand">
              Custom reviews [ {REVIEW_SUMMARY.count} ]
              <Stars rating={REVIEW_SUMMARY.rating} />
              [ {REVIEW_SUMMARY.rating}/5 ]
            </span>
            <span className="text-dune">
              {active !== null ? REVIEWS[active].name : 'Happenstance in the wild'}
            </span>
          </div>
        </div>

        <div ref={rowsRef}>
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              ref={(el) => {
                rowElsRef.current[i] = el;
              }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="review-row flex flex-col-reverse items-start gap-6 border-b border-dashed border-sand/10 py-10 md:flex-row md:items-center md:justify-between md:gap-10"
            >
              <div className="max-w-2xl">
                <Stars rating={r.rating} />
                <p className="mt-4 text-xl leading-relaxed text-sand md:text-2xl">
                  “
                  {r.quote.split(r.highlight).map((part, i2, arr) => (
                    <span key={i2}>
                      {part}
                      {i2 < arr.length - 1 && <span className="text-bronze">{r.highlight}</span>}
                    </span>
                  ))}
                  ”
                </p>
                <p className="mt-6 font-mono text-xs uppercase tracking-label text-dune">
                  {r.name} <span className="text-dune/60">— {r.role}</span>
                </p>
              </div>

              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-sand/10 sm:h-28 sm:w-28 md:h-32 md:w-32">
                <Image
                  src={r.image}
                  alt=""
                  width={480}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
