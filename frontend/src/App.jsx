import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { AudioEngine } from '../../audio-engine/src/core';
import Visualizer from './components/Visualizer';

function App() {
  const [engine, setEngine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  const handleStart = async () => {
    const pEngine = new AudioEngine();
    await pEngine.init();
    pEngine.connect(audioRef.current);
    setEngine(pEngine);
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', color: 'white', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px' }}>PAPAGEDON MVP</h1>
        <p style={{ opacity: 0.6 }}>Immersive Audio Infrastructure | Avalanche C-Chain</p>
      </div>

      {/* Controls */}
      <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        {!isPlaying ? (
          <button 
            onClick={handleStart}
            style={{ padding: '15px 40px', background: '#00ffa3', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', color: 'black' }}
          >
            ENTER IMMERSIVE EXPERIENCE
          </button>
        ) : (
          <p>Analyzing Real-Time Stream...</p>
        )}
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {engine && <Visualizer audioEngine={engine} />}
        
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Hidden Audio Element (Can be replaced with Live Stream) */}
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        crossOrigin="anonymous" 
      />
    </div>
  );
}

export default App;
