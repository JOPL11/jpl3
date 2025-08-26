'use client';

import { useEffect, useState, Suspense, useRef, useMemo, useCallback } from 'react';
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

// Component for hologram corner points
function HologramCorners({ size = 0.1, distance = 1.2, intensity = 2.0 }) {
  const points = useMemo(() => [
    // Top points (two corners)
    { position: [-distance, distance, -1.5] },    // Top-left
    { position: [-distance, distance, -2.0] },  
    { position: [-distance, distance, -2.5] }, 
    { position: [-distance, distance, -1.5] }, 
    { position: [-distance, distance, -1.0] }, 
    { position: [-distance, distance, -0.5] }, 
    { position: [-distance, distance, 0] }, 
    { position: [-distance, distance, 0.5] },                   
    { position: [-distance, distance, 1.0] },      
    { position: [-distance, distance, 1.5] },   
    { position: [-distance, distance, 2.0] },  
    { position: [-distance, distance, 2.5] }, 
    { position: [distance, distance, -1.5] },     // Top-right
    { position: [distance, distance, -2.0] },  
    { position: [distance, distance, -2.5] }, 
    { position: [distance, distance, -1.5] }, 
    { position: [distance, distance, -1.0] }, 
    { position: [distance, distance, -0.5] }, 
    { position: [distance, distance, 0] }, 
    { position: [distance, distance, 0.5] },                   
    { position: [distance, distance, 1.0] },      
    { position: [distance, distance, 1.5] },   
    { position: [distance, distance, 2.0] },  
    { position: [distance, distance, 2.5] }, 
    
    // Middle points
    { position: [-distance, 0, -0.5] },          // Middle-left
    { position: [distance, 0, -0.5] },           // Middle-right
    
    // Bottom point (single, centered)
    { position: [0, -distance, -2.0] },  
    { position: [0, -distance, -2.5] }, 
    { position: [0, -distance, -1.5] }, 
    { position: [0, -distance, -1.0] }, 
    { position: [0, -distance, -0.5] }, 
    { position: [0, -distance, 0] }, 
    { position: [0, -distance, 0.5] },                   
    { position: [0, -distance, 1.0] },      
    { position: [0, -distance, 1.5] },   
    { position: [0, -distance, 2.0] },  
    { position: [0, -distance, 2.5] }, 
         
    
    // Additional points for visual effect
    { position: [-distance, distance, 0] },      // Top-left middle
    { position: [distance, distance, 0] },       // Top-right middle

  ], [distance]);

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point.position}>
          <boxGeometry args={[0.03, -0.03, 0.03]} />
          <meshPhongMaterial 
            color="#87ceeb"
            emissive="#87ceeb"
            emissiveIntensity={intensity}
            toneMapped={false}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}





// Model component with holographic toggle
function Model({ url, position = [0, -0.05, 0], isHolographic, onHolographicChange }) {
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
      onClick={() => onHolographicChange(!isHolographic)}
    >
      <primitive object={scene} scale={0.05} />
      {isHolographic && (
        <>
          <HologramCorners />
          {[...Array(152)].map((_, i) => (
        <DelayedOscillatingBox 
          key={i} 
          delay={i * 100} // Stagger the appearance of each box
          color={i % 2 === 0 ? 0x87CEEB : 0x87CEEB} // Alternate colors
        />
      ))}
        </>
      )}
    </group>
  );
}


function DelayedOscillatingBox({ delay = 2000, color = 0x87CEEB }) {
  const boxRef = useRef();
  const [visible, setVisible] = useState(false);
  const randomX = useRef((Math.random() * 0.5 - 0.5) * 1.9); 
  const randomY = useRef((Math.random() * -0.2 - 0.5) * 1.9);
  const startTime = useRef(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  useFrame(({ clock }) => {
    if (boxRef.current && visible) {
      // Start timing when the box becomes visible
      if (startTime.current === 0) {
        startTime.current = clock.getElapsedTime();
      }
      // Each box oscillates independently based on its own start time
      const elapsed = clock.getElapsedTime() - startTime.current;
      boxRef.current.position.z = Math.sin(elapsed * 0.5) * 22;

      const isElongated = Math.floor(elapsed *2) % 2 === 0;
      boxRef.current.scale.set(
        0.08,  // x scale
        0.08,  // y scale
        isElongated ? 1 : 0.1  // z scale
      );
    }
  });

  if (!visible) return null;

  return (
    <mesh 
      ref={boxRef} 
      position={[randomX.current, randomY.current, 0]} // Random x,y position, z=0
      
    >
      <boxGeometry args={[0.2, 0.2, 1]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
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

function OrbitingCube({ radius = 1.5, speed = 0.5, positionOffset = 0, rotationSpeed = 1, visible = true }) {
  const cubeRef = useRef();
  const lightRef = useRef();
  
  useFrame(({ clock }) => {
    if (cubeRef.current) {
      if (!visible) return;
      
      const time = clock.getElapsedTime() * speed;
      const x = Math.sin(time + positionOffset) * radius * 0.7;
      const y = Math.sin(time + positionOffset) * radius * 0.7;
      const z = Math.cos(time + positionOffset) * radius * 0.5;
      
      cubeRef.current.position.set(x, y, z);
      cubeRef.current.rotation.x = time * rotationSpeed;
      cubeRef.current.rotation.y = time * rotationSpeed * 0.5;
      
      // Also update light position
      if (lightRef.current) {
        lightRef.current.position.set(x, y, z);
      }
    }
  });

  return (
    <>
      <mesh ref={cubeRef} visible={visible}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshPhysicalMaterial 
          color="#63b3ed"
          emissive="#4b0082"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight 
        ref={lightRef}
        color="#63b3ed" 
        intensity={visible ? 1 : 0} 
        distance={3} 
        decay={2} 
      />
    </>
  );
}



function Scene({ modelUrl }) {
  const isMobile = useMobileDetect();
  const [isHolographic, setIsHolographic] = useState(false);

  return (
    <>
      <ambientLight intensity={1.5} color={0x87CEEB} />
      <directionalLight 
        position={[1, 2, 3]} 
        intensity={0.5}
      />
      <pointLight position={[2, 2, -2]} intensity={0.1} color="#87cacf" />
      <Model 
        url={modelUrl} 
        isHolographic={isHolographic}
        onHolographicChange={setIsHolographic}
      />
      <NameText />
      {/* First cube */}
      <OrbitingCube speed={0.3} positionOffset={0} rotationSpeed={1} visible={!isHolographic}/>
      
      {/* Second cube with offset position and different speed */}
      <OrbitingCube speed={0.4} positionOffset={Math.PI} rotationSpeed={-0.8} visible={!isHolographic}/>

      {!isMobile && !isHolographic && (
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
  const rendererRef = useRef();
  const resizeTimeout = useRef();

  // Handle resize with debounce
  const handleResize = useCallback(() => {
    if (!rendererRef.current || !canvasRef.current) return;
    
    // Clear any pending resize
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }
    
    // Force clear the canvas immediately
    const gl = rendererRef.current.getContext();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    resizeTimeout.current = setTimeout(() => {
      if (!canvasRef.current || !rendererRef.current) return;
      
      const parent = canvasRef.current.parentElement;
      if (!parent) return;
      
          const { width, height } = parent.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 2);
      
      // Update renderer size and pixel ratio
      rendererRef.current.setPixelRatio(pixelRatio);
      rendererRef.current.setSize(width, height, false);
      
      // Force a re-render to clear any artifacts
      if (rendererRef.current.getScene && rendererRef.current.getCamera) {
        rendererRef.current.render(
          rendererRef.current.getScene(), 
          rendererRef.current.getCamera()
        );
      }
    }, 50); // Small delay to handle rapid resizing
  }, [isMobile]);

  // Set up resize listener
  useEffect(() => {
      window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, [handleResize]);

  // Initial render and setup
  const onCreated = useCallback(({ gl, scene, camera, size }) => {
    setIsLoaded(true);
    gl.setClearColor(0, 0, 0, 0);
    scene.background = null;
    
    // Store renderer with additional methods
    rendererRef.current = {
      ...gl,
      getScene: () => scene,
      getCamera: () => camera
    };
    
    // Trigger initial resize
    handleResize();
  }, [handleResize]);

  return (
    <div 
      className={`${styles.logoContainer} ${className}`} 
      style={{ 
        width: `${width}px`, 
        height: `${height + 25}px`,
        position: 'relative',
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
          preserveDrawingBuffer: false
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
                luminanceThreshold={0.5} 
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
          rotateSpeed={0.3}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
