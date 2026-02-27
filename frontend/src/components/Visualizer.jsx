import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../audio/shaders';

/**
 * Enhanced Immersive Visualizer
 * Distorts reference images in real-time based on audio energy.
 */
const Visualizer = ({ audioEngine, textureUrl = '/textures/texture1.png' }) => {
  const meshRef = useRef();
  
  // Load the reference image texture
  const texture = useLoader(THREE.TextureLoader, textureUrl);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  // Custom Shader Material
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uBass: { value: 0 },
    uMid: { value: 0 },
    uHigh: { value: 0 }
  }), [texture]);

  // Update texture if it changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  useFrame((state) => {
    if (!audioEngine || !meshRef.current) return;
    
    const { bass, mid, high } = audioEngine.getEnergy();
    
    // Update uniforms for the shader
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    meshRef.current.material.uniforms.uBass.value = bass;
    meshRef.current.material.uniforms.uMid.value = mid;
    meshRef.current.material.uniforms.uHigh.value = high;

    // Movement: Slow rotate + audio-synced jitter
    meshRef.current.rotation.x += 0.002 + high * 0.01;
    meshRef.current.rotation.y += 0.002 + mid * 0.01;
    
    // Pulse mesh scale with bass
    const scale = 1.2 + bass * 0.8;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  return (
    <mesh ref={meshRef}>
      {/* Complex geometry for more interesting distortion surface */}
      <icosahedronGeometry args={[2, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default Visualizer;
