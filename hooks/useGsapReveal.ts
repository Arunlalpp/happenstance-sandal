'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type Options = {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  /** Select children to stagger; if omitted the element itself animates. */
  childSelector?: string;
};

/**
 * Scroll-triggered reveal driven by GSAP. Returns a ref to attach to a section.
 * Respects reduced-motion by simply showing content with no transform.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(opts: Options = {}) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  const {
    y = 40,
    opacity = 0,
    duration = 1,
    stagger = 0.12,
    start = 'top 80%',
    childSelector,
  } = opts;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = childSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(childSelector))
      : [el];
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, y, opacity, duration, stagger, start, childSelector]);

  return ref;
}
