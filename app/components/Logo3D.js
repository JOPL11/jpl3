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
//import SoftParticlesComponent from './SoftParticlesComponent';



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
    return fract(sin(dot(st.xy, vec2(10.9898, 118.233))) * 23758.9453123);
  }
  
  void main() {
    // Base color with fresnel effect
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition + vPosition);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 1.5);
    
    // Thin scan lines with high frequency
    float scanLine = sin(vPosition.y * 0.2 + uTime * 1.0) * 0.8 + 0.3;
    scanLine = smoothstep(2.9, 12.9, scanLine);  // Wider transition for taller dark line
    
    // Add subtle secondary pattern
    float scanLine2 = sin(vPosition.y * 0.8 - uTime * 1.0) * 1.22 + 0.75;
    scanLine = min(scanLine, scanLine2);  // Combine patterns for more detail
    
    // High contrast for visibility
    scanLine = mix(0.2, 0.6, scanLine);
    
    // Base color - using a slightly darker base to make lines pop
    vec3 finalColor = uColor * (0.9 + fresnel * 2.9);
    
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
   {/*
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
    { position: [distance, distance, 2.5] }, */} ,
    
    // Middle points
    { position: [-distance, 0, -0.5] },          // Middle-left
    { position: [distance, 0, -0.5] },           // Middle-right
    
    // Bottom point (single, centered)
    { position: [0, -distance, -2.0] },  
    { position: [0, -distance, -2.5] }, 
   
  /*  { position: [0, -distance, -1.5] }, 
    { position: [0, -distance, -1.0] }, 
    { position: [0, -distance, -0.5] }, */   
    { position: [1, -distance, 0] }, 
    { position: [-0.5, -distance, 0.8] },             
   /*  { position: [0, -distance, 1.0] },   
    { position: [0, -distance, 1.5] },   
    { position: [0, -distance, 2.0] },   */ 
     { position: [-1, -distance, -0.5] },       
       
         
    
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

function LogoCorners({ size = 0.1, distance = 1.0, intensity = 2.0 }) {
  console.log('LogoCorners is rendering');
  const lines = useMemo(() => [
    { position: [1.1, 0.02, 0.25] },  
    { position: [1.1, 0.54, 0.25] },

    { position: [1.1, 0.02, -0.65] },  
    { position: [1.1, 0.54, -0.65] },

    { position: [0.5, 0.54, 0.25] },
    { position: [0.5, 0.02, -0.65] },  

    { position: [-0.85, -0.5, 0.25] },
    { position: [-0.85, -0.5, -0.65] },
    
    { position: [0.1, 0.54, -0.65] },
    { position: [-0.4, 0.54, -0.65] },

    { position: [0.1, 0.54, 0.25] },
    { position: [-0.4, 0.54, 0.25] },

    { position: [0.36, -1.4, -0.65] },
    { position: [0.36, -1.4, 0.25] },

    { position: [0.36, -0.9, -0.65] },
    { position: [0.36, -0.9, 0.25] },
  ], []);
  
  return (
    <group>
      {lines.map((line, index) => (
        <mesh key={index} position={line.position}>
       <boxGeometry args={[0.01, 0.01, 0.25]} />
          <meshBasicMaterial 
            color="#87ceeb"
            wireframe={false}
            transparent={false}
            opacity={0.01}
          />
        </mesh>
      ))}
    </group>
  );
}

function LogoLongs({ size = 0.1, distance = 1.0, intensity = 2.0 }) {
  const lines2 = useMemo(() => [
    { position: [ 1.25, 0.02, 0.05 ] },  
    { position: [ 1.25, 0.54, 0.05 ] },

    { position: [ 1.25, 0.02, -0.45 ] },  
    { position: [ 1.25, 0.54, -0.45 ] },

    { position: [-1.05, -0.5, 0.05 ] },
    { position: [-1.05, -0.5, -0.48 ] },

    { position: [0.2, -1.4, -0.45 ] },
    { position: [0.2, -1.4, 0.05 ] },

    { position: [0.2, -0.9, -0.45 ] },
    { position: [0.2, -0.9, 0.05 ] },
  ], []);
  
  return (
    <group>
      {lines2.map((line, index) => (
        <mesh key={index} position={line.position}>
       <boxGeometry args={[0.25, 0.01, 0.01]} />
          <meshBasicMaterial 
            color="#87ceeb"
            wireframe={false}
            transparent={false}
            opacity={0.01}
          />
        </mesh>
      ))}
    </group>
  );
}


// Model component with holographic toggle
function Model({ url, position = [0, -0.05, 0], isHolographic, onHolographicChange, isHovered }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  // Update cursor style based on hover state
  useEffect(() => {
    if (groupRef.current) {
      document.body.style.cursor = isHovered ? 'pointer' : 'auto';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [isHovered]);
  
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
// Store original material if not already stored
if (!child.userData.originalMaterial) {
  child.userData.originalMaterial = child.material; // Store GLB's original
  child.geometry.computeVertexNormals();
  // Create your custom material and store it
 child.userData.customMaterial = new THREE.MeshStandardMaterial({
  color: 0x141917,
  metalness: 0.3,        // Metallic property
  roughness: 0.2,        // Roughness property
  emissive: 0x141917,
  flatShading: false
});
}
// Apply appropriate material
child.material = isHolographic 
  ? hologramMaterial 
  : child.userData.customMaterial; // Use your custom material, not origina
      }
    });
  }, [scene, isHolographic, hologramMaterial]);

  


  return (
    <group 
      ref={groupRef}
      position={position} 
      onClick={() => onHolographicChange(!isHolographic)}
    >
      <primitive object={scene} scale={0.05} />
      {isHolographic && (
        <>
          <HologramCorners />
          <LogoCorners />
          <LogoLongs />
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


function DelayedOscillatingBox({ delay = 20, color = 0x87CEEB }) {
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
      <planeGeometry args={[0.88, 0.15]} />
      <meshBasicMaterial 
        map={texture}
        transparent={true}
        alphaTest={0.5}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

function OrbitingCube({ radius = 1.5, speed = 0.5, positionOffset = 1.3, rotationSpeed = 8, visible = true }) {
  const cubeRef = useRef();
  const lightRef = useRef();
  const smallCube1Ref = useRef();
  const smallCube2Ref = useRef();
  const smallCube3Ref = useRef();
  
  useFrame(({ clock }) => {
    if (!cubeRef.current || !visible) return;

    const time = clock.getElapsedTime() * speed;
    const phaseShift = time * 0.3;
    
    const x = Math.sin(time * 0.1 + positionOffset  + phaseShift) * radius * 0.9;
    const y = Math.sin(time * 0.1 + positionOffset + phaseShift * 0.1) * radius * 0.7;
    const z = Math.cos(time * 0.1 + positionOffset + phaseShift) * radius * 0.6;
    
    // Update main cube position and rotation
    cubeRef.current.position.set(x, y, z);
    cubeRef.current.rotation.x = time * rotationSpeed;
    cubeRef.current.rotation.y = time * rotationSpeed * 0.5;


    
    // Update light position
    if (lightRef.current) {
      lightRef.current.position.set(x, y, z);
    }

    // Update small orbiting cubes
    if (smallCube1Ref.current) {
      const orbitTime = time * 2; // Faster orbit
      const orbitRadius = 0.15;
      smallCube1Ref.current.position.x = Math.sin(orbitTime) * orbitRadius;
      smallCube1Ref.current.position.y = Math.cos(orbitTime) * orbitRadius;
      smallCube1Ref.current.rotation.x = time * 2;
      smallCube1Ref.current.rotation.y = time * 1.5;
    }

    if (smallCube2Ref.current) {
      const orbitTime = time * 1.5 + Math.PI; // Offset by 180 degrees
      const orbitRadius = 0.1;
      smallCube2Ref.current.position.x = Math.cos(orbitTime) * orbitRadius;
      smallCube2Ref.current.position.z = Math.sin(orbitTime) * orbitRadius;
      smallCube2Ref.current.rotation.x = time * 1.5;
      smallCube2Ref.current.rotation.z = time * 2;
    }

    if (smallCube3Ref.current) {
      const orbitTime = time * 2.8 + Math.PI; // Offset by 180 degrees
      const orbitRadius = 0.19;
      smallCube3Ref.current.position.x = Math.cos(orbitTime) * orbitRadius;
      smallCube3Ref.current.position.z = Math.sin(orbitTime) * orbitRadius;
      smallCube3Ref.current.rotation.x = time * 2.5;
      smallCube3Ref.current.rotation.z = time * 2.5;
    }
  });

  return (
    <group>
      <group ref={cubeRef} visible={visible}>
        <mesh>
          <sphereGeometry args={[0.03, 8, 16]} />
          <meshPhysicalMaterial 
            color="#FFFFFF"
            emissive="#2a6f85"
            emissiveIntensity={22}
            toneMapped={false}
          />
        </mesh>
        
        {/* First small orbiting cube */}
        <mesh ref={smallCube1Ref}>
          <boxGeometry args={[0.02, 0.02, 0.02]} />
          <meshPhysicalMaterial 
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        
        {/* Second small orbiting cube */}
        <mesh ref={smallCube2Ref}>
          <boxGeometry args={[0.015, 0.015, 0.015]} />
          <meshPhysicalMaterial 
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>

        {/* Third small orbiting cube */}
        <mesh ref={smallCube3Ref}>
          <boxGeometry args={[0.019, 0.019, 0.019]} />
          <meshPhysicalMaterial 
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      </group>
      
      <pointLight 
        ref={lightRef}
        color="#FFFFFF" 
        intensity={visible ? 1 : 0} 
        distance={3} 
        decay={2} 
      />
    </group>
  );
}


function Scene({ modelUrl }) {
  const isMobile = useMobileDetect();
  const [isHolographic, setIsHolographic] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Toggle holographic effect on hover
  useEffect(() => {
    if (isHovered) {
      setIsHolographic(true);
    } else {
      const timer = setTimeout(() => {
        setIsHolographic(false);
      }, 500); // Small delay before turning off the effect
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  return (
    <>
      <ambientLight intensity={3.0} color={0xFFFFFF} />
      <directionalLight 
        position={[0, 44, 200]} 
        intensity={1.3}
        color="#87cacf"
      />
     
      <group
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
      <Model 
        url={modelUrl} 
        isHolographic={isHovered || isHolographic}
        onHolographicChange={setIsHolographic}
        isHovered={isHovered}
      />
      <NameText />
      {/* First cube */}
      <OrbitingCube speed={1.3} positionOffset={0} rotationSpeed={1} visible={!isHolographic}/>
      
      {/* Second cube with offset position and different speed */}
      <OrbitingCube  speed={1.4} positionOffset={Math.PI} rotationSpeed={-0.8} visible={!isHolographic}/>

      <OrbitingCube  speed={1.2} positionOffset={Math.PI / 2} rotationSpeed={0.9} visible={!isHolographic}/>
       <pointLight position={[2, -4, 11]} intensity={33.3} color="#87cacf" />
      <pointLight position={[2, 0, 8]} intensity={33.3} color="#87cacf" />
      <pointLight position={[-3.5, -0.7, 5.5]} intensity={44} color="#87cacf" />
      <pointLight position={[7, 0.5, 4.8]} intensity={33.2} color="#87cacf" />
      </group>
  {/* Second cube with offset position and different speed 
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
      )} */}
    </>
  );
}

// Loading bar component
const LoadingBar = ({ width = 80 }) => {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const animate = () => {
      setProgress(prev => {
        // Bounce between 20% and 80% for a smooth loading effect
        const newProgress = prev + 0.02;
        return newProgress > 0.8 ? 0.2 : newProgress;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${width * 0.5}px`,
      height: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      overflow: 'hidden',
      zIndex: 10
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        backgroundColor: '#fff',
        transition: 'width 300ms ease-out',
        borderRadius: '2px'
      }} />
    </div>
  );
};

export default function Logo3D({ width = '100vw', height = 350, className = '' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef();
  const isMobile = useMobileDetect();
  const rendererRef = useRef();
  const resizeTimeout = useRef();

  useEffect(() => {
  const container = canvasRef.current?.parentElement;
  if (container) {
    console.log('Container width:', container.getBoundingClientRect().width);
    console.log('Window width:', window.innerWidth);
    console.log('Container style:', container.style.width);
  }
}, []);

  // Handle resize with debounce
const handleResize = useCallback(() => {
  if (!rendererRef.current || !canvasRef.current) return;
  
  // Clear any pending resize
  if (resizeTimeout.current) {
    clearTimeout(resizeTimeout.current);
  }
  
  // Force clear canvas immediately
  const gl = rendererRef.current.getContext();
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  resizeTimeout.current = setTimeout(() => {
    if (!canvasRef.current || !rendererRef.current) return;
    
    // If width is '100vw', use window width directly
    const canvasWidth = width === '100vw' ? window.innerWidth : 
      canvasRef.current.parentElement.getBoundingClientRect().width;
    
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 2);
    
    // Update renderer size and pixel ratio
    rendererRef.current.setPixelRatio(pixelRatio);
    rendererRef.current.setSize(canvasWidth, height, false);
    
    // Force a re-render to clear any artifacts
    if (rendererRef.current.getScene && rendererRef.current.getCamera) {
      rendererRef.current.render(
        rendererRef.current.getScene(), 
        rendererRef.current.getCamera()
      );
    }
  }, 50);
}, [isMobile, width, height]);

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
          width:  '100vw', 
          height: `${height + 25}px`,
          position: 'relative',
          overflow: 'visible', // Allow overflow
          opacity: isLoaded ? 1 : 1,
          transition: 'opacity 500ms ease-in-out',
          visibility: isLoaded ? 'visible' : 'visible',
          maxWidth: 'none', // Add this
          minWidth: '100vw' // Add this
      }}
    >
      {!isLoaded && <LoadingBar width={width} />}
      <Canvas 
        ref={canvasRef}
        className={styles.canvasContainer}
        camera={{ position: [0, 0, 4.7], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? 1 : [1, 2]}
        onCreated={({ gl, scene }) => {
          setIsLoaded(true);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
          gl.setClearColor(0, 0, 0, 0);
          scene.background = null;
          
          // Force clear the canvas
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }}
        style={{
          display: 'block',
          background: 'transparent',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: 'translate3d(0,0,0)',
          transform: 'translate3d(0,0,0)',
          overflow: 'visible', // Allow canvas content to overflow
          width: '100vw', // Make canvas full viewport width
          maxWidth: 'none', // Add this
          minWidth: '100vw' // Add this
        }}
      >
        <color attach="background" args={[0x000000, 0]} />
        <Suspense fallback={null}>
     {/*       {!isMobile && (
            <>
            {console.log('isMobile:', isMobile)}
            {console.log('Should render EffectComposer:', !isMobile)}
            <DepthOfField
                  focusDistance={0.1}
                  focalLength={0.0005}
                  blur={0}    
                  blendFunction={BlendFunction.NORMAL} 
                  opacity={1}  
                  target={[0, 0, -1]} 
                  bokehScale={1} 
                  width={width} 
                  height={height}
                  resolutionY={height / 2}
                  resolutionX={width / 2} 
                /> 
            </>
          )} */}
            <EffectComposer>
            <SMAA />
              <Bloom 
                luminanceThreshold={0.4} 
                mipmapBlur 
                luminanceSmoothing={0.3} 
                intensity={0.5} 
                kernelSize={4}
              />
            </EffectComposer>
           
   
          <Scene modelUrl="/assets/logo2.glb" />
   
        </Suspense>
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.01}
          minPolarAngle={Math.PI / 2}  // Limit vertical rotation
          maxPolarAngle={Math.PI / 1.5}
          minAzimuthAngle={-Math.PI / 4} // Limit left rotation (in radians)
          maxAzimuthAngle={Math.PI / 4}  
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
