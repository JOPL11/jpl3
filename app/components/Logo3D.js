'use client';

import { useEffect, useState, Suspense, useRef} from 'react';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import styles from './Logo3D.module.css';
import { EffectComposer } from '@react-three/postprocessing';
import { HalfFloatType, ReinhardToneMapping, WebGLRenderer } from 'three';
import { Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { DepthOfField  } from '@react-three/postprocessing';
import { Bloom } from '@react-three/postprocessing';
import { SMAA } from '@react-three/postprocessing';
import SoftParticlesComponent from './SoftParticlesComponent';


// Preload the GLB file
useGLTF.preload('/assets/logo.glb');

// Simple model component
function Model({ url, position = [0, 0, 0] }) {
  const { scene } = useGLTF(url);
  
  // Apply default material to all meshes if they don't have one
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // If no material or material is MeshStandardMaterial without map
      if (!child.material || 
          (child.material.isMeshStandardMaterial && !child.material.map)) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0x87cacf,
          shininess: 5,
          specular: 0xFFFFFF,
          emissive: 0x000000,
          flatShading: false
        });
      }
    }
  });

  
  return (
    <group position={position}>
      <primitive object={scene} scale={0.05} />
    </group>
  );
}

function NameText() {
  const texture = useTexture('/assets/janpeiro.png');
  
  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  return (
    <mesh position={[-0.15, 0, 0.5]}>
      <planeGeometry args={[1.0, 0.18]} />
      <meshBasicMaterial 
        map={texture}
        transparent={true}
        alphaTest={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function OrbitingCube({ radius = 1.5, speed = 0.5 }) {
  const cubeRef = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (cubeRef.current) {
      // Calculate circular motion with diagonal orientation
      const angle = time * speed;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      // Position for diagonal orbit (bottom-left to top-right)
      cubeRef.current.position.x = x * 0.7;  // Reduce horizontal movement
      cubeRef.current.position.y = x * 0.7;  // Add vertical movement
      cubeRef.current.position.z = z * 0.5;  // Reduce depth movement
      
      // Rotate on multiple axes for more interesting motion
      cubeRef.current.rotation.x = time * 0.5;
      cubeRef.current.rotation.y = time * 0.7;
      cubeRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshPhysicalMaterial 
    color="#63b3ed"
    emissive="#4b0082"
    emissiveIntensity={44}
    toneMapped={false}
    metalness={0.9}
    roughness={0.1}
    clearcoat={1}
    clearcoatRoughness={0.1}
  />
  <pointLight 
    color="#63b3ed" 
    intensity={2} 
    distance={3}
    decay={2}
  />
    </mesh>
  );
}

function OrbitingLight({ radius = 1.5, speed = 0.5 }) {
  const lightRef = useRef();
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const time = clock.getElapsedTime() * speed;
      const x = Math.sin(time) * radius;
      const z = Math.cos(time) * radius;
      
      lightRef.current.position.x = x * 0.7;
      lightRef.current.position.y = x * 0.7;
      lightRef.current.position.z = z * 0.5;
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      color="#4b0082" 
      intensity={2} 
      distance={5} 
      decay={1} 
    />
  );
}

function Scene({ modelUrl }) {
  return (
    <>
      <ambientLight intensity={0.5} color={0xffffff} />
      <directionalLight 
        position={[1, 2, 3]} 
        intensity={0.7}
      />
      <pointLight position={[2, 2, -2]} intensity={0.2} color="#87cacf" />
      <Model url={modelUrl} />
      <NameText />
      <OrbitingCube />
      <OrbitingLight />
      <SoftParticlesComponent 
        particleCount={11} 
        orbitingGroups={1}
        centralParticleSize={17}  
        orbitingParticleSize={11} 
        orbitRadius={0.8}       
        orbitSpeed={0.5}
        position={[0, 0, 1]}     
      />
    </>
  );
}

export default function Logo3D({ width = 250, height = 250, className = '' }) {
  const [isIOS, setIsIOS] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const canvasRef = useRef();

  useEffect(() => {
    try {
      // Check if we're on iOS
      const userAgent = window.navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      setIsIOS(isIOS);
      setIsMounted(true);

      // Store the current ref in a variable for cleanup
      const currentCanvas = canvasRef.current;
      
      const handleContextLost = (event) => {
        console.warn('WebGL context lost, falling back to SVG');
        event.preventDefault();
        setUseFallback(true);
      };

      if (currentCanvas) {
        const gl = currentCanvas.getContext('webgl');
        if (gl) {
          currentCanvas.addEventListener('webglcontextlost', handleContextLost, false);
        }
      }

      return () => {
        if (currentCanvas) {
          const gl = currentCanvas.getContext('webgl');
          if (gl) {
            currentCanvas.removeEventListener('webglcontextlost', handleContextLost, false);
          }
        }
      };
    } catch (err) {
      console.error('Error in Logo3D:', err);
      setUseFallback(true);
    }
  }, []);



  // Fallback to SVG if needed
  if (useFallback || isIOS || !isMounted) {
    return (
      <Image 
        src="/images/jp.svg"
        alt="Jan Peiro Logo"
        width={width}
        height={height}
        className={className}
        priority
      />
    );
  }

  // Try to render the 3D model
  return (
    <div className={`${styles.logoContainer} ${className}`} style={{ width, height }}>
      <Canvas 
        ref={canvasRef}
        className={styles.canvasContainer}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          preserveDrawingBuffer: true,
          alphaToCoverage: true,
          premultipliedAlpha: false,
          frameBufferType: HalfFloatType  
        }}
        dpr={[1, 2]}
        onCreated={({ gl, scene }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.setClearColor(0, 0, 0, 0);
          scene.background = null;
        }}
      >
        <color attach="background" args={[0x000000, 0]} />
        <Suspense fallback={null}>
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur luminanceSmoothing={1} intensity={2} />
          <DepthOfField focusDistance={0.05} target={[0, 0, 0]} focalLength={0.0005} bokehScale={1} width={width} height={height} />
        
        </EffectComposer>
          <Scene modelUrl="/assets/logo.glb" />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.1}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
