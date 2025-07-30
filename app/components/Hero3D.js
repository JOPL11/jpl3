'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PlanesOverlay from './PlanesOverlay';



export default function Hero3D() {
  return (
    <div style={{ 
      width: '100%', 
      height: '60vh', 
      background: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 3D Canvas */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        zIndex: 1 
      }}>
        <Canvas camera={{ fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          
          <OrbitControls 
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1.5}
          />
        </Canvas>
      </div>
      
      {/* 2D Planes Overlay */}
      <PlanesOverlay />
    </div>
  );
}
