"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/**
 * Nested horizontal strip. Consumes wheel events while it can still scroll
 * and releases them at its edges, so the page's scroll driver takes over.
 *
 * @param {string}   label      Accessible name for the region
 * @param {React.ReactNode} children Cards — each should be a direct child element
 * @param {boolean}  [snap]     Snap to nearest card after drag ends
 * @param {(p: number) => void} [onProgress] Strip scroll progress, 0..1
 */
export function HorizontalScroller({ label, children, snap = false, onProgress }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return; // guards what TS gave us for free

    const maxScroll = () => root.scrollWidth - root.clientWidth;

    let wheelTarget = null;
    let inView = true;
    let armedClick = null;

    // --- smoothed wheel via gsap ticker (rides your existing loop/tempus sync) ---
    const tick = (_time, dtMs) => {
      if (wheelTarget === null || !inView) return;
      const cur = root.scrollLeft;
      const f = 1 - Math.pow(0.86, Math.min(dtMs, 100) / (1000 / 60));
      const next = cur + (wheelTarget - cur) * f;
      root.scrollLeft = Math.abs(wheelTarget - next) < 0.3 ? wheelTarget : next;
      if (root.scrollLeft === wheelTarget) wheelTarget = null;
    };
    gsap.ticker.add(tick);

    // --- wheel: consume while scrollable, release at edges → page driver takes over ---
    const onWheel = (e) => {
      const max = maxScroll();
      if (max <= 0) return; // strip fits → page handles everything
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? root.clientHeight : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy; // trackpads emit both axes
      if (!delta) return;
      const cur = wheelTarget ?? root.scrollLeft;
      const dir = Math.sign(delta);
      const canConsume = dir < 0 ? cur > 0.5 : cur < max - 0.5;
      if (!canConsume) return;             // RELEASE: bubbles → native scroll → page moves
      e.preventDefault();
      e.stopPropagation();                 // keep smooth-scrollbar/locomotive out of it
      gsap.killTweensOf(root, "scrollLeft");
      wheelTarget = clamp(cur + delta, 0, max);
    };
    root.addEventListener("wheel", onWheel, { passive: false });

    // --- mouse/pen drag with momentum. Touch uses native overflow scroll. ---
    let dragging = false;
    let moved = false;
    let startX = 0, startScroll = 0, lastX = 0, lastT = 0, vx = 0;

    const disarm = () => {
      if (armedClick) {
        root.removeEventListener("click", armedClick, { capture: true });
        armedClick = null;
      }
    };

    const onPointerDown = (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      disarm();
      gsap.killTweensOf(root, "scrollLeft");
      wheelTarget = null;
      dragging = true;
      moved = false;
      startX = lastX = e.clientX;
      startScroll = root.scrollLeft;
      lastT = performance.now();
      vx = 0;
      root.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const now = performance.now();
      if (Math.abs(e.clientX - startX) > 4) moved = true;
      root.scrollLeft = startScroll - (e.clientX - startX);
      const dt = Math.max(now - lastT, 1);
      vx = 0.8 * vx + 0.2 * ((lastX - e.clientX) / dt); // px/ms, smoothed
      lastX = e.clientX;
      lastT = now;
    };

    const snapToNearest = () => {
      const kids = Array.from(track.children);
      const center = root.scrollLeft + root.clientWidth / 2;
      let best = kids[0];
      let bestD = Infinity;
      for (const k of kids) {
        const d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - center);
        if (d < bestD) { bestD = d; best = k; }
      }
      gsap.to(root, {
        scrollLeft: clamp(best.offsetLeft - (root.clientWidth - best.offsetWidth) / 2, 0, maxScroll()),
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(vx) > 0.1) {
        gsap.to(root, {
          scrollLeft: clamp(root.scrollLeft - vx * 260, 0, maxScroll()),
          duration: Math.min(1.2, 0.4 + Math.abs(vx) * 0.8),
          ease: "power3.out",
          onComplete: () => snap && snapToNearest(),
        });
      } else if (snap) {
        snapToNearest();
      }
      if (moved) {
        // suppress the click that fires after a drag
        armedClick = (ev) => { ev.preventDefault(); ev.stopPropagation(); disarm(); };
        root.addEventListener("click", armedClick, { capture: true, once: true });
      }
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);

    // --- keyboard ---
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const max = maxScroll();
      const step = root.clientWidth * 0.9;
      const map = { ArrowRight: 120, ArrowLeft: -120, PageDown: step, PageUp: -step };
      let to = null;
      if (e.key in map) to = root.scrollLeft + map[e.key];
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = max;
      if (to === null) return;
      e.preventDefault();
      wheelTarget = null;
      gsap.to(root, { scrollLeft: clamp(to, 0, max), duration: 0.45, ease: "power2.out" });
    };
    root.addEventListener("keydown", onKeyDown);

    const report = () => {
      const m = maxScroll();
      if (m > 0 && onProgress) onProgress(clamp(root.scrollLeft / m, 0, 1));
    };
    root.addEventListener("scroll", report, { passive: true });

    const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting; });
    io.observe(root);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      disarm();
      gsap.killTweensOf(root);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", endDrag);
      root.removeEventListener("pointercancel", endDrag);
      root.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("scroll", report);
    };
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="hs-viewport" role="region" aria-label={label} tabIndex={0}>
      <div ref={trackRef} className="hs-track">{children}</div>
    </div>
  );
}