// components/EnergyFlowLine.jsx
'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function EnergyFlowLine({
  startSelector,
  endSelector,
  color = 'rgba(120, 180, 255, 0.15)', // Soft blue energy color
  pulseColor = 'rgba(180, 220, 255, 0.4)', // Brighter pulse
  width = 0.5,
  speed = 2, // seconds for full pulse travel
  pulseSize = 20, // length of pulse in pixels
  onPulseComplete // Callback when pulse reaches end
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pulsePosRef = useRef(0);
  const startTimeRef = useRef(null);
  const pathRef = useRef(null);
  const lengthRef = useRef(0);

  // Calculate bezier path between elements
  const calculatePath = useCallback(() => {
    const startEl = document.querySelector(startSelector);
    const endEl = document.querySelector(endSelector);
    
    if (!startEl || !endEl) return null;
    
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.bottom; // Start from bottom of element
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top; // End at top of footer element
    
    // Create interesting bezier curve
    const cp1x = startX;
    const cp1y = startY + 80;
    const cp2x = endX;
    const cp2y = endY - 80;
    
    return {
      start: { x: startX, y: startY },
      cp1: { x: cp1x, y: cp1y },
      cp2: { x: cp2x, y: cp2y },
      end: { x: endX, y: endY }
    };
  }, [startSelector, endSelector]);

  // Get point along bezier curve at percentage t
  const getBezierPoint = useCallback((t, p0, p1, p2, p3) => {
    const u = 1 - t;
    return {
      x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
      y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
    };
  }, []);

  // Draw the line with pulse
  const draw = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas || !pathRef.current) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { start, cp1, cp2, end } = pathRef.current;
    
    // Draw main faint line
    ctx.beginPath();
    ctx.moveTo(start.x * dpr, start.y * dpr);
    ctx.bezierCurveTo(
      cp1.x * dpr, cp1.y * dpr,
      cp2.x * dpr, cp2.y * dpr,
      end.x * dpr, end.y * dpr
    );
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width * dpr;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Calculate pulse position
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const progress = (elapsed % speed) / speed;
    pulsePosRef.current = progress;
    
    // Draw pulse
    const pulseStart = Math.max(0, progress - pulseSize/lengthRef.current);
    const pulseEnd = Math.min(1, progress + pulseSize/lengthRef.current);
    
    // Create gradient for pulse
    const pulsePoint = getBezierPoint(progress, start, cp1, cp2, end);
    const gradient = ctx.createLinearGradient(
      getBezierPoint(pulseStart, start, cp1, cp2, end).x * dpr,
      getBezierPoint(pulseStart, start, cp1, cp2, end).y * dpr,
      getBezierPoint(pulseEnd, start, cp1, cp2, end).x * dpr,
      getBezierPoint(pulseEnd, start, cp1, cp2, end).y * dpr
    );
    
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.3, pulseColor);
    gradient.addColorStop(0.7, pulseColor);
    gradient.addColorStop(1, 'transparent');
    
    // Draw pulse segment
    ctx.beginPath();
    ctx.moveTo(
      getBezierPoint(pulseStart, start, cp1, cp2, end).x * dpr,
      getBezierPoint(pulseStart, start, cp1, cp2, end).y * dpr
    );
    
    // Draw small segments for smoother curve
    const segments = 20;
    for (let i = 1; i <= segments; i++) {
      const t = pulseStart + (pulseEnd - pulseStart) * (i / segments);
      const point = getBezierPoint(t, start, cp1, cp2, end);
      ctx.lineTo(point.x * dpr, point.y * dpr);
    }
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = (width * 2) * dpr; // Pulse is slightly thicker
    ctx.stroke();
    
    // Pulse reached the end (footer)
    if (progress > 0.95 && onPulseComplete) {
      onPulseComplete();
    }
    
    animationRef.current = requestAnimationFrame(draw);
  }, [color, pulseColor, width, speed, pulseSize, onPulseComplete, getBezierPoint]);

  // Setup and teardown
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Recalculate path on resize
      pathRef.current = calculatePath();
      
      // Calculate approximate path length
      if (pathRef.current) {
        const { start, cp1, cp2, end } = pathRef.current;
        let length = 0;
        let prev = start;
        for (let i = 1; i <= 100; i++) {
          const t = i / 100;
          const point = getBezierPoint(t, start, cp1, cp2, end);
          length += Math.sqrt(
            Math.pow(point.x - prev.x, 2) + 
            Math.pow(point.y - prev.y, 2)
          );
          prev = point;
        }
        lengthRef.current = length;
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Start animation
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [calculatePath, draw, getBezierPoint]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}