'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins once, guarded for SSR.
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // Global defaults keep motion cohesive across the whole site.
    gsap.defaults({ ease: 'power3.out', duration: 1 });
}

export { gsap, ScrollTrigger };
