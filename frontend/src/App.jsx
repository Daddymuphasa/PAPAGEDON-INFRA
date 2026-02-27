import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Bloom, EffectComposer } from '@react-three/drei';
import { AudioEngine } from './audio/core';
import Visualizer from './components/Visualizer';

import VideoVisualizer from './components/VideoVisualizer';

const TEXTURES = [
  { id: 1, name: 'NEON WAVE', url: '/textures/texture1.png', type: 'image' },
  { id: 2, name: 'CYBER ORGANIC', url: '/textures/texture2.png', type: 'image' },
  { id: 3, name: 'LIQUID GOLD', url: '/textures/texture3.png', type: 'image' },
  { id: 4, name: 'URBAN VIBE', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'video' },
  { id: 5, name: 'ABSTRACT FLOW', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video' }
];

function App() {
  const [engine, setEngine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metrics, setMetrics] = useState({ bass: 0, mid: 0, high: 0, beat: false });
  const [activeAsset, setActiveAsset] = useState(TEXTURES[0]);
  const [isAutoSwitch, setIsAutoSwitch] = useState(true);
  const [lastBeatCount, setLastBeatCount] = useState(0);
  const audioRef = useRef();

  const handleStart = async () => {
    const pEngine = new AudioEngine();
    await pEngine.init();
    pEngine.connect(audioRef.current);
    setEngine(pEngine);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleLiveFeed = async () => {
    const pEngine = new AudioEngine();
    await pEngine.initStream();
    setEngine(pEngine);
    setIsPlaying(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      setIsPlaying(false);
      setTimeout(handleStart, 100);
    }
  };

  useEffect(() => {
    if (!engine || !isPlaying) return;
    const interval = setInterval(() => {
      const energy = engine.getEnergy();
      setMetrics(energy);
      
      // Auto-switch asset on beat
      if (isAutoSwitch && energy.beat) {
        setLastBeatCount(prev => prev + 1);
        setActiveAsset(prev => {
          const currentIndex = TEXTURES.findIndex(t => t.id === prev.id);
          const nextIndex = (currentIndex + 1) % TEXTURES.length;
          return TEXTURES[nextIndex];
        });
      }
    }, 30);
    return () => clearInterval(interval);
  }, [engine, isPlaying, isAutoSwitch]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', color: 'white', overflow: 'hidden' }}>
      
      {/* Premium VJ Dashboard Overlay */}
      <div className="experience-ui">
        <header className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, letterSpacing: '6px', color: '#00ffa3' }}>PAPAGEDON</h1>
            <p style={{ margin: '2px 0 0 0', opacity: 0.5, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Advanced Audio-Visual Infrastructure
            </p>
          </div>
          
          {isPlaying && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={() => setIsAutoSwitch(!isAutoSwitch)}
                style={{ 
                  background: isAutoSwitch ? 'rgba(0, 255, 163, 0.2)' : 'transparent',
                  border: '1px solid #00ffa3', 
                  padding: '5px 15px', 
                  borderRadius: '10px',
                  fontSize: '0.6rem', 
                  color: '#00ffa3',
                  cursor: 'pointer',
                  fontWeight: 900
                }}
              >
                {isAutoSwitch ? 'AUTO-SYNC: ON' : 'AUTO-SYNC: OFF'}
              </button>
              <div className="stats-panel" style={{ margin: 0 }}>
                {TEXTURES.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setActiveAsset(t)}
                    className={`stat-item ${activeAsset.id === t.id ? 'active' : ''}`}
                    style={{ 
                      background: activeAsset.id === t.id ? 'rgba(0, 255, 163, 0.2)' : 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '5px 15px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      color: activeAsset.id === t.id ? '#00ffa3' : 'white',
                      fontSize: '0.6rem',
                      fontWeight: 700
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          {!isPlaying ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
              <h2 style={{ letterSpacing: '2px', marginBottom: '30px' }}>SYSTEM READY</h2>
              <button className="neon-button" onClick={handleLiveFeed} style={{ marginBottom: '15px', width: '100%' }}>
                START LIVE STREAM
              </button>
              <br />
              <label className="neon-button" style={{ background: 'transparent', border: '1px solid #00ffa3', color: '#00ffa3', display: 'inline-block', width: '100%', boxSizing: 'border-box' }}>
                UPLOAD AMAPIANO
                <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div className="glass-card" style={{ width: '100%', maxWidth: '300px' }}>
              <div className="analyzing-pulse" style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '15px', textAlign: 'center' }}>
                LIVE SPECTRUM ANALYSIS
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['bass', 'mid', 'high'].map(band => (
                  <div key={band} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '5px', opacity: 0.7 }}>
                      <span>{band}</span>
                      <span>{(metrics[band] * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${metrics[band] * 100}%`, 
                        background: band === 'bass' ? '#00ffa3' : band === 'mid' ? '#00e5ff' : '#ff00e5',
                        transition: 'width 0.1s ease-out',
                        boxShadow: `0 0 10px ${band === 'bass' ? '#00ffa3' : band === 'mid' ? '#00e5ff' : '#ff00e5'}`
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {metrics.beat && (
                <div style={{ 
                  marginTop: '15px', 
                  textAlign: 'center', 
                  color: '#00ffa3', 
                  fontSize: '0.6rem', 
                  fontWeight: 900,
                  letterSpacing: '2px'
                }}>
                  BEAT DETECTED
                </div>
              )}
            </div>
          )}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="glass-card" style={{ padding: '10px 20px', fontSize: '0.6rem', opacity: 0.5, letterSpacing: '1px' }}>
            ENGINE: GLSL_V2 | BEATS: {lastBeatCount} | ASSET: {activeAsset.name}
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px' }}>
             AVALANCHE C-CHAIN <br /> INFRA_CORE_RUNNING
          </div>
        </footer>
      </div>

      {/* 3D Visual Rendering Layer */}
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={['#000']} />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade speed={2} />
          
          <Float speed={3} rotationIntensity={1} floatIntensity={1}>
            {engine && (
              activeAsset.type === 'video' ? (
                <VideoVisualizer audioEngine={engine} videoUrl={activeAsset.url} />
              ) : (
                <Visualizer audioEngine={engine} textureUrl={activeAsset.url} />
              )
            )}
          </Float>

          {/* Post-processing Bloom for extra glow */}
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
          </EffectComposer>
        </Suspense>

        <OrbitControls enableZoom={false} makeDefault />
      </Canvas>

      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
        crossOrigin="anonymous" 
      />
    </div>
  );
}

export default App;
