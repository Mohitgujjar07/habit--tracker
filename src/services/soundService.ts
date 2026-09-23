class SoundService {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private isNoisePlaying: boolean = false;

  private initCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play a clean, gentle chime when a focus session or milestone finishes
   */
  playCompletionChime(): void {
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Chord sequence: A4 (440Hz) -> C#5 (554.37Hz) -> E5 (659.25Hz)
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }

  /**
   * Toggle procedural ambient brown/pink noise for deep focus
   */
  toggleAmbientNoise(enable: boolean): boolean {
    const ctx = this.initCtx();
    if (!ctx) return false;

    if (!enable) {
      if (this.noiseNode) {
        try {
          (this.noiseNode as any).stop?.();
          this.noiseNode.disconnect();
        } catch (e) {}
        this.noiseNode = null;
      }
      this.isNoisePlaying = false;
      return false;
    }

    if (this.isNoisePlaying) return true;

    // Generate brown noise buffer
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
    this.isNoisePlaying = true;
    return true;
  }
}

export const soundService = new SoundService();
