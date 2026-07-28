'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A stylized floating "sole" form standing in for the product.
 * SWAP FOR YOUR MODEL: drop a .glb into /public and replace this with
 *   const { scene } = useGLTF('/sandal.glb'); return <primitive object={scene} />
 * (import useGLTF from '@react-three/drei').
 */
export function SoleMesh({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    // ease the group toward the pointer for subtle interactive parallax
    group.current.rotation.y += (pointer.current.x * 0.4 - group.current.rotation.y) * Math.min(1, delta * 3);
    group.current.rotation.x += (-pointer.current.y * 0.25 - group.current.rotation.x) * Math.min(1, delta * 3);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <group ref={group} scale={1.3}>
        {/* rounded capsule-like sole body */}
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.55, 1.7, 24, 48]} />
          <MeshTransmissionMaterial
            thickness={0.9}
            roughness={0.15}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.04}
            backside
            color="#AEC2D6"
            attenuationColor="#EDEFF3"
            attenuationDistance={2}
          />
        </mesh>
        {/* a warm inner core so it reads as an object, not just glass */}
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.7}>
          <capsuleGeometry args={[0.45, 1.5, 16, 32]} />
          <meshStandardMaterial color="#1D2128" roughness={0.6} metalness={0.2} emissive="#C96B57" emissiveIntensity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}
