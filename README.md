# PAPAGEDON Infrastructure 🧬🛡️⚡💎

Immersive music infrastructure on Avalanche. PAPAGEDON converts audio into spatial audiovisual experiences, secured by Avalanche NFTs with automated royalty distribution.

## 🏗️ Architecture

- `/frontend`: Immersive player (React / Three.js / WebGL)
- `/audio-engine`: Real-time AV rendering (Web Audio API / Custom Shaders)
- `/contracts`: Avalanche NFT & ERC-2981 Royalty distribution
- `/backend`: Smart contract interaction layer (Ethers.js)

## 🚀 Quick Start

### 1. Smart Contracts (Avalanche Fuji)

```bash
cd contracts
npm install
# Create .env with PRIVATE_KEY
npx hardhat compile
npx hardhat run scripts/deploy.js --network fuji
```

### 2. Immersive Player (Frontend)

```bash
cd frontend
npm install
npm run dev
```

## 💎 Core Features

- **Real-Time Rendering**: Low-latency FFT analysis driving GLSL shaders.
- **Avalanche Integration**: Token-gated access to restricted "Immersive Experiences".
- **Automated Royalties**: EIP-2981 support for instant creator payouts on secondary sales.
- **Generative Visuals**: Conceptual integration for Chainlink VRF driven seeds.

## 🛠️ Tech Stack

- **Blockchain**: Avalanche C-Chain
- **Visuals**: Three.js / WebGL / Custom Shaders
- **Audio**: Web Audio API
- **Integrations**: Chainlink, Agora
