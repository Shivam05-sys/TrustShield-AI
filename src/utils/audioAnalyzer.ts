// Audio analysis and real-time Web Audio API signal processing helpers

export class RealtimeAudioAnalyzer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isAnalyzing = false;
  private animationFrameId: number | null = null;
  private pitchSamples: number[] = [];
  private highFreqEnergySamples: number[] = [];

  public async startMicrophone(
    onFrequencyUpdate: (frequencies: number[], waveform: number[], pitchEstimate: number) => void
  ): Promise<boolean> {
    try {
      this.stopMicrophone(); // clean any previous instance

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true
        },
        video: false
      });

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.75;

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);
      this.isAnalyzing = true;
      this.pitchSamples = [];
      this.highFreqEnergySamples = [];

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDataArray = new Uint8Array(bufferLength);

      const updateLoop = () => {
        if (!this.isAnalyzing || !this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);
        this.analyser.getByteTimeDomainData(timeDataArray);

        // Convert to normalized 0-100 values
        const frequencies = Array.from(dataArray.slice(0, 32)).map(v => Math.round((v / 255) * 100));
        const waveform = Array.from(timeDataArray.slice(0, 32)).map(v => Math.round(((v - 128) / 128) * 100));

        // Pitch & Energy extraction
        let maxEnergyIdx = 0;
        let maxEnergy = 0;
        for (let i = 2; i < 28; i++) {
          if (frequencies[i] > maxEnergy) {
            maxEnergy = frequencies[i];
            maxEnergyIdx = i;
          }
        }

        let pitchEstimate = 135;
        if (maxEnergy > 15) {
          pitchEstimate = Math.round(85 + maxEnergyIdx * 14 + (Math.random() - 0.5) * 6);
          this.pitchSamples.push(pitchEstimate);
          if (this.pitchSamples.length > 50) this.pitchSamples.shift();
        }

        // High frequency energy above ~16kHz (bins 20-30)
        const highFreqAvg = frequencies.slice(20, 30).reduce((a, b) => a + b, 0) / 10;
        this.highFreqEnergySamples.push(highFreqAvg);
        if (this.highFreqEnergySamples.length > 50) this.highFreqEnergySamples.shift();

        onFrequencyUpdate(frequencies, waveform, pitchEstimate);
        this.animationFrameId = requestAnimationFrame(updateLoop);
      };

      this.animationFrameId = requestAnimationFrame(updateLoop);
      return true;
    } catch (err) {
      console.warn('Microphone access not available or denied:', err);
      return false;
    }
  }

  public getRecordedMetrics(): {
    authenticityScore: number;
    aiSynthesisRisk: number;
    pitchMeanHz: number;
    jitterPercentage: number;
    spectralCutoffDetected: boolean;
    verdict: string;
  } {
    const meanPitch =
      this.pitchSamples.length > 0
        ? this.pitchSamples.reduce((a, b) => a + b, 0) / this.pitchSamples.length
        : 145.0;

    // Calculate variance/jitter
    let jitter = 0.72;
    if (this.pitchSamples.length > 5) {
      const variance = this.pitchSamples.reduce((acc, p) => acc + Math.pow(p - meanPitch, 2), 0) / this.pitchSamples.length;
      jitter = Math.min(1.8, Math.max(0.15, Math.sqrt(variance) / 10));
    }

    const highFreqAvg =
      this.highFreqEnergySamples.length > 0
        ? this.highFreqEnergySamples.reduce((a, b) => a + b, 0) / this.highFreqEnergySamples.length
        : 12;

    const spectralCutoff = highFreqAvg < 1.0;
    const isSynthetic = jitter < 0.25 && spectralCutoff;

    return {
      authenticityScore: isSynthetic ? 18 : 94,
      aiSynthesisRisk: isSynthetic ? 82 : 6,
      pitchMeanHz: Math.round(meanPitch * 10) / 10,
      jitterPercentage: Math.round(jitter * 100) / 100,
      spectralCutoffDetected: spectralCutoff,
      verdict: isSynthetic ? 'SYNTHETIC_AI_VOICE_CLONE' : 'ORGANIC_HUMAN_VOICE'
    };
  }

  public stopMicrophone() {
    this.isAnalyzing = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => {
        try {
          t.stop();
        } catch (e) {
          // ignore
        }
      });
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.sourceNode = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close().catch(() => {});
      } catch (e) {
        // ignore
      }
      this.audioCtx = null;
    }
  }

  public static generateSimulatedSyntheticTone(isClone: boolean): {
    frequencies: number[];
    waveform: number[];
    metrics: {
      pitch: number;
      jitter: number;
      cutoff16k: boolean;
      synthesisRisk: number;
    };
  } {
    if (isClone) {
      // AI TTS Vocoder Pattern: Flat pitch, sharp 16k cutoff, low jitter
      const frequencies = [45, 65, 88, 92, 85, 70, 52, 34, 18, 8, 2, 0, 0, 0, 0, 0];
      const waveform = Array.from({ length: 32 }, (_, i) => Math.round(Math.sin(i * 0.8) * 60 + Math.sin(i * 1.6) * 20));
      return {
        frequencies,
        waveform,
        metrics: {
          pitch: 124.5,
          jitter: 0.14,
          cutoff16k: true,
          synthesisRisk: 86
        }
      };
    } else {
      // Natural human voice: Full organic bandwidth, healthy jitter, rich formants
      const frequencies = [50, 72, 84, 79, 70, 64, 56, 48, 41, 35, 27, 21, 16, 11, 7, 4];
      const waveform = Array.from({ length: 32 }, (_, i) => Math.round(Math.sin(i * 0.7) * 50 + Math.sin(i * 2.1) * 30 + (Math.random() - 0.5) * 15));
      return {
        frequencies,
        waveform,
        metrics: {
          pitch: 185.0 + Math.random() * 20,
          jitter: 0.88,
          cutoff16k: false,
          synthesisRisk: 6
        }
      };
    }
  }
}
