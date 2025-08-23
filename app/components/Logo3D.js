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

// Custom hook for mobile detection
function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileDevice = window.innerWidth < 768; // Common breakpoint for tablets and below
      setIsMobile(isMobileDevice);
    };
    
    // Set initial value
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}

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

function OrbitingCube({ radius = 1.5, speed = 0.5, positionOffset = 0, rotationSpeed = 1 }) {
  const cubeRef = useRef();
  
  useFrame(({ clock }) => {
    if (cubeRef.current) {
      const time = clock.getElapsedTime() * speed;
      const x = Math.sin(time + positionOffset) * radius * 0.7;
      const y = Math.sin(time + positionOffset) * radius * 0.7;
      const z = Math.cos(time + positionOffset) * radius * 0.5;
      
      cubeRef.current.position.set(x, y, z);
      cubeRef.current.rotation.x = time * rotationSpeed;
      cubeRef.current.rotation.y = time * rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshPhysicalMaterial 
        color="#63b3ed"
        emissive="#4b0082"
        emissiveIntensity={2}
        toneMapped={false}
      />
      <pointLight 
        color="#63b3ed" 
        intensity={1} 
        distance={3} 
        decay={2} 
      />
    </mesh>
  );
}



function Scene({ modelUrl }) {
  const isMobile = useMobileDetect();

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
      
      {/* First cube */}
      <OrbitingCube speed={0.3} positionOffset={0} rotationSpeed={1} />
      
      {/* Second cube with offset position and different speed */}
      <OrbitingCube speed={0.4} positionOffset={Math.PI} rotationSpeed={-0.8} />
      
      {!isMobile && (
        <SoftParticlesComponent 
          particleCount={6} 
          orbitingGroups={1}
          centralParticleSize={17}  
          orbitingParticleSize={11} 
          orbitRadius={0.6}       
          orbitSpeed={0.2}
          particleOrbitSpeed={1.0}
          position={[0, 0, 0]}     
        />
      )}
    </>
  );
}

export default function Logo3D({ width = 250, height = 250, className = '' }) {
  const [isIOS, setIsIOS] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const canvasRef = useRef();
  const isMobile = useMobileDetect();

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
          frameBufferType: isMobile ? undefined : HalfFloatType  // Only use HalfFloatType on desktop
        }}
        dpr={isMobile ? 1 : [1, 2]}  // Lower DPR on mobile
        onCreated={({ gl, scene }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
          gl.setClearColor(0, 0, 0, 0);
          scene.background = null;
        }}
      >
        <color attach="background" args={[0x000000, 0]} />
        <Suspense fallback={null}>
          {!isMobile && (
            <>
{console.log('isMobile:', isMobile)}
{console.log('Should render EffectComposer:', !isMobile)}
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.5} 
                mipmapBlur 
                luminanceSmoothing={1} 
                intensity={5} 
              />
                 <DepthOfField
                  focusDistance={0.01}
                  focalLength={0.0005}
                  blur={3}    
                  blendFunction={BlendFunction.NORMAL} 
                  opacity={1}  
                  target={[0, 0, 0.5]} 
                 bokehScale={1.5} 
                 width={width} height={height}
                />
            </EffectComposer>
            </>
          )}
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
