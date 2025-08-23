import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { SoftParticlesMaterial } from './SoftParticlesShader';

const SoftParticlesComponent = ({
  particleCount = 10,
  orbitingGroups = 5,
  centralParticleSize = 10,
  orbitingParticleSize = 5,
  orbitRadius = 0.3,
  orbitSpeed = 0.01,
  particleOrbitSpeed = 1.0, // New prop for particle orbit speed
  position = [0, 0, 0]
}) => {
  const { scene, camera, gl } = useThree();
  
  // Extract position values for stable dependencies
  const x = position[0];
  const y = position[1];
  const z = position[2];
  
  // Memoize position to prevent unnecessary effect re-runs
  const pos = useMemo(() => [x, y, z], [x, y, z]);
  
  // Store the offset for the orbital path
  const orbitOffset = useRef([0, 0, 0]);
  
  // Local refs to avoid shared state across instances
  const depthRenderTarget = useRef();
  const depthTexture = useRef();
  const particleGeometry = useRef(new THREE.BufferGeometry());
  const particleSystem = useRef();
  
  const orbits = useRef([]);

  // Separate effect for depth texture initialization
  useEffect(() => {
    // Initialize depth texture only once per instance
    depthTexture.current = new THREE.DepthTexture();
    depthTexture.current.type = THREE.UnsignedShortType;
    depthTexture.current.format = THREE.DepthFormat;
    depthTexture.current.minFilter = THREE.NearestFilter;
    depthTexture.current.magFilter = THREE.NearestFilter;
    depthTexture.current.encoding = THREE.LinearEncoding;
  
    depthRenderTarget.current = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    depthRenderTarget.current.depthTexture = depthTexture.current;
  
    const renderer = gl;
    renderer.setRenderTarget(depthRenderTarget.current);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    
    // Cleanup function
    return () => {
      if (depthRenderTarget.current) {
        depthRenderTarget.current.dispose();
      }
    };
  }, [scene, camera, gl]);
  
  // Separate effect for particle generation and scene management
  useEffect(() => {
    // Generate particle positions and sizes
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    let currentParticle = 0;
    for (let i = 0; i < orbitingGroups; i++) {
      // Apply the position offset to the central particle
      const centerX = pos[0] + (Math.random() * 2 - 1) * 0.1;
      const centerY = pos[1] + (Math.random() * 2 - 1) * 0.1;
      const centerZ = pos[2] + (Math.random() * 2 - 1) * 0.1;
    
      // Set central particle
      positions[currentParticle * 3] = centerX;
      positions[currentParticle * 3 + 1] = centerY;
      positions[currentParticle * 3 + 2] = centerZ;
      sizes[currentParticle] = centralParticleSize * (0.8 + Math.random() * 0.4);
    
      // Central particle color (blue)
      colors[currentParticle * 3] = 0.3;   // Red
      colors[currentParticle * 3 + 1] = 0.4; // Green
      colors[currentParticle * 3 + 2] = 1;   // Blue
    
      currentParticle++;
    
      // Create orbiting particles
      const numOrbiters = Math.min(particleCount - currentParticle - 1, 5); // Ensure we don't exceed particleCount
      const groupRadius = orbitRadius * 0.5; // Reduce initial spread
      
      for (let j = 0; j < numOrbiters; j++) {
        const angle = (Math.PI * 2 * j) / numOrbiters;
        // Create a tighter cluster around the center
        const distanceVariation = 0.7 + Math.random() * 0.6; // Keep between 70-130% of orbitRadius
        const offsetX = Math.cos(angle) * groupRadius * distanceVariation;
        const offsetY = Math.sin(angle * 1.5) * groupRadius * 0.5 * distanceVariation;
        const offsetZ = (Math.random() * groupRadius * 0.5) - (groupRadius * 0.25);
    
        // Position relative to center with some randomness
        positions[currentParticle * 3] = centerX + offsetX * 0.5;
        positions[currentParticle * 3 + 1] = centerY + offsetY * 0.5;
        positions[currentParticle * 3 + 2] = centerZ + offsetZ * 0.5;
        sizes[currentParticle] = orbitingParticleSize * (0.8 + Math.random() * 0.4);
    
        // Orbiting particle color (white)
        colors[currentParticle * 3] = 0.3;   // Red
        colors[currentParticle * 3 + 1] = 0; // Green
        colors[currentParticle * 3 + 2] = 0.3; // Blue
    
        orbits.current.push({
          center: [centerX, centerY, centerZ],
          radius: groupRadius,
          angle: angle,
          speed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
        });
        currentParticle++;
      }
    }

    particleGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.current.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create a new particle system if it doesn't exist
    if (!particleSystem.current) {
      particleSystem.current = new THREE.Points(particleGeometry.current, SoftParticlesMaterial);
      scene.add(particleSystem.current);
    }
    
    // Cleanup function
    return () => {
      if (particleSystem.current) {
        scene.remove(particleSystem.current);
        particleSystem.current = null;
      }
    };
  }, [particleCount, orbitingGroups, centralParticleSize, 
      orbitingParticleSize, orbitRadius, pos, scene, orbitSpeed, particleOrbitSpeed]);
  
  // Track the main orbit angle
  const orbitAngle = useRef(0);
  
  useFrame((state, delta) => {
    // If using SoftParticlesMaterial, update the depth texture uniform
    if (SoftParticlesMaterial.uniforms) {
      SoftParticlesMaterial.uniforms.depthTexture.value = depthTexture.current;
    }
    
    // Update the main orbit angle (slower than particle orbits)
    orbitAngle.current += 0.02 * orbitSpeed;
    
    // Calculate the main orbit position (diagonal orbit around the center)
    const orbitRadius = 1.7; // Distance from center
    const orbitX = Math.cos(orbitAngle.current) * orbitRadius * 0.7; // Reduced X movement
    const orbitY = Math.sin(orbitAngle.current) * orbitRadius * 0.5; // Add Y movement for diagonal orbit
    const orbitZ = Math.sin(orbitAngle.current) * orbitRadius * 0.7; // Reduced Z movement
    
    // Update the component's position
    if (particleSystem.current) {
      particleSystem.current.position.set(
        x + orbitX,
        y + orbitY, // Add Y movement for diagonal orbit
        z + orbitZ
      );
    }
    
    // Update particle positions for individual orbiting
    if (particleSystem.current && orbits.current.length > 0) {
      const positions = particleSystem.current.geometry.attributes.position.array;
      let orbitIndex = 0;
      let particleIndex = 0;
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < orbitingGroups; i++) {
        // Skip central particle
        particleIndex++;
        
        // Get number of orbiters for this group
        const numOrbiters = Math.min(5, particleCount - particleIndex);
        
        for (let j = 0; j < numOrbiters && orbitIndex < orbits.current.length; j++) {
          const orbit = orbits.current[orbitIndex];
          orbit.angle += orbit.speed * particleOrbitSpeed; // Use particleOrbitSpeed for particles
          
          // Get orbit parameters
          const radius = orbit.radius;
          const center = orbit.center;
          const timeOffset = j * 0.5; // Stagger orbits slightly
          
          // Calculate circular orbit in XZ plane with slight Y variation
          const angle = orbit.angle + time * 0.3 + timeOffset;
          const orbitX = Math.cos(angle) * radius;
          const orbitZ = Math.sin(angle) * radius * 0.8; // Slightly elliptical
          
          // Add subtle vertical movement (sine wave)
          const verticalOffset = Math.sin(orbit.angle * 1.5 + time * 0.5) * radius * 0.3;
          
          // Update particle position
          positions[particleIndex * 3] = center[0] + orbitX;
          positions[particleIndex * 3 + 1] = center[1] + verticalOffset;
          positions[particleIndex * 3 + 2] = center[2] + orbitZ;
          
          particleIndex++;
          orbitIndex++;
        }
      }
      
      // Mark the position attribute as needing an update
      particleSystem.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return null;
};

export default SoftParticlesComponent;
