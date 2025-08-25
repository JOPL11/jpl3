'use client';

import { useEffect, useState, Suspense, useRef, useMemo} from 'react';
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



const random2D = `
float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
`;
const holographicVertexShader = `
uniform float uTime;
uniform float uHover;

varying vec3 vPosition;
varying vec3 vNormal;

float random2D(vec2 value) {
  return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Glitch band that sweeps up the model
  float glitchBand = sin(uTime * 0.5) * 0.5 + 0.5;  // 0-1 value that moves up and down
  float verticalPosition = modelPosition.y * 0.5 + 0.5;  // Normalize to 0-1 range
  
  // Calculate distance from glitch band with some easing
  float distanceToBand = abs(verticalPosition - glitchBand);
  float glitchAmount = smoothstep(0.2, 0.0, distanceToBand);  // Creates a smooth falloff
  
  // Only apply glitch when close to the band
  float glitchStrength = 0.0;
  if (distanceToBand < 0.9) {
    // Create more interesting glitch pattern
    float glitchTime = uTime * 7.0 + modelPosition.x * 10.0;
    glitchStrength = sin(glitchTime) * sin(glitchTime * 0.2) * sin(glitchTime * 0.25);
    glitchStrength = abs(glitchStrength);
    glitchStrength = pow(glitchStrength, 0.5) * 2.0;  // Sharper peaks
    
    // Apply the band falloff
    glitchStrength *= glitchAmount * (0.5 + 0.5 * uHover);
    
    // Apply glitch to position - more on X and Z axes
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength * 0.5;
    modelPosition.z += (random2D(modelPosition.zy + uTime * 1.5) - 0.5) * glitchStrength * 0.5;
  }
  
  // Final position
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
  // Model normal
  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
  
  // Varyings
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}
`;
        // ${effects}
const holographicFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uHover;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Noise function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  void main() {
    // Base color with fresnel effect
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);
    
    // Thin scan lines with high frequency
    float scanLine = sin(vPosition.y * 1.0 + uTime * 1.0) * 0.8 + 0.3;
    scanLine = smoothstep(0.85, 1.55, scanLine);  // Very sharp transition for thin lines
    
    // Add subtle secondary pattern
    float scanLine2 = sin(vPosition.y * 1.0 - uTime * 1.4) * 1.22 + 0.85;
    scanLine = min(scanLine, scanLine2);  // Combine patterns for more detail
    
    // High contrast for visibility
    scanLine = mix(0.2, 0.5, scanLine);
    
    // Base color - using a slightly darker base to make lines pop
    vec3 finalColor = uColor * (0.7 + fresnel * 1.9);
    
    // Apply scan lines
    finalColor *= scanLine;
    
    // Subtle noise for digital feel
    vec2 uv = gl_FragCoord.xy / 50.0;
    finalColor += (random(uv + uTime * 0.5) - 0.8) * 0.06;
    
    // Final color with alpha
    gl_FragColor = vec4(finalColor, 1.9 * (0.5 + fresnel * 0.5));
  }
`;

const materialParameters = {}
//materialParameters.color = '#0f81bd'
const hologram = new THREE.ShaderMaterial({
      vertexShader: holographicVertexShader,
      fragmentShader: holographicFragmentShader,
      uniforms:
      {
          uTime: new THREE.Uniform(0),
          uColor: new THREE.Uniform(new THREE.Color(0.2, 1.4, 4.0)),
          uEmissiveColor: new THREE.Uniform(new THREE.Color(0x0f81bd)), // Red emissive color
          uEmissiveStrength: { value: 33.0 }, // Emissive strength
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
     // specular: 0x000000, // Disable specular reflection
      blending: THREE.AdditiveBlending
})


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

// Model component with holographic toggle
function Model({ url, position = [0, -0.05, 0] }) {
  const [isHolographic, setIsHolographic] = useState(false);
  const { scene } = useGLTF(url);
  
  // Create holographic material
  const hologramMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: holographicVertexShader,
    fragmentShader: holographicFragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color(0.2, 1.4, 4.0)),
      uHover: { value: 0 }
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  // Animation frame for holographic effect
  useFrame(({ clock }) => {
    if (isHolographic) {
      hologramMaterial.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  // Apply materials to meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Store original material if not already stored
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material || new THREE.MeshPhongMaterial({
            color: 0x0f81bd,
            shininess: 5,
            specular: 0x87cacf,
            emissive: 0xFFFFFF,
            flatShading: false
          });
        }

        // Apply appropriate material
        child.material = isHolographic 
          ? hologramMaterial 
          : child.userData.originalMaterial;
      }
    });
  }, [scene, isHolographic, hologramMaterial]);
  
  return (
    <group 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setIsHolographic(prev => !prev);
      }}
    >
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
    <mesh position={[-0.15, -0.001, 0.5]}>
      <planeGeometry args={[1.05, 0.19]} />
      <meshBasicMaterial 
        map={texture}
        transparent={true}
        alphaTest={0.5}
        side={THREE.FrontSide}
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
      <ambientLight intensity={1.5} color={0x87CEEB} />
      <directionalLight 
        position={[1, 2, 3]} 
        intensity={0.5}
      />
      <pointLight position={[2, 2, -2]} intensity={0.1} color="#87cacf" />
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
          orbitingParticleSize={9} 
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
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef();
  const isMobile = useMobileDetect();

  useEffect(() => {
    const currentCanvas = canvasRef.current;
    const handleContextLost = (event) => {
      console.warn('WebGL context lost');
      event.preventDefault();
    };

    if (currentCanvas) {
      currentCanvas.addEventListener('webglcontextlost', handleContextLost, false);
    }

    return () => {
      if (currentCanvas) {
        currentCanvas.removeEventListener('webglcontextlost', handleContextLost, false);
      }
    };
  }, []);

  return (
    <div 
      className={`${styles.logoContainer} ${className}`} 
      style={{ 
        width: `${width}px`, 
        height: `${height + 25}px`,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 3000ms ease-in-out'
      }}
    >
      <Canvas 
        ref={canvasRef}
        className={styles.canvasContainer}
        camera={{ position: [0, 0, 4.7], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          preserveDrawingBuffer: true,
          alphaToCoverage: true,
          premultipliedAlpha: false,
          frameBufferType: isMobile ? undefined : HalfFloatType,
          depth: true,
          stencil: false,
        }}
        dpr={isMobile ? 1 : [1, 2]}  // Lower DPR on mobile
        onCreated={({ gl, scene }) => {
          setIsLoaded(true);
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
            <SMAA />
            <EffectComposer>
              <Bloom 
                luminanceThreshold={1.0} 
                mipmapBlur 
                luminanceSmoothing={0.3} 
                intensity={0.5} 
                kernelSize={1}
              />
                 <DepthOfField
                  focusDistance={0.01}
                  focalLength={0.0005}
                  blur={0}    
                  blendFunction={BlendFunction.NORMAL} 
                  opacity={1}  
                  target={[0, 0, 0.5]} 
                  bokehScale={1} 
                  width={width} 
                  height={height}
                  resolutionY={height / 2}
                  resolutionX={width / 2} 
                />
            </EffectComposer>
            </>
          )}
          <Scene modelUrl="/assets/logo2.glb" />
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.1}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
