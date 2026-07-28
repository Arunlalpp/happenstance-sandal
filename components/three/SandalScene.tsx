'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sparkles, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { SoleMesh } from './SoleMesh';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Interactive R3F scene: floating product form, ambient sparkles (particles),
 * environment reflections and cursor-driven parallax.
 * Performance guards: clamped DPR, AdaptiveDpr, PerformanceMonitor downgrade,
 * lighter particle counts on mobile, and a static fallback under reduced-motion.
 */
export function SandalScene() {
  const pointer = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [dpr, setDpr] = useState<number>(isMobile ? 1 : 1.5);

  const onPointerMove = (e: React.PointerEvent) => {
    pointer.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    };
  };

  // Reduced motion: render nothing heavy; a CSS glow stands in.
  if (reduced) {
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-64 w-64 rounded-full bg-bronze/20 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" onPointerMove={onPointerMove}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <AdaptiveDpr pixelated />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 3]} intensity={2.2} color="#EAF0F5" />
        <pointLight position={[-4, -2, -2]} intensity={2} color="#C96B57" />

        <Suspense fallback={null}>
          <SoleMesh pointer={pointer} />
          <Sparkles
            count={isMobile ? 40 : 120}
            scale={[10, 6, 6]}
            size={2}
            speed={0.3}
            opacity={0.5}
            color="#EDEFF3"
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
