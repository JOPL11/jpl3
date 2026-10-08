'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Image from 'next/image';
import * as THREE from 'three';
import { useScrollVelocity } from '../contexts/ScrollVelocityContext';
import styles from '../css/DeformImage.module.css';

// 1 world unit === 1 CSS pixel at z = 0 (see camera setup below), so all
// displacement values here are in pixels.
const vertexShader = /* glsl */ `
  uniform float uVelocity;       // roughly -1..1
  uniform vec2  uHover;          // 0..1, y up
  uniform float uHoverStrength;
  uniform float uTime;
  uniform float uAspect;         // container w / h
  varying vec2  vUv;
  varying float vLift;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // scroll: belly of the sheet pushes out + the whole thing tilts
    float arc = sin(uv.y * 3.14159265);
    float lift = arc * uVelocity * 140.0;
    lift += (uv.y - 0.5) * uVelocity * 120.0;
    pos.x *= 1.0 - abs(uVelocity) * 0.05 * arc;

    // hover: soft bulge toward the camera under the cursor
    vec2 d2 = (uv - uHover) * vec2(uAspect, 1.0);
    lift += exp(-dot(d2, d2) * 4.0) * uHoverStrength * 70.0;
    lift += sin(uTime * 2.5 + uv.x * 6.2831 + uv.y * 3.0) * uHoverStrength * 4.0;

    pos.z += lift;
    vLift = lift;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uAspect;
  uniform float uImageAspect;
  varying vec2  vUv;
  varying float vLift;

  void main() {
    // object-fit: cover
    vec2 ratio = vec2(
      min(uAspect / uImageAspect, 1.0),
      min(uImageAspect / uAspect, 1.0)
    );
    vec2 uv = (vUv - 0.5) * ratio + 0.5;

    vec4 col = texture2D(uTexture, uv);
    col.rgb *= clamp(1.0 + vLift * 0.0015, 0.7, 1.25); // cheap depth shading
    gl_FragColor = col;
  }
`;

function DeformPlane({ src, velocityRef, hoverRef, hoveredRef, containerRef, onReady }) {
  const meshRef = useRef(null);
  const { camera, size } = useThree();

  // Perspective camera calibrated so 1 unit = 1px at the z=0 plane.
  useLayoutEffect(() => {
    camera.position.z = size.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.near = 10;
    camera.far = 5000;
    camera.updateProjectionMatrix();
  }, [camera, size.height]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: null },
      uVelocity: { value: 0 },
      uHover: { value: new THREE.Vector2(0.5, 0.5) },
      uHoverStrength: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uImageAspect: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(src, (tex) => {
      if (cancelled) { tex.dispose(); return; }
      tex.anisotropy = 4;
      uniforms.uTexture.value = tex;
      uniforms.uImageAspect.value = tex.image.width / tex.image.height;
      if (meshRef.current) meshRef.current.visible = true;
      onReady?.();
    });
    return () => {
      cancelled = true;
      uniforms.uTexture.value?.dispose();
      uniforms.uTexture.value = null;
    };
  }, [src, uniforms, onReady]);

  useFrame((_, delta) => {
    const u = uniforms;
    const el = containerRef.current;
    const mesh = meshRef.current;

    // Mesh = exact pixel size of the container, centred in the (larger) canvas.
    if (el && mesh) {
      const w = el.clientWidth;
      const h = el.clientHeight;
      mesh.scale.set(w, h, 1);
      u.uAspect.value = w / Math.max(h, 1);
    }

    const vel = THREE.MathUtils.clamp(velocityRef.current ?? 0, -1, 1);
    u.uVelocity.value += (vel - u.uVelocity.value) * 0.2;

    u.uHoverStrength.value += ((hoveredRef.current ? 1 : 0) - u.uHoverStrength.value) * 0.15;
    u.uHover.value.x += (hoverRef.current.x - u.uHover.value.x) * 0.2;
    u.uHover.value.y += (hoverRef.current.y - u.uHover.value.y) * 0.2;

    u.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} visible={false} frustumCulled={false}>
      <planeGeometry args={[1, 1, 48, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function DeformImage({
  src,
  alt,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  sizes,
  bleed = 100, // px the canvas extends past the container on every side
}) {
  const containerRef = useRef(null);
  // Context must be read on the DOM side; it does not cross the <Canvas> boundary.
  const velocityRef = useScrollVelocity();

  const hoverRef = useRef({ x: 0.5, y: 0.5 });
  const hoveredRef = useRef(false);

  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (timer) { clearTimeout(timer); timer = null; }
          setInView(true);
        } else if (!timer) {
          timer = setTimeout(() => {
            setInView(false);
            setReady(false);
            timer = null;
          }, 400);
        }
      },
      { rootMargin: '300px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) setGlFailed(true);
    } catch {
      setGlFailed(true);
    }
  }, []);

  const handlePointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    hoverRef.current.x = (e.clientX - r.left) / r.width;
    hoverRef.current.y = 1 - (e.clientY - r.top) / r.height;
  };

  const showCanvas = inView && !glFailed && !reducedMotion;

  return (
    <div
      ref={containerRef}
      className={`${styles.wrap} ${className || ''}`}
      style={{ position: 'relative', overflow: 'visible' }}
      onPointerEnter={() => { hoveredRef.current = true; }}
      onPointerLeave={() => { hoveredRef.current = false; }}
      onPointerMove={handlePointerMove}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={imageClassName}
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          opacity: showCanvas && ready ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {showCanvas && (
        <div
          className={styles.canvasLayer}
          style={{
            position: 'absolute',
            top: -bleed,
            left: -bleed,
            width: `calc(100% + ${bleed * 2}px)`,
            height: `calc(100% + ${bleed * 2}px)`,
            transform: 'none',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <Canvas
            frameloop="always"
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            camera={{ fov: 30, near: 10, far: 5000, position: [0, 0, 1000] }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <DeformPlane
              src={src}
              velocityRef={velocityRef}
              hoverRef={hoverRef}
              hoveredRef={hoveredRef}
              containerRef={containerRef}
              onReady={() => setReady(true)}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
}