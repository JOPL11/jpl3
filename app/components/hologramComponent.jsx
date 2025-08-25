     /**
      * HOLOGRAM -----------------------------------------------------------------------------UNICORN
      */

      const random2D = `
      float random2D(vec2 value)
      {
          return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      `;
      const holographicVertexShader = `
      uniform float uTime;
      uniform float uHover;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      float random2D(vec2 value) {
        return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      void main() {
        // Position
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Glitch
        float glitchTime = uTime - modelPosition.y;
        float glitchStrength = sin(glitchTime) + sin(glitchTime * 5.45) + sin(glitchTime * 0.76);
        glitchStrength /= 1.5;
        glitchStrength = smoothstep(0.4, 1.0, glitchStrength);
        glitchStrength *= 0.025 + 0.1 * uHover; // Base glitch effect + intensified by hover
        modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
        modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;
        
        // Final position
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
        
        // Model normal
        vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
        
        // Varyings
        vPosition = modelPosition.xyz;
        vNormal = modelNormal.xyz;
      }
    `;
              // ${effects}
              const holographicFragmentShader = `
              uniform float uTime;
              uniform vec3 uColor;
              
              varying vec3 vPosition;
              varying vec3 vNormal;
              
              void main()
              {
                  // Normal
                  vec3 normal = normalize(vNormal);
                  if (!gl_FrontFacing) {
                      normal *= -1.0;
                  }
              
                  // Stripes
                  float stripes = mod((vPosition.y - uTime * 0.04) * 60.0, 2.0);
                  stripes = pow(stripes, 1.2);
              
                  // Fresnel
                  vec3 viewDirection = normalize(vPosition - cameraPosition);
                  float fresnel = dot(viewDirection, normal) + 1.1;
                  fresnel = pow(fresnel, 0.9);
              
                  // Falloff
                  float falloff = smoothstep(0.1, 0.1, fresnel);
              
                  // Holographic
                  float holographic = stripes * fresnel;
                  holographic += fresnel * 2.15;
                  holographic *= falloff;
              
                  // Adjust brightness
                  float brightness = 0.30; // Adjust this value to reduce brightness
              
                  // Final color
                  vec3 finalColor = uColor * brightness * holographic;
              
                  gl_FragColor = vec4(finalColor, 0.2);
              
                  // Commented out tonemapping and colorspace fragments to simplify
                  // #include <tonemapping_fragment>
                  // #include <colorspace_fragment>
              }
            `;

      const materialParameters = {}
      //materialParameters.color = '#0f81bd'
      const hologram = new THREE.ShaderMaterial({
            vertexShader: holographicVertexShader,
            fragmentShader: holographicFragmentShader,
            uniforms:
            {
                uTime: new THREE.Uniform(0),
                uColor: new THREE.Uniform(new THREE.Color(0.2, 1.4, 4.0)),
                uEmissiveColor: new THREE.Uniform(new THREE.Color(0x0f81bd)), // Red emissive color
                uEmissiveStrength: { value: 33.0 }, // Emissive strength
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
           // specular: 0x000000, // Disable specular reflection
            blending: THREE.AdditiveBlending
      })



      const unicorn = useLoader(OBJLoader, './unicorn.obj');
      const unicornRef = useRef();
      unicorn.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === "unicorn") {
          child.material = hologram; 
        }
      });


        // Update the shader uniform each frame  

      useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        hologram.uniforms.uTime.value = elapsedTime;
        
      });

     return(
      <primitive 
      object={unicorn} 
      ref={unicornRef}
      scale={[0.0040, 0.0040, 0.0030]}
      position={[0.03, 2.1, 0.31]} 
      rotation={[0, 0.15, 0]} 
  /> 
);

