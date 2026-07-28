'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import Image from 'next/image';
import { ScrollTrigger } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { clamp } from '@/utils/lerp';
import { BUILD_FRAMES, BUILD_ALT } from '@/lib/constants';

interface SandalBuildProps {
  /** The tall ancestor whose scroll distance drives the sequence. */
  triggerRef: RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * A scroll-scrubbed photo sequence: crossfades and settles through the
 * exploded-to-assembled frame set as `triggerRef`'s scroll progress
 * advances. Under reduced motion it renders a single static (fully
 * assembled) frame instead.
 */
export function SandalBuild({ triggerRef, className }: SandalBuildProps) {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();
  const frameCount = BUILD_FRAMES.length;

  // Plain useEffect (passive), not a layout effect: triggerRef points at an
  // ancestor element owned by the parent, and React attaches a host ref in
  // the same bottom-up pass as layout effects — so a descendant's layout
  // effect can run before an ancestor's own ref is attached. Passive effects
  // run in a later pass, after every ref in the tree is attached.
  useEffect(() => {
    if (reduced) return;
    const trg = triggerRef.current;
    if (!trg) return;

    const st = ScrollTrigger.create({
      trigger: trg,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = clamp(self.progress) * (frameCount - 1);
        layerRefs.current.forEach((el, i) => {
          if (!el) return;
          const opacity = clamp(1 - Math.abs(p - i));
          el.style.opacity = String(opacity);
          el.style.transform = `scale(${1.06 - opacity * 0.06})`;
        });
      },
    });

    return () => st.kill();
  }, [reduced, triggerRef, frameCount]);

  if (reduced) {
    return (
      <div className={className} role="img" aria-label={BUILD_ALT}>
        <Image
          src={BUILD_FRAMES[frameCount - 1]}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={className} role="img" aria-label={BUILD_ALT}>
      {BUILD_FRAMES.map((src, i) => (
        <div
          key={src}
          aria-hidden
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
