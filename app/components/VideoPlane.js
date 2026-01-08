// In components/VideoPlane.js
'use client';
import { useRef, useEffect, useState } from 'react';
import { Plane } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Hls from 'hls.js';
import styles from '../css/VideoPlane.module.css';

function VideoContent({ videoUrl, isPlaying, setIsPlaying, isMuted, setIsMuted, volume, setVolume, ...props }) {
  const meshRef = useRef();
  const videoRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = isMuted;
    video.muted = true;
    video.playsInline = true;
    video.style.display = 'none';
    
    videoRef.current = video;
    document.body.appendChild(video);
    
    // Use HLS.js for .m3u8 streams
    if (videoUrl.includes('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        // Smooth playback optimizations
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
        maxBufferHole: 0.5,
        
        // Reduce quality switching for smoother playback
        abrEwmaFastLive: 3,
        abrEwmaSlowLive: 9,
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        abrBandWidthDownFactor: 0.9,
        
        // Start with reasonable quality
        startLevel: -1,
        autoStartLoad: true,
        
        // Smooth seeking
        maxSeekHole: 0.5,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: Infinity,
        
        // Enable hardware acceleration
        preferManagedMediaSource: true
      });
      
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed, playing video');
        video.play().catch(err => console.log('Video play error:', err));
      });
      
      // Monitor quality changes
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log('HLS level switched to:', data.level);
      });
    } else {
      // Fallback for direct video URLs
      video.src = videoUrl;
      video.play().catch(err => console.log('Video play error:', err));
    }
    
    const handleLoadedData = () => {
      console.log('Video loaded data');
    };
    
    const handleCanPlay = () => {
      console.log('Video can play');
      // Wait a bit for video to actually start playing
      setTimeout(() => {
        if (videoRef.current && meshRef.current) {
          console.log('Creating texture after canplay:', {
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
            readyState: videoRef.current.readyState,
            videoSrc: videoRef.current.src,
            videoCurrentTime: videoRef.current.currentTime,
            videoDuration: videoRef.current.duration
          });
          
          const texture = new THREE.VideoTexture(videoRef.current);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.needsUpdate = true;
          texture.colorSpace = THREE.SRGBColorSpace;
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
          meshRef.current.material.transparent = false;
          meshRef.current.material.opacity = 1;
          
          console.log('After applying texture:', {
            meshMap: meshRef.current.material.map,
            meshNeedsUpdate: meshRef.current.material.needsUpdate,
            materialType: meshRef.current.material.type
          });
        }
      }, 100);
    };
    
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      if (videoRef.current && videoRef.current.parentNode) {
        videoRef.current.parentNode.removeChild(videoRef.current);
      }
    };
  }, [videoUrl]);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlayPause();
      } else if (event.code === 'KeyM') {
        event.preventDefault();
        toggleMute();
      } else if (event.code === 'ArrowUp') {
        event.preventDefault();
        adjustVolume(0.1);
      } else if (event.code === 'ArrowDown') {
        event.preventDefault();
        adjustVolume(-0.1);
      }
    };
    
    const togglePlayPause = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    };
    
    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(!isMuted);
      }
    };
    
    const adjustVolume = (delta) => {
      if (videoRef.current) {
        const newVolume = Math.max(0, Math.min(1, volume + delta));
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      
      {/* Shadow plane beneath the video 
      <mesh 
        position={[0, -3, -11]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[82, 55]} />
        <meshStandardMaterial 
          color="#000000" 
          transparent 
      {/* Floating video plane with mouse interaction */}
      <Plane 
        ref={meshRef} 
        args={[64, 36]} 
        position={[0, 0, -19]} 
        rotation={[
          mousePosition.y * 0.015,  // Pitch based on mouse Y
          mousePosition.x * 0.015,  // Yaw based on mouse X
          0
        ]}
        {...props}
        castShadow
      >
        <meshStandardMaterial 
          color="#ffffff"
          transparent={false}
          opacity={1}
          metalness={0}
          roughness={0}
          emissive="#ffffff"
          emissiveIntensity={0.01}
        />
      </Plane>
    </>
  );
}

export default function VideoPlane({ videoUrl = 'https://stream.mux.com/jQpM2jwUgrzmGjMoY8UIG7tUXHSaBK6zvWXIlqxJkMs.m3u8' }) {
  console.log('VideoPlane rendering with URL:', videoUrl);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);

  return (
    <div 
      style={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 500,
        pointerEvents: 'none'
      }}
    >
      <div className={styles.videoPlaneContainer}>
        <div className={styles.videoPlaneWrapper}>
          <Canvas 
            className={styles.videoPlaneCanvas}
            camera={{ position: [0, 0, 5], fov: 75 }}
            shadows
          >
            <VideoContent 
              videoUrl={videoUrl} 
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              volume={volume}
              setVolume={setVolume}
            />
          </Canvas>
        </div>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'monospace',
          background: 'rgba(0,0,0,0.7)',
          padding: '8px 12px',
          borderRadius: '4px',
          pointerEvents: 'auto',
          zIndex: 1000
        }}>
          <div>SPACE: {isPlaying ? 'Pause' : 'Play'}</div>
          <div>M: {isMuted ? 'uted' : 'ute'}</div>
          <div>↑/↓: Volume {Math.round(volume * 100)}%</div>
        </div>
      </div>
    </div>
  );
}