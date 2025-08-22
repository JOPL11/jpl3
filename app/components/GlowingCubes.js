'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate random positions for cubes
const generateRandomPositions = (count) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push([
      (Math.random() - 0.5) * 8,  // x: -4 to 4
      (Math.random() - 0.5) * 4,   // y: -2 to 2
      -2 - Math.random() * 50       // z: -2 to -14
    ]);
  }
  return positions;
};

const CUBE_COUNT = 25;
const CUBE_POSITIONS = generateRandomPositions(CUBE_COUNT);

const blimpRed = new THREE.MeshStandardMaterial({ 
  color: 0x800080, 
  emissive: 0x800080, 
  emissiveIntensity: 100, 
});


function GlowingCube({ position }) {
  const meshRef = useRef();
  const lightRef = useRef();
  
  useFrame(({ camera }) => {
    if (lightRef.current) {
      lightRef.current.position.copy(meshRef.current.position);
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        color={0x4b0082} 
        intensity={100}
        distance={11}
        decay={5}
      />
      <mesh position={position} ref={meshRef} material={blimpRed}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
      </mesh>

    </>
  );
}

export default function GlowingCubes() {
  return (
    <group>
      {CUBE_POSITIONS.map((pos, index) => (
        <GlowingCube key={index} position={pos} />
      ))}
    </group>
  );
}
