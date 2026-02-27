/**
 * PAPAGEDON Premium Audio-Reactive Shaders (GLSL)
 * Features: Texture Distortion, Noise Rhythms, Energy Displacement
 */
export const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  
  uniform float uTime;
  uniform float uBass;
  uniform float uMid;
  uniform float uHigh;

  // Simple noise function
  float noise(vec3 p) {
    return sin(p.x * 10.0 + uTime) * cos(p.y * 10.0 + uTime) * sin(p.z * 10.0 + uTime);
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Wave displacement based on Mids & Highs
    float ripple = noise(position + uTime * 0.5) * uMid * 2.0;
    
    // Bass explosive displacement
    float displacement = uBass * 1.5 * sin(length(position) * 5.0 - uTime * 2.0);
    
    modelPosition.xyz += normal * (ripple + displacement);
    
    vElevation = ripple + displacement;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uBass;
  uniform float uMid;
  uniform float uHigh;

  void main() {
    // Distort UVs based on audio energy
    vec2 distortedUv = vUv;
    distortedUv.x += sin(vUv.y * 10.0 + uTime) * uMid * 0.1;
    distortedUv.y += cos(vUv.x * 10.0 + uTime) * uHigh * 0.1;
    
    // Sample the reference image
    vec4 texColor = texture2D(uTexture, distortedUv);
    
    // Create a metallic/glossy effect based on normals and audio
    float brightness = dot(vNormal, vec3(0.0, 1.0, 1.0)) * 0.5 + 0.5;
    
    // Dynamic color shift
    vec3 glow = vec3(0.0, 1.0, 0.6) * uBass * 0.5;
    
    vec3 finalColor = texColor.rgb * brightness;
    finalColor += glow;
    
    // Add audio-reactive pulse on the texture
    finalColor *= (1.0 + uBass * 0.3);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
