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
        this.analyser.fftSize = 1024; // Increased resolution for better spectral flux
        this.analyser.smoothingTimeConstant = 0.8;
        
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        // For beat detection
        this.lastEnergy = 0;
        this.beatThreshold = 0.15;
        this.lastBeatTime = 0;
        
        this.isInitialized = true;
        console.log("⚡ PAPAGEDON Audio Engine Online.");
    }

    /**
     * Connects a media element (video/audio) to the analyser
     */
    connect(element) {
        if (!this.audioContext) return;
        if (this.source) this.source.disconnect();
        this.source = this.audioContext.createMediaElementSource(element);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    /**
     * Connects microphone stream
     */
    async initStream() {
        if (!this.audioContext) await this.init();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (this.source) this.source.disconnect();
        this.source = this.audioContext.createMediaStreamSource(stream);
        this.source.connect(this.analyser);
        // We don't connect source to destination for mic to avoid feedback
        console.log("🎤 Live Feed Active.");
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
        if (!data) return { bass: 0, mid: 0, high: 0, beat: false };

        let bass = 0, mid = 0, high = 0;
        
        // Bass (frequencies 0-20) - Amapiano Log Drum lives here
        for (let i = 0; i < 20; i++) bass += data[i];
        // Mid (frequencies 20-100)
        for (let i = 20; i < 100; i++) mid += data[i];
        // High (frequencies 100+)
        for (let i = 100; i < data.length; i++) high += data[i];

        const avgBass = bass / 20 / 255;
        const avgMid = mid / 80 / 255;
        const avgHigh = high / (data.length - 100) / 255;

        // Simple Peak Detection for Beats
        let beat = false;
        const currentTime = Date.now();
        if (avgBass > this.beatThreshold && (avgBass - this.lastEnergy) > 0.1) {
            if (currentTime - this.lastBeatTime > 250) { // Max 240 BPM roughly
                beat = true;
                this.lastBeatTime = currentTime;
            }
        }
        this.lastEnergy = avgBass;

        return {
            bass: avgBass,
            mid: avgMid,
            high: avgHigh,
            beat: beat
        };
    }
}
