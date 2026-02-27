import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../audio/shaders';

/**
 * Immersive Scene reacting to Audio
 */
const Visualizer = ({ audioEngine }) => {
  const meshRef = useRef();
  
  // Custom Shader Material
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBass: { value: 0 },
    uMid: { value: 0 },
    uHigh: { value: 0 }
  }), []);

  useFrame((state) => {
    if (!audioEngine) return;
    
    const { bass, mid, high } = audioEngine.getEnergy();
    
    // Update uniforms for the shader
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    meshRef.current.material.uniforms.uBass.value = bass;
    meshRef.current.material.uniforms.uMid.value = mid;
    meshRef.current.material.uniforms.uHigh.value = high;

    // Movement
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
    
    // Pulse mesh scale with bass
    const scale = 1 + bass * 0.5;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
      />
    </mesh>
  );
};

export default Visualizer;
