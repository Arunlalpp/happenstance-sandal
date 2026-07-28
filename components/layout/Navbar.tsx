'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenuAlt4, HiX } from 'react-icons/hi';
import { NAV, SITE } from '@/lib/constants';
import { cn } from '@/utils/cn';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
                    scrolled ? 'backdrop-blur-md' : '',
                )}
            >
                <nav
                    className={cn(
                        'relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10',
                        // NOTE: no margin utility here (e.g. md:mx-6) — it would set the
                        // same margin-left/right property as mx-auto above and win by
                        // Tailwind's class order, silently breaking the centering.
                        scrolled && 'my-3 max-w-[1552px] rounded-full border border-sand/10 bg-umber/60 shadow-glass',
                    )}
                >
                    <a href="#top" className="font-display text-xl tracking-tight text-sand">
                        {SITE.name}
                    </a>

                    {/* absolutely centered against the bar itself, so it stays dead-
                        center regardless of how wide the logo/CTA siblings are */}
                    <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
                        {NAV.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="group relative font-mono text-xs uppercase tracking-label text-dune transition-colors hover:text-sand"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-300 group-hover:w-full" />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center">
                        <a
                            href="#cta"
                            className="hidden rounded-full bg-sand px-5 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-transform hover:scale-[1.04] md:inline-block"
                        >
                            Reserve
                        </a>

                        <button
                            onClick={() => setOpen(true)}
                            className="text-sand md:hidden"
                            aria-label="Open menu"
                        >
                            <HiOutlineMenuAlt4 size={26} />
                        </button>
                    </div>
                </nav>
            </motion.header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex flex-col bg-ink/95 p-8 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-display text-xl text-sand">{SITE.name}</span>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="text-sand"
                            >
                                <HiX size={28} />
                            </button>
                        </div>
                        <ul className="mt-16 flex flex-col gap-6">
                            {NAV.map((item, i) => (
                                <motion.li
                                    key={item.href}
                                    initial={{ x: -30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.08 * i }}
                                >
                                    <a
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="font-display text-4xl text-sand"
                                    >
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
