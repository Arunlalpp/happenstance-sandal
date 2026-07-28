'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/cn';

type Props = {
    title: string;
    body: string;
    tag: string;
    index: number;
};

/** Glass feature card with a pointer-tracked spotlight and 3D tilt. */
export function FeatureCard({ title, body, tag, index }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const onMove = (e: React.MouseEvent) => {
        if (isMobile || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ref.current.style.setProperty('--mx', `${px * 100}%`);
        ref.current.style.setProperty('--my', `${py * 100}%`);
        gsap.to(ref.current, {
            rotateY: (px - 0.5) * 8,
            rotateX: -(py - 0.5) * 8,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 800,
        });
    };
    const onLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
            <div
                ref={ref}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                data-cursor="hover"
                className={cn(
                    'group relative h-full overflow-hidden rounded-3xl border border-sand/10 bg-umber/70 p-8 shadow-glass backdrop-blur-md',
                    '[transform-style:preserve-3d]',
                )}
            >
                {/* pointer spotlight */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                        background:
                            'radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(201,145,94,0.14), transparent 60%)',
                    }}
                />
                <span className="font-mono text-[11px] uppercase tracking-label text-bronze">
                    {tag}
                </span>
                <h3 className="mt-6 font-display text-2xl text-sand">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dune">{body}</p>
            </div>
        </motion.div>
    );
}
