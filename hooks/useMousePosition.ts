'use client';

import { useEffect, useRef } from 'react';

type Vec2 = { x: number; y: number };

/**
 * Tracks the pointer as a normalized (-1..1) vector via a ref, so consumers
 * (canvas, cursor, parallax) can read it inside rAF without re-rendering React.
 */
export function useMousePosition() {
  const pos = useRef<Vec2>({ x: 0, y: 0 });
  const target = useRef<Vec2>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return { pos, target };
}
