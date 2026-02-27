import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * VideoVisualizer
 * Renders an MP4 video as a reactive 3D texture.
 */
const VideoVisualizer = ({ audioEngine, videoUrl }) => {
  const meshRef = useRef();
  const [video] = useState(() => {
    const v = document.createElement('video');
    v.src = videoUrl;
    v.crossOrigin = 'anonymous';
    v.loop = true;
    v.muted = true;
    v.play();
    return v;
  });

  const [texture] = useState(() => new THREE.VideoTexture(video));

  useEffect(() => {
    video.src = videoUrl;
    video.play();
  }, [videoUrl, video]);

  useFrame((state) => {
    if (!audioEngine || !meshRef.current) return;
    
    const { bass, mid, high, beat } = audioEngine.getEnergy();
    
    // Scale mesh based on bass + beat impact
    const scale = 1 + bass * 0.5 + (beat ? 0.3 : 0);
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

    // Rotation based on mids/highs
    meshRef.current.rotation.y += 0.01 + mid * 0.02;
    meshRef.current.rotation.x += 0.005 + high * 0.02;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial 
        map={texture} 
        emissive={new THREE.Color('#00ffa3')}
        emissiveIntensity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default VideoVisualizer;
