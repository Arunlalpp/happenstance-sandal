'use client';

import { useRef, ElementType } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Stagger by 'word' (default) or 'char'. */
  splitBy?: 'word' | 'char';
  delay?: number;
};

/**
 * Split-text reveal: each word/char rises from a clipped baseline on scroll.
 * A lightweight, dependency-free alternative to GSAP SplitText.
 */
export function AnimatedText({
  text,
  as: Tag = 'span',
  className,
  splitBy = 'word',
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const parts = splitBy === 'char' ? Array.from(text) : text.split(' ');
  const Comp = Tag as any;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.at__inner');
    if (reduced) {
      gsap.set(targets, { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        yPercent: 120,
        duration: 1,
        delay,
        ease: 'power4.out',
        stagger: splitBy === 'char' ? 0.02 : 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, delay, splitBy]);

  return (
    <Comp ref={ref as React.Ref<HTMLElement>} className={cn('block', className)}>
      {parts.map((part, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span className="at__inner inline-block will-change-transform">
            {part}
            {splitBy === 'word' && i < parts.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Comp>
  );
}
