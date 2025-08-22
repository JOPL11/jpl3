import * as THREE from 'three';

// Vertex Shader
const softParticleVertexShader = `
  varying vec2 vUv;
  varying vec4 fragPosition;
  varying vec3 vColor; // Pass color to fragment shader

  attribute float size;
  attribute vec3 color;

  void main() {
      vUv = uv;  // Pass UV to fragment shader
      fragPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * 2.0 / -fragPosition.z; // Scale with perspective
      gl_Position = projectionMatrix * fragPosition;
      vColor = color; // Pass color to fragment shader
  }
`;

// Fragment Shader
const softParticleFragmentShader = `
  uniform sampler2D depthTexture;
  uniform vec2 screenSize;
  varying vec4 fragPosition;
  varying vec2 vUv;
  varying vec3 vColor; // Get color from vertex shader

  void main() {
      vec2 coord = gl_PointCoord - vec2(0.5); // Center of particle
      float dist = length(coord);
      float alpha = smoothstep(0.5, 0.4, dist); // Smooth edge with 0.1 width

      if (dist > 0.5) discard; // Discard outside circle
      
      gl_FragColor = vec4(vColor.rgb, alpha); // Solid color with smooth edge
  }
`;

export const SoftParticlesMaterial = new THREE.ShaderMaterial({
  vertexShader: softParticleVertexShader,
  fragmentShader: softParticleFragmentShader,
  uniforms: {
    depthTexture: { value: null }, // The depth texture of the scene
    screenSize: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  transparent: true,  // Make particles transparent
  blending: THREE.AdditiveBlending,  // Use additive blending for better light interaction
});
