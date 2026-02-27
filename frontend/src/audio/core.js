/**
 * PAPAGEDON Real-Time Audio Engine
 * Handles FFT analysis for synced visuals.
 */
export class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isInitialized = false;
        this.source = null;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 512; // High resolution for beat tracking
        
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        this.isInitialized = true;
        console.log("⚡ PAPAGEDON Audio Engine Online.");
    }

    /**
     * Connects a media element (video/audio) to the analyser
     */
    connect(element) {
        if (!this.audioContext) return;
        this.source = this.audioContext.createMediaElementSource(element);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    getFFTData() {
        if (!this.analyser) return null;
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    /**
     * Calculates "Energy" in specific bands (Bass, Mid, High)
     */
    getEnergy() {
        const data = this.getFFTData();
        if (!data) return { bass: 0, mid: 0, high: 0 };

        let bass = 0, mid = 0, high = 0;
        
        // Bass (frequencies 0-20)
        for (let i = 0; i < 20; i++) bass += data[i];
        // Mid (frequencies 20-100)
        for (let i = 20; i < 100; i++) mid += data[i];
        // High (frequencies 100+)
        for (let i = 100; i < data.length; i++) high += data[i];

        return {
            bass: bass / 20 / 255,
            mid: mid / 80 / 255,
            high: high / (data.length - 100) / 255
        };
    }
}
