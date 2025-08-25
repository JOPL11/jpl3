import * as THREE from 'three';
import { RawShaderMaterial, Vector2 } from 'three';

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uPixelSize;
  uniform float uIntensity;
  
  varying vec2 vUv;
  
  float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  void main() {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = vUv;
    
    // Calculate distance from mouse position
    float dist = distance(uv, uMouse);
    
    // Calculate pixelation amount based on distance from mouse
    float pixelSize = mix(1.0, uPixelSize, uIntensity * smoothstep(0.0, 0.5, dist));
    
    // Calculate the pixel grid size
    vec2 pixelGrid = uResolution.xy / pixelSize;
    
    // Pixelate UV coordinates
    vec2 pixelatedUv = floor(uv * pixelGrid) / pixelGrid;
    
    // Sample the texture with pixelated UVs
    vec4 color = texture2D(tDiffuse, pixelatedUv);
    
    gl_FragColor = color;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const PixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new Vector2(1, 1) },
    uMouse: { value: new Vector2(0.5, 0.5) },
    uPixelSize: { value: 10.0 },
    uIntensity: { value: 0.5 }
  },
  vertexShader,
  fragmentShader,
  name: 'PixelationShader'
};

export const PixelationMaterial = new RawShaderMaterial({
  uniforms: PixelationShader.uniforms,
  vertexShader,
  fragmentShader,
  name: 'PixelationMaterial'
});

export default PixelationShader;
