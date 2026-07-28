'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * A soft trailing dot + ring that grows over interactive elements.
 * Rendered only on fine-pointer devices; hidden for touch and reduced-motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (isMobile || reduced) return;
    const xTo = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' });
    const dxTo = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const dyTo = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      dxTo(e.clientX); dyTo(e.clientY);
    };

    const grow = () => gsap.to(ring.current, { scale: 1.8, opacity: 0.6, duration: 0.3 });
    const shrink = () => gsap.to(ring.current, { scale: 1, opacity: 1, duration: 0.3 });

    window.addEventListener('pointermove', onMove, { passive: true });
    const interactive = document.querySelectorAll('a, button, [data-cursor="hover"]');
    interactive.forEach((el) => {
      el.addEventListener('pointerenter', grow);
      el.addEventListener('pointerleave', shrink);
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      interactive.forEach((el) => {
        el.removeEventListener('pointerenter', grow);
        el.removeEventListener('pointerleave', shrink);
      });
    };
  }, [isMobile, reduced]);

  if (isMobile || reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden="true">
      <div
        ref={ring}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border border-bronze/60"
      />
      <div
        ref={dot}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-bronze"
      />
    </div>
  );
}
