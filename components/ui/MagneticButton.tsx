'use client';

import { useRef, ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

type Props = {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'solid' | 'ghost';
};

/** Button/link that leans toward the cursor with a spring-y magnetic pull. */
export function MagneticButton({ children, href, onClick, className, variant = 'solid' }: Props) {
    const ref = useRef<HTMLElement>(null);
    const isMobile = useIsMobile();

    const onMove = (e: React.MouseEvent) => {
        if (isMobile || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        gsap.to(ref.current, { x: x * 0.35, y: y * 0.4, duration: 0.6, ease: 'power3.out' });
    };
    const onLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' });
    };

    const classes = cn(
        'group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-mono text-xs uppercase tracking-widest transition-colors',
        variant === 'solid'
            ? 'bg-bronze text-ink hover:bg-sand shadow-glow-bronze'
            : 'border border-sand/25 text-sand hover:border-sand',
        className,
    );

    const inner = <span className="relative z-10">{children}</span>;

    return href ? (
        <a
            ref={ref as React.RefObject<HTMLAnchorElement>}
            href={href}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={classes}
            data-cursor="hover"
        >
            {inner}
        </a>
    ) : (
        <button
            ref={ref as React.RefObject<HTMLButtonElement>}
            onClick={onClick}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={classes}
            data-cursor="hover"
        >
            {inner}
        </button>
    );
}
