'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Image from 'next/image';
import * as THREE from 'three';
import { useScrollVelocity } from '../contexts/ScrollVelocityContext';

// Canvases are created this far (vertically) before a card reaches the viewport,
// so the WebGL context + texture are ready long before the card is seen.
const MOUNT_MARGIN = '100% 0px';
// ...and torn down only after the card has been far away for this long.
const UNMOUNT_DELAY_MS = 1500;
// Max Y-axis swivel in radians at full scroll speed (0.3 rad ≈ 17°).
const MAX_YAW = 0.3;

// ─── Shared, pre-decoded image cache ───────────────────────
// Keyed by URL. We feed the texture from the *same optimized URL the visible
// <Image> already downloaded* (its currentSrc), so there is no second download,
// the file is smaller, and it's same-origin (no CORS problems).
const imageCache = new Map();
function loadImage(url) {
  if (!imageCache.has(url)) {
    imageCache.set(
      url,
      new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => resolve(img));
        };
        img.onerror = (e) => {
          imageCache.delete(url);
          reject(e);
        };
        img.src = url;
      })
    );
  }
  return imageCache.get(url);
}

// 1 world unit === 1 CSS pixel at z = 0 (camera is calibrated below), so all
// displacement values in the vertex shader are in pixels.
const vertexShader = /* glsl */ `
  uniform float uVelocity;
  uniform vec2  uHover;
  uniform float uHoverStrength;
  uniform float uTime;
  uniform float uAspect;
  // per-card variation (derived from the image src, so it's stable)
  uniform float uGain;
  uniform float uTilt;
  uniform float uWaveAmp;
  uniform float uWaveFreq;
  uniform float uPhase;
  uniform float uShear;
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
/**
 * Per-card "personality", generated deterministically from the image src, so a
 * given image always behaves the same way, but different images differ. All
 * values are cheap uniforms/JS numbers: no per-card runtime cost.
 *
 * Quick mental model. Let v be the card's smoothed scroll velocity, roughly
 * -1..1 (negative = scrolling up, positive = down, ±1.15 on overshoot). Every
 * deformation below is "something × v", so it's zero when the page is still
 * and flips direction with the scroll direction. Distances are in CSS pixels
 * (the camera is calibrated so 1 world unit = 1px at the image plane).
 *
 * The vertex shader builds the depth displacement ("lift", along the camera
 * axis) from three layered shapes, then adds a horizontal shear:
 *
 *   lift  = sin(uv.y·π) · v · 140 · gain              (1) symmetric belly
 *         + (uv.y − 0.5) · v · 120 · tilt             (2) see-saw tilt
 *         + sin(uv.x·waveFreq + uv.y·2 + phase)
 *             · v · waveAmp                           (3) ripple across width
 *   pos.x += (uv.y − 0.5) · v · shear                 (4) horizontal shear
 */
function makeVariation(src) {
  const r = mulberry32(hashStr(src));
  const range = (a, b) => a + r() * (b - a);

  // Spring parameters are drawn first, and `swivel` is drawn LAST, so adding or
  // reordering new properties at the end never changes existing cards' values.
  const k = range(0.1, 0.18);
  const zeta = range(0.5, 0.8);

  return {
    /**
     * gain (0.7 – 1.25): strength of the symmetric "belly" bend, shape (1).
     * The vertical middle of the image pushes toward/away from the camera while
     * the top and bottom edges stay put, like a sheet of paper bowing in the
     * wind. Peak displacement at full scroll speed = 140px × gain, i.e. about
     * 98px (a restrained card) to 175px (a dramatic one). Raise the range for a
     * punchier overall effect; keep `bleed` ≥ the biggest value or the bulge
     * gets clipped by the canvas edge.
     */
    gain: range(0.7, 1.25),

    /**
     * tilt (±0.4 – ±1.2): strength AND direction of the see-saw, shape (2).
     * Unlike the belly this is asymmetric: one horizontal edge moves toward the
     * camera while the opposite one moves away, like tipping the card about a
     * horizontal axis through its centre. Edge displacement at full speed =
     * ±60px × |tilt| (±24px to ±72px). The random SIGN decides which edge leads
     * when you scroll down: positive cards lift their bottom edge, negative
     * ones their top edge. That is a big part of why neighbouring cards don't
     * move in lockstep. Use a constant sign here if you want them all to lean
     * the same way.
     */
    tilt: (r() < 0.5 ? -1 : 1) * range(0.4, 1.2),

    /**
     * waveAmp (10 – 40 px): amplitude of the lateral ripple, shape (3).
     * A smooth sine wave travelling along the image's width displaces points
     * toward/away from the camera by up to this many pixels at full speed.
     * Small values give a subtle surface shimmer, large ones a flag-like
     * flutter. It scales with scroll velocity, so a still page stays flat.
     */
    waveAmp: range(10, 40),

    /**
     * waveFreq (3 – 9): spatial frequency of the ripple, shape (3), in radians
     * across the full image width (uv.x runs 0 → 1). Divide by 2π for the number
     * of complete wave cycles visible: 3 ≈ half a cycle (a single gentle S),
     * 9 ≈ 1.4 cycles (a tighter, busier ripple). The extra `uv.y · 2` term in
     * the shader skews the wave diagonally so crests aren't perfectly vertical.
     */
    waveFreq: range(3, 9),

    /**
     * phase (0 – 2π radians): horizontal offset of the ripple pattern.
     * It decides WHERE along the width the crests and troughs sit, so two cards
     * with identical waveAmp/waveFreq still look different. The pattern is
     * static; it isn't animated over time, only its strength follows scroll
     * velocity. Has no effect on strength or speed.
     */
    phase: range(0, Math.PI * 2),

    /**
     * shear (±0.04): horizontal slant while scrolling, shape (4), expressed as
     * a fraction of the image width (not pixels). The top and bottom edges slide
     * sideways in opposite directions by ±(shear / 2) × width at full speed, so
     * the rectangle leans into a slight parallelogram. At 0.04 on a 600px-wide
     * image that is ±12px at each edge. The sign picks the lean direction
     * (positive: top edge drifts right when scrolling down). It's deliberately
     * tiny; it adds a sense of drag more than a visible shape change.
     */
    shear: range(-0.04, 0.04),

    /**
     * k (0.10 – 0.18): spring stiffness of this card's scroll-response spring.
     * Each frame the spring accelerates toward the target velocity by
     * (target − current) × k. Higher k = snappier: the card reacts to a scroll
     * flick sooner and settles faster (natural period ≈ 2π/√k frames: about 20
     * frames ≈ 0.33s at k = 0.10, about 15 frames ≈ 0.25s at k = 0.18, at
     * 60fps). Lower k = lazier, more floaty. Because every card has a slightly
     * different k, they start and stop moving at slightly different moments,
     * which is the "staggered" feel.
     */
    k,

    /**
     * damp (derived, ≈ 0.32 – 0.68): per-frame velocity retention of the spring,
     * i.e. friction. Not independent: it's computed from k and a damping ratio
     * ζ (zeta, drawn from 0.5 – 0.8) via damp = 1 − 2·ζ·√k, which keeps the
     * spring stable and gives a predictable feel. Because ζ < 1 the spring is
     * "underdamped", so it overshoots the target and wobbles back:
     *   ζ = 0.5 → about 16% overshoot  (a bouncy card),
     *   ζ = 0.8 → about 1.5% overshoot (a nearly dead-smooth card).
     * A value closer to 1 would mean less friction and more ringing; closer to
     * 0 means the motion is quickly choked. To make every card bouncier,
     * lower the zeta range above rather than editing damp directly.
     * (Frame-rate independence is approximate: the spring step is scaled by
     * the frame delta and clamped to 2× to survive slow frames.)
     */
    damp: 1 - 2 * zeta * Math.sqrt(k),

    /**
     * swivel (±0.55 – ±1.0): scale and direction of the Y-axis turn.
     * The card's yaw target is  v × MAX_YAW × swivel  (MAX_YAW = 0.3 rad), so at
     * full scroll speed it turns by 0.165 – 0.3 rad ≈ 9.5° – 17°, around a
     * vertical axis through its centre. The random sign sets the turn direction
     * for a downward scroll (some cards swing their left edge back, others
     * their right). It doesn't affect the hover turn, which always follows
     * the cursor. Change MAX_YAW (top of file) to scale all cards at once.
     */
    swivel: (r() < 0.5 ? -1 : 1) * range(0.55, 1.0),
  };
}

function DeformPlane({ src, resolveSrc, velocityRef, hoverRef, hoveredRef, rectRef, onReady }) {
  const meshRef = useRef(null);
  const spring = useRef({ x: 0, v: 0 });
  const yaw = useRef(0);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const variation = useMemo(() => makeVariation(src), [src]);
  const { camera, size, gl, invalidate } = useThree();

  useLayoutEffect(() => {
    camera.position.set(0, 0, size.height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.lookAt(0, 0, 0);
    camera.near = 10;
    camera.far = 5000;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.height, invalidate]);

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
    let tex = null;

    loadImage(resolveSrc())
      .then((img) => {
        if (cancelled) return;
        tex = new THREE.Texture(img);
        tex.anisotropy = 4;
        tex.needsUpdate = true;
        // Upload to the GPU NOW (while the card is still off-screen) instead of
        // on its first visible frame, which would hitch mid-scroll.
        gl.initTexture?.(tex);
        uniforms.uTexture.value = tex;
        uniforms.uImageAspect.value = img.naturalWidth / img.naturalHeight;
        if (meshRef.current) meshRef.current.visible = true;
        invalidate();
        onReadyRef.current?.();
      })
      .catch((err) => {
        console.warn('[DeformImage] texture load failed, keeping the plain image:', err);
      });

    return () => {
      cancelled = true;
      uniforms.uTexture.value = null;
      tex?.dispose();
    };
  }, [resolveSrc, uniforms, gl, invalidate]);

  useFrame((_, delta) => {
    const u = uniforms;
    const { w, h } = rectRef.current;
    if (meshRef.current && w > 0 && h > 0) {
      meshRef.current.scale.set(w, h, 1);
      u.uAspect.value = w / h;
    }

    // Boost slow scrolls, then a per-card spring for lag + settle wobble.
    const raw = velocityRef.current ?? 0;
    const target = Math.sign(raw) * Math.min(Math.pow(Math.abs(raw) * 1.8, 0.65), 1);
    const s = Math.min(delta * 60, 2);
    const sp = spring.current;
    sp.v += (target - sp.x) * variation.k * s;
    sp.v *= Math.pow(variation.damp, s);
    sp.x = THREE.MathUtils.clamp(sp.x + sp.v * s, -1.15, 1.15);
    u.uVelocity.value = sp.x;

    // Swivel on a central vertical pivot. It follows the scroll spring through a
    // second, lazier low-pass so it trails the bend slightly, and while hovered
    // the image turns a little toward the cursor's side.
    if (meshRef.current) {
      const hoverYaw = (hoverRef.current.x - 0.5) * 0.25 * u.uHoverStrength.value;
      const yawTarget = sp.x * MAX_YAW * variation.swivel + hoverYaw;
      yaw.current += (yawTarget - yaw.current) * Math.min(0.1 * s, 1);
      meshRef.current.rotation.y = yaw.current;
    }

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
  bleed = 100,
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const velocityRef = useScrollVelocity(); // must be read here, not inside <Canvas>

  const hoverRef = useRef({ x: 0.5, y: 0.5 });
  const hoveredRef = useRef(false);
  const rectRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const [layout, setLayout] = useState({ x: 0, y: 0, w: 0, h: 0, bx: 0 });
  const [mounted, setMounted] = useState(false); // canvas exists (near the viewport)
  const [visible, setVisible] = useState(false); // actually on screen => render loop runs
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // Texture source = the optimized URL the visible <Image> actually loaded.
  const resolveSrc = useCallback(() => imgRef.current?.currentSrc || src, [src]);

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
        bx: Math.max(0, Math.min(bleed, Math.floor(room))),
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

  // Two observers: a wide one decides when the canvas should EXIST (early, with
  // hysteresis), a tight one decides when it should actually RENDER.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let timer = null;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (timer) { clearTimeout(timer); timer = null; }
          setMounted(true);
        } else if (!timer) {
          timer = setTimeout(() => {
            setMounted(false);
            setReady(false);
            timer = null;
          }, UNMOUNT_DELAY_MS);
        }
      },
      { rootMargin: MOUNT_MARGIN, threshold: 0 }
    );
    const vis = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '50px 0px', threshold: 0 }
    );

    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
      if (timer) clearTimeout(timer);
    };
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

  const showCanvas = mounted && !glFailed && !reducedMotion && layout.w > 0;

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
        // As soon as the visible image has loaded, pre-decode it into the shared
        // cache so the texture is available instantly when the canvas mounts.
        onLoad={() => {
          const url = imgRef.current?.currentSrc;
          if (url) loadImage(url).catch(() => {});
        }}
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
            // Off-screen canvases keep their context + texture but stop looping.
            frameloop={visible ? 'always' : 'demand'}
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
              resolveSrc={resolveSrc}
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