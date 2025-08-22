import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { SoftParticlesMaterial } from './SoftParticlesShader';

const SoftParticlesComponent = ({ particleCount = 30, orbitingGroups = 1 }) => {
  const { scene, camera, gl } = useThree();
  const depthRenderTarget = useRef();
  const depthTexture = useRef();
  const particleGeometry = useRef(new THREE.BufferGeometry());
  const particleSystem = useRef();

  // Orbiting data
  const orbits = useRef([]);
  useEffect(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3); // Color array for particles
  
    let currentParticle = 0;
    for (let i = 0; i < orbitingGroups; i++) {
      const centerX = Math.random() * 20 - 10;
      const centerY = Math.random() * 20 - 10;
      const centerZ = Math.random() * 20 - 10;
  
      // Set central particle
      positions[currentParticle * 3] = centerX;
      positions[currentParticle * 3 + 1] = centerY;
      positions[currentParticle * 3 + 2] = centerZ;
      sizes[currentParticle] = Math.random() * 20 + 10;
  
      // Central particle color (blue)
      colors[currentParticle * 3] = 0.3;   // Red
      colors[currentParticle * 3 + 1] = 0.4; // Green
      colors[currentParticle * 3 + 2] = 1; // Blue
  
      currentParticle++;
  
      // Create orbiting particles
      const numOrbiters = Math.floor(Math.random() * 3) + 2;
      const radius = Math.random() * 0.3 + 0.2;
      for (let j = 0; j < numOrbiters; j++) {
        const angle = (Math.PI * 2 * j) / numOrbiters;
        const offsetX = Math.cos(angle) * radius;
        const offsetY = Math.sin(angle) * radius;
        const offsetZ = Math.random() * radius - radius / 2;
  
        positions[currentParticle * 3] = centerX + offsetX;
        positions[currentParticle * 3 + 1] = centerY + offsetY;
        positions[currentParticle * 3 + 2] = centerZ + offsetZ;
        sizes[currentParticle] = Math.random() * 10 + 5;
  
        // Orbiting particle color (white)
        colors[currentParticle * 3] = 1;   // Red
        colors[currentParticle * 3 + 1] = 1; // Green
        colors[currentParticle * 3 + 2] = 1; // Blue
  
        orbits.current.push({ center: [centerX, centerY, centerZ], radius, angle, speed: Math.random() * 0.01 + 0.005 });
        currentParticle++;
      }
    }
  
    particleGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.current.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.current.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Add color attribute
  
    particleSystem.current = new THREE.Points(particleGeometry.current, SoftParticlesMaterial);
    scene.add(particleSystem.current);

    return () => {
        scene.remove(particleSystem.current);
      };
    }, [scene, camera, gl, particleCount, orbitingGroups]);

  useFrame(() => {
    // Update depth texture
    if (SoftParticlesMaterial.uniforms) {
      SoftParticlesMaterial.uniforms.depthTexture.value = depthTexture.current;
    }

    // Animate orbiting particles
    const positions = particleGeometry.current.attributes.position.array;
    let currentParticle = orbitingGroups; // Skip central particles
    orbits.current.forEach((orbit) => {
      const { center, radius, angle, speed } = orbit;
      orbit.angle += speed; // Increment angle for rotation

      positions[currentParticle * 3] = center[0] + Math.cos(orbit.angle) * radius;
      positions[currentParticle * 3 + 1] = center[1] + Math.sin(orbit.angle) * radius;
      positions[currentParticle * 3 + 2] = center[2];
      currentParticle++;
    });

    particleGeometry.current.attributes.position.needsUpdate = true;

    // Rotate the whole particle system
    if (particleSystem.current) {
      particleSystem.current.rotation.y += 0.001;
      particleSystem.current.rotation.x += 0.0005;
    }
  });

  return null;
};

export default SoftParticlesComponent;