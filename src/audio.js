/**
 * Romantic Audio Engine with Vietnamese Confession Song Support & Web Audio Effects
 */

export class RomanticAudioEngine {
  constructor() {
    this.audioElement = document.getElementById('bg-music');
    this.ctx = null;
    this.isPlaying = false;
    this.useFallback = false;
    this.synthTimerId = null;
    this.synthIndex = 0;

    this.initAudioElement();
  }

  initAudioElement() {
    if (!this.audioElement) {
      this.audioElement = new Audio('./music.mp3');
      this.audioElement.loop = true;
    } else {
      this.audioElement.src = './music.mp3';
      this.audioElement.loop = true;
    }

    // Set initial volume
    this.audioElement.volume = 0.75;

    // Error handler for fallback
    this.audioElement.addEventListener('error', (e) => {
      console.warn('HTML5 Audio failed, falling back to Web Audio Synthesizer:', e);
      this.useFallback = true;
    });
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  async startMusic() {
    this.initContext();
    this.isPlaying = true;

    if (!this.useFallback && this.audioElement) {
      try {
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
          return;
        }
      } catch (err) {
        console.warn('Autoplay restricted or audio load issue, switching to synth:', err);
        this.useFallback = true;
      }
    }

    // Fallback synthesizer
    this.startSynthMusic();
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.synthTimerId) {
      clearTimeout(this.synthTimerId);
      this.synthTimerId = null;
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  // Soft tone generator for synth fallback & SFX
  playTone(freq, duration = 1.2, gainLevel = 0.12) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(gainLevel, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Melodic fallback if MP3 cannot be loaded
  startSynthMusic() {
    if (this.synthTimerId) return;

    // Romantic ballad arpeggio sequence
    const notes = [
      261.63, 329.63, 392.00, 523.25,
      196.00, 246.94, 293.66, 392.00,
      220.00, 261.63, 329.63, 440.00,
      164.81, 196.00, 246.94, 329.63,
      174.61, 220.00, 261.63, 349.23,
      261.63, 329.63, 392.00, 523.25
    ];

    const playNext = () => {
      if (!this.isPlaying) return;
      const freq = notes[this.synthIndex % notes.length];
      this.playTone(freq, 1.8, 0.1);
      this.synthIndex++;
      this.synthTimerId = setTimeout(playNext, 420);
    };

    playNext();
  }

  // Sparkle chime sound effect
  playSparkleSound() {
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 0.5, 0.08), idx * 60);
    });
  }

  // Cute playful bounce sound when "No" button runs away
  playWhooshSound() {
    this.initContext();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.14);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Triumphant celebration fanfare for YES
  playCelebrationSound() {
    this.initContext();
    const celebrationChords = [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880.00],
      [659.25, 830.61, 987.77],
      [1046.50, 1318.51, 1567.98]
    ];

    celebrationChords.forEach((chord, step) => {
      setTimeout(() => {
        chord.forEach(f => this.playTone(f, 2.5, 0.14));
      }, step * 200);
    });
  }
}
