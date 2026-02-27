/**
 * PAPAGEDON Audio-Reactive Shader (GLSL)
 */
export const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uBass;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Distort vertices based on Bass Energy
    float elevation = sin(modelPosition.x * 2.0 + uTime) * uBass * 0.5;
    modelPosition.y += elevation;
    
    vElevation = elevation;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform float uMid;
  uniform float uHigh;

  void main() {
    // Dynamic color based on Mid and High energy
    vec3 colorA = vec3(0.1, 0.0, 0.4); // Dark Purple
    vec3 colorB = vec3(0.0, 1.0, 0.8); // Neon Cyan
    
    vec3 mixedColor = mix(colorA, colorB, vElevation + 0.5);
    mixedColor += uHigh * 0.5; // Flash on highs

    gl_FragColor = vec4(mixedColor, 1.0);
  }
`;
