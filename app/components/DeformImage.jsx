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
// Max Y-axis swivel in radians at full scroll speed (0.5 rad ≈ 29°).
const MAX_YAW = 0.5;

// ─── Shared, pre-decoded image cache ───────────────────────
// Keyed by URL. The texture is fed from the *same optimized URL the visible
// <Image> already downloaded* (its currentSrc): no second download, same-origin.
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

// ─── Shaders ───────────────────────────────────────────────
// The geometry is a flat, undeformed plane. Every effect is done with light and
// pixels in the fragment shader, so the card's clean edges never bend.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2  uSize;          // image rect in CSS px
  uniform float uImageAspect;
  uniform float uV;             // scroll velocity (spring), roughly -1..1
  uniform float uSwing;         // swivel, normalised: yaw / MAX_YAW, roughly -1..1
  uniform vec2  uHover;         // 0..1, y up
  uniform float uHoverStrength; // 0..1
  // per-card variation
  uniform float uCell;          // pixel-block size in px
  uniform float uExtrude;       // max block drag, as a fraction of image height
  uniform float uSplit;         // RGB split, as a fraction of image height
  uniform float uBright;        // exposure boost at full speed
  uniform float uSeed;          // decorrelates the block pattern between cards
  uniform float uZoom;          // magnification of a fully ignited block
  uniform float uAberr;         // radial chromatic aberration of a fully ignited block
  uniform float uCover;         // fraction of blocks that can ignite at full speed
  uniform float uPad;           // px the mesh extends above AND below the image
  uniform float uSpill;         // how many block-rows can spill past the edge
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453);
  }

  // object-fit: cover sampling
  vec4 tex(vec2 uv) {
    float aspect = uSize.x / uSize.y;
    vec2 ratio = vec2(
      min(aspect / uImageAspect, 1.0),
      min(uImageAspect / aspect, 1.0)
    );
    uv = (uv - 0.5) * ratio + 0.5;
    return texture2D(uTexture, clamp(uv, 0.0, 1.0));
  }

  void main() {
    float aspect = uSize.x / uSize.y;
    float a   = clamp(abs(uV), 0.0, 1.0);   // effect intensity
    float dir = sign(uV);                    // scroll direction

    // Position in IMAGE space. The mesh is taller than the image by uPad px on
    // the top and bottom, so iuv.y runs below 0 and above 1 in those margins.
    vec2 iuv = vec2(vUv.x, (vUv.y * (uSize.y + 2.0 * uPad) - uPad) / uSize.y);
    float ipy = iuv.y * uSize.y;
    // 1 inside the image, 0 outside, with a ~1px soft edge (the edge is made in
    // the shader, so it needs its own anti-aliasing when the card swivels).
    float inside = smoothstep(-0.75, 0.75, min(ipy, uSize.y - ipy));

    // soft mask around the cursor
    vec2 hd = (iuv - uHover) * vec2(aspect, 1.0);
    float hv = exp(-dot(hd, hd) * 9.0) * uHoverStrength;

    // ── 1. Lens blocks: a square grid; every cell has a random threshold h and
    //       "ignites" once the scroll intensity passes it. An ignited cell
    //       magnifies its own content around the cell centre, like a tiny lens.
    //       Low-h cells ignite first and settle last, so as the scroll eases off
    //       the lenses relax back to the plain image staggered, not all at once.
    vec2 grid   = uSize / uCell;
    vec2 cellId = floor(iuv * grid);
    vec2 center = (cellId + 0.5) / grid;
    float h = hash(cellId);

    // Cells whose centre lies outside the image are "ghost" cells. They ignite
    // less readily the farther out they are (fall -> 0 after uSpill rows), and
    // never extend past the canvas edge.
    float cyPx  = center.y * uSize.y;
    float outPx = max(max(-cyPx, 0.0), max(cyPx - uSize.y, 0.0));
    float fall  = clamp(1.0 - outPx / (uSpill * uCell), 0.0, 1.0);
    fall *= step(outPx + 0.5 * uCell, uPad);

    float sExc = a * uCover * fall - h;    // how far past its threshold (scroll)
    float hExc = hv * 0.8 * fall - h;      // same, for the cursor
    float sOn  = smoothstep(0.0, 0.22, sExc);
    float lens = max(sOn, 0.6 * smoothstep(0.0, 0.22, hExc));

    float zoom  = mix(1.0, uZoom, lens);
    float ca    = uAberr * lens;
    // ignited blocks are also dragged a little along the scroll axis
    float shift = (0.3 + 0.7 * hash(cellId + 7.0)) * uExtrude * a * dir * sOn;
    vec2  off   = vec2(0.0, shift);
    vec2  d     = iuv - center;

    // Ghost blocks sample the image mirrored across the nearest edge, so what
    // spills out of the frame is real image content, not stretched edge pixels.
    vec2 cm = center;
    cm.y = cm.y < 0.0 ? -cm.y : (cm.y > 1.0 ? 2.0 - cm.y : cm.y);
    cm = clamp(cm, 0.0, 1.0);

    // ── 2. Chromatic aberration. Radial: each channel is magnified by a slightly
    //       different amount, so colour fringes grow toward the block's edge.
    //       Plus a small directional split along the scroll axis.
    vec2 sp = vec2(0.0, uSplit * uV) * (1.0 + lens * 1.5);
    vec4  g = tex(cm + d / zoom + off);
    float r = tex(cm + d / (zoom * (1.0 + ca)) + off + sp).r;
    float b = tex(cm + d / (zoom * (1.0 - ca)) + off - sp).b;
    vec3 col = vec3(r, g.g, b);

    // ── 3. Exposure + directional light: the card brightens with speed, and as
    //       it swivels the near side catches more light than the far side.
    col *= 1.0 + a * uBright;
    col *= 1.0 + uSwing * (iuv.x - 0.5) * 0.25;

    // ── 4. Hover: a soft glow under the cursor (lenses open up there too).
    col *= 1.0 + hv * 0.12;

    // Outside the image only ignited blocks are visible; everything else is fully
    // transparent. The canvas is premultiplied-alpha, so premultiply the colour.
    float ghostA = smoothstep(0.0, 0.35, lens);
    float alpha  = g.a * mix(ghostA, 1.0, inside);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0) * alpha, alpha);
  }
`;

// Ghost layers: coarse-pixel, semi-transparent copies of the image that float
// in front of it on the Z axis (two layers, at different depths). Each coarse cell is either present or
// dissolved, so the ghost reads as scattered floating pixels, not a flat overlay.
const ghostFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2  uSize;
  uniform float uImageAspect;
  uniform float uPad;
  uniform float uSeed;
  uniform float uAmt;       // layer visibility 0..1 (lagged scroll intensity)
  uniform float uCell;      // coarse pixel size in px
  uniform float uDensity;   // fraction of cells that can show at full visibility
  uniform float uAlpha;     // max opacity of a visible cell
  uniform float uLayer;     // decorrelates the cell pattern between layers
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec4 tex(vec2 uv) {
    float aspect = uSize.x / uSize.y;
    vec2 ratio = vec2(
      min(aspect / uImageAspect, 1.0),
      min(uImageAspect / aspect, 1.0)
    );
    uv = (uv - 0.5) * ratio + 0.5;
    return texture2D(uTexture, clamp(uv, 0.0, 1.0));
  }

  void main() {
    vec2 iuv = vec2(vUv.x, (vUv.y * (uSize.y + 2.0 * uPad) - uPad) / uSize.y);
    float ipy = iuv.y * uSize.y;
    float inside = smoothstep(-0.75, 0.75, min(ipy, uSize.y - ipy));

    vec2 grid = uSize / uCell;
    vec2 cid  = floor(iuv * grid);
    vec2 c    = clamp((cid + 0.5) / grid, 0.0, 1.0);   // flat, pixelated colour
    float h   = hash(cid + uLayer * 17.3);

    // cells appear as the layer gains visibility; low-h cells first, last to go
    float vis   = smoothstep(0.0, 0.3, uAmt * uDensity - h);
    float flick = 0.55 + 0.45 * hash(cid + 3.1 + uLayer);

    vec4 t = tex(c);
    gl_FragColor = vec4(t.rgb, t.a * inside * vis * flick * uAlpha);
  }
`;

// Straggler pixels: small (and occasionally large) squares torn from the image
// edge. They launch from the edge the scroll is trailing, travel out toward the
// canvas edge, and retract back into the image as the scroll settles. Only the
// part outside the image is drawn, so the image edge itself stays clean and the
// squares appear to slide out of / sink back into it.
const stragglerFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2  uSize;
  uniform float uImageAspect;
  uniform float uPad;
  uniform float uSeed;
  uniform float uAmtB;          // launch amount at the BOTTOM edge (scrolling down)
  uniform float uAmtT;          // launch amount at the TOP edge (scrolling up)
  uniform float uStragSize;     // base square size in px
  uniform float uStragBig;      // fraction of squares that are large variants
  uniform float uStragDensity;  // fraction of slots that hold a straggler
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453);
  }
  float rnd(vec2 id, float salt) {
    return hash(id + salt * 19.7);
  }

  vec4 tex(vec2 uv) {
    float aspect = uSize.x / uSize.y;
    vec2 ratio = vec2(
      min(aspect / uImageAspect, 1.0),
      min(uImageAspect / aspect, 1.0)
    );
    uv = (uv - 0.5) * ratio + 0.5;
    // This lookup sits inside a branch/loop, where screen-space derivatives are
    // undefined, so a large negative bias pins it to the base mip level.
    return texture2D(uTexture, clamp(uv, 0.0, 1.0), -16.0);
  }

  void main() {
    float W = uSize.x;
    float H = uSize.y;
    float ipy = vUv.y * (H + 2.0 * uPad) - uPad;   // px, y up, 0 = image bottom
    float px  = vUv.x * W;

    bool atBottom = ipy < 0.0;
    bool atTop    = ipy > H;
    if (!(atBottom || atTop)) discard;             // never draw over the image

    float amt = atBottom ? uAmtB : uAmtT;
    if (amt < 0.004) discard;                      // at rest: nothing to do

    float t    = atBottom ? -ipy : ipy - H;        // px outward from the launch edge
    float edge = atBottom ? 0.0 : 1.0;

    const float COL = 30.0;                        // slot width (>= biggest square)
    float col0 = floor(px / COL);

    vec4 best = vec4(0.0);
    for (int ci = -1; ci <= 1; ci++) {
      for (int k = 0; k < 2; k++) {
        vec2 id = vec2(col0 + float(ci), float(k) + edge * 5.0);

        float exists = step(rnd(id, 1.0), uStragDensity);
        if (exists < 0.5) continue;

        // size: mostly small, some large
        float rs  = rnd(id, 2.0);
        float big = step(rnd(id, 3.0), uStragBig);
        float s   = uStragSize * mix(0.7 + 0.9 * rs, 3.0 + 2.5 * rs, big);
        s = max(floor(min(s, COL)), 2.0);

        float xc    = floor((id.x + rnd(id, 4.0)) * COL);
        float depth = s + rnd(id, 5.0) * 24.0;     // where it lives inside the image

        // how far it travels; a few go all the way to the canvas edge
        float reach = 0.3 + 0.7 * rnd(id, 6.0);
        reach = rnd(id, 7.0) > 0.75 ? 1.0 : reach;
        float tMax = max(uPad - 1.0 - 0.5 * s, 0.0) * reach;

        // staggered launch / return: low "lead" values go first and return last
        float lead = rnd(id, 8.0) * 0.6;
        float e = clamp((amt - lead * 0.8) / (1.0 - lead * 0.8), 0.0, 1.0);
        e = e * e * (3.0 - 2.0 * e);

        float tc = floor(mix(-depth, tMax, e) + 0.5);

        float ax = 1.0 - smoothstep(-0.5, 0.5, abs(px - xc) - 0.5 * s);
        float at = 1.0 - smoothstep(-0.5, 0.5, abs(t - tc) - 0.5 * s);
        float a  = ax * at * smoothstep(0.0, 0.75, t) * smoothstep(0.0, 0.1, e);

        if (a > best.a) {
          // colour = the image pixel it was torn from (its home, inside the edge)
          float hy = atBottom ? depth / H : 1.0 - depth / H;
          vec4 c = tex(vec2(clamp(xc / W, 0.0, 1.0), clamp(hy, 0.0, 1.0)));
          best = vec4(c.rgb, a * c.a);
        }
      }
    }

    if (best.a < 0.003) discard;
    gl_FragColor = best;
  }
`;

// ─── Per-card personality ──────────────────────────────────
// Deterministic from the image src: the same image always behaves the same way,
// different images differ. Values are plain uniforms: no per-card runtime cost.
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
 * Mental model: v is the card's smoothed scroll velocity (about -1..1; sign =
 * scroll direction). Every effect below scales with |v|, so a still page is
 * perfectly clean and the effects ease in as you scroll.
 */
function makeVariation(src) {
  const r = mulberry32(hashStr(src));
  const range = (a, b) => a + r() * (b - a);

  // Spring values are drawn first so they match earlier versions of this file.
  const k = range(0.1, 0.18);
  const zeta = range(0.5, 0.8);

  return {
    /**
     * cell (10 – 22 px): size of the square pixel blocks. Small = fine, fussy
     * grain; large = chunky blocks. Rounded to a whole number so block edges
     * land on crisp pixel boundaries.
     */
    cell: Math.round(range(10, 22)),

    /**
     * extrude (0.05 – 0.14): how far active blocks get dragged along the scroll
     * axis at full speed, as a fraction of the image height (0.10 on a 350px
     * card ≈ 35px). Each block gets its own random fraction (30–100%) of this,
     * which gives the streaky, stepped "pixels pulled along" look.
     */
    extrude: range(0.05, 0.14),

    /**
     * split (0.008 – 0.02): RGB channel separation along the scroll axis, as a
     * fraction of image height. At full speed on a 350px card, that's about
     * 3–7px between the red and blue channels, and about 2.5× that inside active
     * blocks. Red shifts one way and blue the other; green stays put.
     */
    split: range(0.008, 0.02),

    /**
     * bright (0.12 – 0.30): exposure boost at full scroll speed (×1.12 to
     * ×1.30 on all channels). It's the "light kicks on" part of the effect.
     */
    bright: range(0.12, 0.3),

    // Reserved: formerly `sheenAngle` (two random draws). Burned on purpose so
    // seed / swivel / cover keep the exact values they had before.
    _reserved: (r(), r()),

    /**
     * seed (0 – 100): offsets the block-pattern hash so two cards never light up
     * the same blocks in the same order.
     */
    seed: range(0, 100),

    /**
     * k (0.10 – 0.18): stiffness of this card's scroll-response spring. Higher =
     * snappier (period ≈ 0.25s at 0.18, ≈ 0.33s at 0.10, at 60fps).
     */
    k,

    /**
     * damp (derived): per-frame velocity retention, 1 − 2·ζ·√k with ζ from
     * 0.5–0.8. ζ = 0.5 overshoots by about 16% (a lively card); ζ = 0.8 by about
     * 1.5% (nearly dead smooth). Lower the zeta range, not damp, to make every
     * card bouncier. The spring drives the effect intensity and the swivel.
     */
    damp: 1 - 2 * zeta * Math.sqrt(k),

    /**
     * swivel (±0.7 – ±1.0): scale and direction of the Y-axis turn. Yaw target
     * = v × MAX_YAW × swivel (MAX_YAW = 0.5 rad), so about 20° – 29° at full
     * speed, and the spring can overshoot that by ~15%. The sign decides which
     * way the card turns for a downward scroll, so neighbours swing in
     * different directions. The near-side/far-side shading follows the same
     * value, so the lit edge flips with it. Change MAX_YAW (top of file) to
     * scale every card at once.
     */
    swivel: (r() < 0.5 ? -1 : 1) * range(0.7, 1.0),

    /**
     * cover (0.45 – 0.65): the fraction of blocks that can ignite at full scroll
     * speed. 0.5 means roughly half the grid lights up at the peak; at lower
     * speeds only the lowest-threshold blocks do. Lower = sparser, calmer
     * lens grid; higher = a denser field of lenses.
     */
    cover: range(0.45, 0.65),

    /**
     * zoom (1.5 – 2.4): magnification of a fully ignited block. 2.0 means each
     * square shows the central half of its own content blown up 2×, like a tiny
     * lens. Higher values make the fly-eye grid more pronounced (and thin
     * typography harder to read inside the blocks); lower values are subtler.
     * It is bounded on purpose: blocks never collapse to a flat pixel.
     */
    zoom: range(1.5, 2.4),

    /**
     * aberration (0.12 – 0.28): radial chromatic aberration of a fully ignited
     * block. The red channel is magnified by (1 + aberration) and the blue by
     * (1 − aberration) relative to the block's zoom, so colour fringes grow
     * toward the block's edge and vanish at its centre, as in a real lens. On a
     * 16px block, 0.2 gives a few pixels of separation at the edge. Both zoom
     * and aberration ease back to 1 and 0 as the block settles.
     */
    aberration: range(0.12, 0.28),

    /**
     * spill (2 – 4): how many rows of blocks can break out past the image's top
     * and bottom edges at full scroll speed (so 2 – 4 blocks × cell size, about
     * 20 – 88px). Blocks ignite less readily the farther they are from the edge,
     * so at moderate speeds only the first row spills. The image edge itself
     * stays perfectly straight; only whole square blocks cross it. Spilled
     * blocks show real image content (mirrored across the edge), magnified and
     * colour-fringed just like the blocks inside. Capped by `bleed` (below).
     */
    spill: range(2, 4),

    /**
     * ghostCell (18 – 34 px): block size of the ghost layers. Deliberately
     * coarser than the lens blocks (`cell`) so the ghosts read as big, chunky
     * floating pixels.
     */
    ghostCell: Math.round(range(18, 34)),

    /**
     * ghostZ (50 – 100 px): how far the FARTHER ghost layer floats toward the
     * camera at full scroll speed; the nearer layer floats half that. Both sit in
     * front of the image. Because the layers share the card's swivel pivot, this
     * distance becomes sideways parallax when the card turns: ±(z × sin(yaw)),
     * e.g. about 48px for the far layer at 100px and 29° (24px for the near one),
     * so the two ghosts fan out like a stepped echo. Perspective also scales the
     * far layer up by roughly 10% at 100px, so it slightly overhangs the image.
     */
    ghostZ: range(50, 100),

    /**
     * ghostAlpha (0.28 – 0.5): opacity of a visible ghost cell. Each cell also
     * gets its own random 55–100% of this so the ghost shimmers unevenly.
     */
    ghostAlpha: range(0.28, 0.5),

    /**
     * ghostDensity (0.5 – 0.85): the fraction of ghost cells that can be visible
     * at full scroll speed. Lower = a sparse scatter of pixels; higher = a
     * near-complete translucent copy.
     */
    ghostDensity: range(0.5, 0.85),

    /**
     * ghostLag (0.025 – 0.05): how quickly the ghosts fade back once the scroll
     * stops, as a per-frame blend at 60fps. The near ghost appears at 0.16 per
     * frame and releases at this rate; the far ghost is lazier (0.12 attack,
     * 70% of this rate on release), so it lingers longest and the two peel away
     * from the image in sequence. About 0.5 – 1s to disappear. Lower = longer
     * linger.
     */
    ghostLag: range(0.025, 0.05),

    /**
     * stragSize (3.5 – 6.5 px): base size of a straggler square. Most squares are
     * 0.7 – 1.6× this (about 2.5 – 10px); the "big" variants below are 3 – 5.5×
     * (about 10 – 36px, capped at 30px).
     */
    stragSize: range(3.5, 6.5),

    /**
     * stragBig (0.12 – 0.25): the fraction of stragglers that are large variants.
     * Mixing a few big squares in among the tiny ones gives the scatter detail
     * and scale contrast.
     */
    stragBig: range(0.12, 0.25),

    /**
     * stragDensity (0.3 – 0.5): the fraction of available slots that hold a
     * straggler. The grid has one slot per 30px of width and two per column on
     * each edge, so on a 600px card that's 40 slots per edge, 12 – 20 stragglers
     * with these values.
     */
    stragDensity: range(0.3, 0.5),

    /**
     * stragLag (0.03 – 0.055): how quickly stragglers retract once the scroll
     * stops (per-frame blend at 60fps). They launch quickly (0.2 per frame) and
     * return slowly, taking roughly 1 – 2s to sink back into the image, each at
     * its own moment (low-lead ones are last). Lower = longer linger.
     */
    stragLag: range(0.03, 0.055),
  };
}

function DeformPlane({ src, resolveSrc, velocityRef, hoverRef, hoveredRef, rectRef, onReady }) {
  const groupRef = useRef(null);   // carries the swivel; all layers rotate together
  const meshRef = useRef(null);    // the main image
  const nearRef = useRef(null);    // nearer ghost layer (floats half the distance)
  const farRef = useRef(null);     // farther ghost layer (floats the full distance)
  const stragRef = useRef(null);   // straggler pixels layer
  const ghostState = useRef({ n: 0, f: 0 });
  const stragState = useRef({ b: 0, t: 0 });
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
      uSize: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: 1 },
      uV: { value: 0 },
      uSwing: { value: 0 },
      uHover: { value: new THREE.Vector2(0.5, 0.5) },
      uHoverStrength: { value: 0 },
      uCell: { value: variation.cell },
      uExtrude: { value: variation.extrude },
      uSplit: { value: variation.split },
      uBright: { value: variation.bright },
      uSeed: { value: variation.seed },
      uZoom: { value: variation.zoom },
      uAberr: { value: variation.aberration },
      uPad: { value: 0 },
      uSpill: { value: variation.spill },
      uCover: { value: variation.cover },
    }),
    [variation]
  );

  // Ghost layers share the texture / size / pad objects with the main material,
  // so updating those once updates all three layers.
  const ghost = useMemo(() => {
    const make = (layer) => ({
      uTexture: uniforms.uTexture,
      uSize: uniforms.uSize,
      uImageAspect: uniforms.uImageAspect,
      uPad: uniforms.uPad,
      uSeed: uniforms.uSeed,
      uAmt: { value: 0 },
      uCell: { value: variation.ghostCell },
      uDensity: { value: variation.ghostDensity },
      uAlpha: { value: variation.ghostAlpha },
      uLayer: { value: layer },
    });
    const strag = {
      uTexture: uniforms.uTexture,
      uSize: uniforms.uSize,
      uImageAspect: uniforms.uImageAspect,
      uPad: uniforms.uPad,
      uSeed: uniforms.uSeed,
      uAmtB: { value: 0 },
      uAmtT: { value: 0 },
      uStragSize: { value: variation.stragSize },
      uStragBig: { value: variation.stragBig },
      uStragDensity: { value: variation.stragDensity },
    };
    return { near: make(1), far: make(2), strag };
  }, [uniforms, variation]);

  useEffect(() => {
    let cancelled = false;
    let tex = null;

    loadImage(resolveSrc())
      .then((img) => {
        if (cancelled) return;
        tex = new THREE.Texture(img);
        tex.anisotropy = 4;
        tex.needsUpdate = true;
        // Upload to the GPU now (card still off-screen), not on its first visible frame.
        gl.initTexture?.(tex);
        uniforms.uTexture.value = tex;
        uniforms.uImageAspect.value = img.naturalWidth / img.naturalHeight;
        if (groupRef.current) groupRef.current.visible = true;
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
    const mesh = meshRef.current;
    const { w, h, by } = rectRef.current;
    if (mesh && w > 0 && h > 0) {
      // The mesh is the image plus `by` px above and below, so blocks can spill.
      mesh.scale.set(w, h + 2 * by, 1);
      nearRef.current?.scale.set(w, h + 2 * by, 1);
      farRef.current?.scale.set(w, h + 2 * by, 1);
      stragRef.current?.scale.set(w, h + 2 * by, 1);
      u.uSize.value.set(w, h);
      u.uPad.value = by;
    }

    // Boost slow scrolls, then a per-card spring for lag + settle wobble.
    const raw = velocityRef.current ?? 0;
    const target = Math.sign(raw) * Math.min(Math.pow(Math.abs(raw) * 1.8, 0.65), 1);
    const s = Math.min(delta * 60, 2);
    const sp = spring.current;
    sp.v += (target - sp.x) * variation.k * s;
    sp.v *= Math.pow(variation.damp, s);
    sp.x = THREE.MathUtils.clamp(sp.x + sp.v * s, -1.15, 1.15);
    u.uV.value = sp.x;

    // Ghost layers (both in front of the image): fast attack, slow release, so
    // they trail the main image like an afterimage. The farther layer is lazier
    // on both ends, so it lingers longest. Each is pushed out along +Z by its
    // visibility: the near one up to half of ghostZ, the far one up to all of it.
    const gs = ghostState.current;
    const aNow = Math.min(Math.abs(sp.x), 1);
    gs.n += (aNow - gs.n) * (aNow > gs.n ? 0.16 * s : variation.ghostLag * s);
    gs.f += (aNow - gs.f) * (aNow > gs.f ? 0.12 * s : variation.ghostLag * 0.7 * s);
    ghost.near.uAmt.value = gs.n;
    ghost.far.uAmt.value = gs.f;
    if (nearRef.current) nearRef.current.position.z = variation.ghostZ * 0.5 * gs.n;
    if (farRef.current) farRef.current.position.z = variation.ghostZ * gs.f;

    // Stragglers. Driven by the shaped velocity *target* (not the spring), so the
    // spring's overshoot can't flip the launch edge mid-retract. Scrolling down
    // feeds the bottom edge, scrolling up the top edge; each edge has its own
    // fast-attack / slow-release amount, so a scroll reversal simply retracts
    // one edge while the other launches.
    const st = stragState.current;
    const pos = Math.max(target, 0);
    const neg = Math.max(-target, 0);
    st.b += (pos - st.b) * (pos > st.b ? 0.2 * s : variation.stragLag * s);
    st.t += (neg - st.t) * (neg > st.t ? 0.2 * s : variation.stragLag * s);
    ghost.strag.uAmtB.value = st.b;
    ghost.strag.uAmtT.value = st.t;

    u.uHoverStrength.value += ((hoveredRef.current ? 1 : 0) - u.uHoverStrength.value) * 0.15;
    u.uHover.value.x += (hoverRef.current.x - u.uHover.value.x) * 0.2;
    u.uHover.value.y += (hoverRef.current.y - u.uHover.value.y) * 0.2;

    // Swivel on a central vertical pivot (lazier low-pass trailing the spring),
    // plus a small turn toward the cursor's side while hovered.
    if (mesh) {
      const hoverYaw = (hoverRef.current.x - 0.5) * 0.25 * u.uHoverStrength.value;
      const yawTarget = sp.x * MAX_YAW * variation.swivel + hoverYaw;
      yaw.current += (yawTarget - yaw.current) * Math.min(0.1 * s, 1);
      if (groupRef.current) groupRef.current.rotation.y = yaw.current;
      u.uSwing.value = THREE.MathUtils.clamp(yaw.current / MAX_YAW, -1.5, 1.5);
    }
  });

  // All layers are transparent and drawn back-to-front by renderOrder (no depth
  // test): the main image, then the near ghost, the far ghost (closest to the
  // camera), and finally the straggler pixels, so they blend correctly.
  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={meshRef} renderOrder={0} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          premultipliedAlpha
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={nearRef} renderOrder={1} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={ghostFragmentShader}
          uniforms={ghost.near}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={farRef} renderOrder={2} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={ghostFragmentShader}
          uniforms={ghost.far}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={stragRef} renderOrder={3} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={stragglerFragmentShader}
          uniforms={ghost.strag}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
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
  // Px the canvas (and mesh) extend above and below the image. This is the room
  // for (1) blocks that spill past the top/bottom edges and (2) the swivel's
  // perspective growth. Blocks never spill farther than this. Raise it for a
  // longer spill; if card edges clip mid-swivel on wide cards, raise it too.
  bleed = 110,
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const velocityRef = useScrollVelocity(); // must be read here, not inside <Canvas>

  const hoverRef = useRef({ x: 0.5, y: 0.5 });
  const hoveredRef = useRef(false);
  const rectRef = useRef({ x: 0, y: 0, w: 0, h: 0, by: 0 });

  const [layout, setLayout] = useState({ x: 0, y: 0, w: 0, h: 0, bx: 0, by: 0 });
  const [mounted, setMounted] = useState(false); // canvas exists (near the viewport)
  const [visible, setVisible] = useState(false); // on screen => render loop runs
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
        by: bleed,
      };
      rectRef.current = next;
      setLayout((p) =>
        p.x === next.x && p.y === next.y && p.w === next.w && p.h === next.h && p.bx === next.bx && p.by === next.by ? p : next
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

  // A wide observer decides when the canvas should EXIST (early, with
  // hysteresis); a tight one decides when it should actually RENDER.
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
        // Pre-decode the loaded image into the shared cache so the texture is
        // available instantly when the canvas mounts.
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