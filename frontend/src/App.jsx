import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text as ThreeText } from '@react-three/drei';
import { AudioEngine } from './audio/core';
import Visualizer from './components/Visualizer';

function App() {
  const [engine, setEngine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [metrics, setMetrics] = useState({ bass: 0, mid: 0, high: 0 });
  const [account, setAccount] = useState(null);
  const [hasNft, setHasNft] = useState(false);
  const audioRef = useRef();

  // --- Web3 Logic ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        // For MVP: We'll simulate the "Success" check after connection
        // In Step 2, we will point this to the deployed PapagedonNFT contract
        checkNftOwnership(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Please install a Web3 wallet like Core or Metamask!");
    }
  };

  const checkNftOwnership = async (userAddress) => {
    // This is where we call the PapagedonNFT contract on Avalanche
    // For now, we will auto-authorize after connecting for the MVP demo flow
    console.log(`Checking access for ${userAddress} on Avalanche C-Chain...`);
    setHasNft(true); 
  };
  // ------------------

  const handleStart = async () => {
    const pEngine = new AudioEngine();
    await pEngine.init();
    pEngine.connect(audioRef.current);
    setEngine(pEngine);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      handleStart();
    }
  };

  // Loop to update metrics in the UI
  useEffect(() => {
    if (!engine || !isPlaying) return;
    const interval = setInterval(() => {
      setMetrics(engine.getEnergy());
    }, 50);
    return () => clearInterval(interval);
  }, [engine, isPlaying]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', color: 'white', overflow: 'hidden' }}>
      
      {/* Immersive UI Overlay */}
      <div className="experience-ui">
        <header className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, letterSpacing: '4px', color: '#00ffa3' }}>PAPAGEDON</h1>
              <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Infrastructure v1.0 // Avalanche EVM
              </p>
            </div>
            {account && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>CONNECTED WALLET</span><br />
                <span style={{ color: '#00ffa3', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {!account ? (
            <div style={{ textAlign: 'center' }}>
              <button className="neon-button" onClick={connectWallet}>
                CONNECT AVALANCHE WALLET
              </button>
              <p style={{ marginTop: '15px', opacity: 0.5, fontSize: '0.9rem' }}>Authentication required to unlock infrastructure</p>
            </div>
          ) : !isPlaying ? (
            <div style={{ textAlign: 'center' }}>
              {hasNft ? (
                <>
                  <button className="neon-button" onClick={handleStart} style={{ marginBottom: '10px' }}>
                    START IMMERSIVE STREAM
                  </button>
                  <br />
                  <label className="neon-button" style={{ background: 'transparent', border: '1px solid #00ffa3', color: '#00ffa3', display: 'inline-block' }}>
                    LOAD AMAPIANO FILE
                    <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                  </label>
                </>
              ) : (
                <div className="glass-card" style={{ border: '1px solid #ff4d4d' }}>
                  <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>ACCESS DENIED</p>
                  <p style={{ fontSize: '0.8rem' }}>No Papagedon NFT detected in this wallet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <div className="analyzing-pulse">BIO-AUDIO SYNC ACTIVE</div>
              <div className="stats-panel">
                <div className="stat-item">
                  <span className="stat-label">Bass</span>
                  <span className="stat-value">{(metrics.bass * 100).toFixed(0)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Mid</span>
                  <span className="stat-value">{(metrics.mid * 100).toFixed(0)}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">High</span>
                  <span className="stat-value">{(metrics.high * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="glass-card" style={{ padding: '10px 20px', fontSize: '0.7rem', opacity: 0.6 }}>
            LATENCY: 14ms | BUFFER: 512 | MODE: REAL-TIME
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', opacity: 0.5 }}>
            PAPAGEDON.AVA <br />
            BUILD GAMES HACKATHON 2026
          </div>
        </footer>
      </div>

      {/* 3D Visual Layer */}
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffa3" />
        
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {engine && <Visualizer audioEngine={engine} />}
        </Float>
        
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
