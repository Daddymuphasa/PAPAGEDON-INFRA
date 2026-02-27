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
  uniform float uBeat;

  float noise(vec3 p) {
    return sin(p.x * 10.0 + uTime) * cos(p.y * 10.0 + uTime) * sin(p.z * 10.0 + uTime);
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float ripple = noise(position * (1.0 + uBeat * 0.5) + uTime * 0.5) * uMid * 2.5;
    float displacement = uBass * 2.0 * sin(length(position) * 8.0 - uTime * 3.0);
    
    modelPosition.xyz += normal * (ripple + displacement + uBeat * 0.5);
    
    vElevation = ripple + displacement + uBeat;

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
  uniform float uBeat;

  void main() {
    vec2 distortedUv = vUv;
    distortedUv.x += sin(vUv.y * 15.0 + uTime) * uMid * 0.15;
    distortedUv.y += cos(vUv.x * 15.0 + uTime) * uHigh * 0.15;
    
    vec4 texColor = texture2D(uTexture, distortedUv);
    
    float brightness = dot(vNormal, vec3(0.0, 1.0, 1.0)) * 0.5 + 0.5;
    
    // Amapiano Neon Palette: Cyan to Magenta
    vec3 color1 = vec3(0.0, 1.0, 0.64); // Neon Green/Cyan
    vec3 color2 = vec3(1.0, 0.0, 0.9);  // Neon Magenta
    vec3 glow = mix(color1, color2, uMid) * (uBass + uBeat * 2.0);
    
    vec3 finalColor = texColor.rgb * brightness;
    finalColor += glow * 0.5;
    
    // White flash on beat
    finalColor += vec3(1.0) * uBeat * 0.4;
    
    finalColor *= (1.0 + uBass * 0.5);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
