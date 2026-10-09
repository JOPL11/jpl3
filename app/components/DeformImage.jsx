'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Image from 'next/image';
import * as THREE from 'three';
import { useScrollVelocity } from '../contexts/ScrollVelocityContext';

// 1 world unit === 1 CSS pixel at z = 0 (camera is calibrated below), so all
// displacement values in the vertex shader are in pixels.
const vertexShader = /* glsl */ `
  uniform float uVelocity;
  uniform vec2  uHover;
  uniform float uHoverStrength;
  uniform float uTime;
  uniform float uAspect;
  // per-card variation (derived from the image src, so it's stable)
  uniform float uGain;      // overall strength
  uniform float uTilt;      // tilt strength + direction (can be negative)
  uniform float uWaveAmp;   // lateral ripple amplitude (px)
  uniform float uWaveFreq;  // lateral ripple frequency
  uniform float uPhase;     // ripple phase offset
  uniform float uShear;     // horizontal shear while scrolling
  varying vec2  vUv;
  varying float vLift;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float arc = sin(uv.y * 3.14159265);
    float lift = arc * uVelocity * 140.0 * uGain;
    lift += (uv.y - 0.5) * uVelocity * 120.0 * uTilt;
    lift += sin(uv.x * uWaveFreq + uv.y * 2.0 + uPhase) * uVelocity * uWaveAmp;
    pos.x *= 1.0 - abs(uVelocity) * 0.05 * arc;
    pos.x += (uv.y - 0.5) * uVelocity * uShear;

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
    vec2 ratio = vec2(
      min(uAspect / uImageAspect, 1.0),
      min(uImageAspect / uAspect, 1.0)
    );
    vec2 uv = (vUv - 0.5) * ratio + 0.5;

    vec4 col = texture2D(uTexture, uv);
    col.rgb *= clamp(1.0 + vLift * 0.0015, 0.7, 1.25);
    gl_FragColor = col;
  }
`;

// Deterministic per-image randomness: same image => same "personality".
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeVariation(src) {
  const r = mulberry32(hashStr(src));
  const range = (a, b) => a + r() * (b - a);
  const k = range(0.1, 0.18);          // spring stiffness
  const zeta = range(0.5, 0.8);        // damping ratio: lower = more wobble
  return {
    gain: range(0.7, 1.25),
    tilt: (r() < 0.5 ? -1 : 1) * range(0.4, 1.2),
    waveAmp: range(10, 40),
    waveFreq: range(3, 9),
    phase: range(0, Math.PI * 2),
    shear: range(-0.04, 0.04),
    k,
    damp: 1 - 2 * zeta * Math.sqrt(k),
  };
}

function DeformPlane({ src, velocityRef, hoverRef, hoveredRef, rectRef, onReady }) {
  const meshRef = useRef(null);
  const spring = useRef({ x: 0, v: 0 });
  // Keep the callback in a ref: an inline arrow from the parent changes every
  // render, and having it in the texture effect's deps made the texture dispose
  // and reload on every parent re-render (flicker / dead frames).
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const variation = useMemo(() => makeVariation(src), [src]);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    camera.position.set(0, 0, size.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.lookAt(0, 0, 0);
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
      uGain: { value: variation.gain },
      uTilt: { value: variation.tilt },
      uWaveAmp: { value: variation.waveAmp },
      uWaveFreq: { value: variation.waveFreq },
      uPhase: { value: variation.phase },
      uShear: { value: variation.shear },
    }),
    [variation]
  );

  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(src, (tex) => {
      if (cancelled) { tex.dispose(); return; }
      tex.anisotropy = 4;
      uniforms.uTexture.value = tex;
      uniforms.uImageAspect.value = tex.image.width / tex.image.height;
      if (meshRef.current) meshRef.current.visible = true;
      onReadyRef.current?.();
    });
    return () => {
      cancelled = true;
      uniforms.uTexture.value?.dispose();
      uniforms.uTexture.value = null;
    };
  }, [src, uniforms]);

  useFrame((_, delta) => {
    const u = uniforms;
    const { w, h } = rectRef.current;
    if (meshRef.current && w > 0 && h > 0) {
      meshRef.current.scale.set(w, h, 1);
      u.uAspect.value = w / h;
    }

    // Response curve: boosts slow scrolls so the effect reliably kicks in,
    // then a per-card spring gives each image its own lag and settle wobble.
    const raw = velocityRef.current ?? 0;
    const target = Math.sign(raw) * Math.min(Math.pow(Math.abs(raw) * 1.8, 0.65), 1);
    const s = Math.min(delta * 60, 2);
    const sp = spring.current;
    sp.v += (target - sp.x) * variation.k * s;
    sp.v *= Math.pow(variation.damp, s);
    sp.x = THREE.MathUtils.clamp(sp.x + sp.v * s, -1.15, 1.15);
    u.uVelocity.value = sp.x;

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
  className, // intentionally NOT applied to the wrapper (see imageClassName)
  imageClassName,
  priority = false,
  sizes,
  bleed = 100, // px the canvas extends past the image
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const velocityRef = useScrollVelocity(); // must be read here, not inside <Canvas>

  const hoverRef = useRef({ x: 0.5, y: 0.5 });
  const hoveredRef = useRef(false);
  const rectRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const [layout, setLayout] = useState({ x: 0, y: 0, w: 0, h: 0, bx: 0 });
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // Measure the VISIBLE <img> relative to the wrapper. Everything (canvas
  // position, mesh size) derives from this, so it always lines up with the image
  // no matter what the surrounding CSS does at any breakpoint.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const ir = img.getBoundingClientRect();
      const room = Math.min(ir.left, document.documentElement.clientWidth - ir.right);
      const next = {
        x: Math.round((ir.left - wr.left) * 100) / 100,
        y: Math.round((ir.top - wr.top) * 100) / 100,
        w: Math.round(ir.width * 100) / 100,
        h: Math.round(ir.height * 100) / 100,
        bx: Math.max(0, Math.min(bleed, Math.floor(room))), // avoid horizontal page overflow
      };
      rectRef.current = next;
      setLayout((p) =>
        p.x === next.x && p.y === next.y && p.w === next.w && p.h === next.h && p.bx === next.bx ? p : next
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(img);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [bleed]);

  useEffect(() => {
    const el = wrapRef.current;
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
    const r = imgRef.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    hoverRef.current.x = (e.clientX - r.left) / r.width;
    hoverRef.current.y = 1 - (e.clientY - r.top) / r.height;
  };

  const showCanvas = inView && !glFailed && !reducedMotion && layout.w > 0;

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', width: '100%', overflow: 'visible', pointerEvents: 'auto' }}
      onPointerEnter={() => { hoveredRef.current = true; }}
      onPointerLeave={() => { hoveredRef.current = false; }}
      onPointerMove={handlePointerMove}
    >
      <Image
        ref={imgRef}
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
          data-deform-canvas
          style={{
            position: 'absolute',
            left: layout.x - layout.bx,
            top: layout.y - bleed,
            width: layout.w + layout.bx * 2,
            height: layout.h + bleed * 2,
            pointerEvents: 'none',
            zIndex: 5,
            overflow: 'visible',
            transform: 'none',
          }}
        >
          <Canvas
            frameloop="always"
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            camera={{ fov: 30, near: 10, far: 5000, position: [0, 0, 1000] }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('[DeformImage] WebGL context lost for', src);
                setReady(false); // fall back to the plain <Image> instead of a blank card
              });
            }}
          >
            <DeformPlane
              src={src}
              velocityRef={velocityRef}
              hoverRef={hoverRef}
              hoveredRef={hoveredRef}
              rectRef={rectRef}
              onReady={() => setReady(true)}
            />
          </Canvas>
        </div>
      )}
    </div>
  );
}