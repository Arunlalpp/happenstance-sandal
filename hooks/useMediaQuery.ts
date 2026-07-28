'use client';

import { useEffect, useState } from 'react';

/** Returns true when the given media query matches. SSR-safe (defaults to false). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Convenience: true on coarse-pointer / small screens (skip heavy GPU work). */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
