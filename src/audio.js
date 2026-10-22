/**
 * Romantic Audio Engine with Web Audio API Synthesizer & Sound Effects
 * Generates an ethereal, ambient piano music-box ballad automatically
 * without external audio link dependency.
 */

export class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.noteIndex = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle bell/music-box note with soft reverb decay
  playTone(freq, duration = 1.2, gainLevel = 0.12) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Warm sine wave with subtle triangle harmonic
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

  // Romantic Canon in C / D Arpeggios notes (frequencies in Hz)
  getMelodySequence() {
    return [
      // Measure 1 (C Major)
      261.63, 329.63, 392.00, 523.25,
      // Measure 2 (G Major)
      196.00, 246.94, 293.66, 392.00,
      // Measure 3 (A Minor)
      220.00, 261.63, 329.63, 440.00,
      // Measure 4 (E Minor)
      164.81, 196.00, 246.94, 329.63,
      // Measure 5 (F Major)
      174.61, 220.00, 261.63, 349.23,
      // Measure 6 (C Major)
      261.63, 329.63, 392.00, 523.25,
      // Measure 7 (F Major)
      174.61, 220.00, 261.63, 349.23,
      // Measure 8 (G Major)
      196.00, 293.66, 392.00, 493.88
    ];
  }

  startMusic() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const notes = this.getMelodySequence();
    const noteInterval = 420; // ms per note for a gentle, slow rhythm

    const playNext = () => {
      if (!this.isPlaying) return;
      const freq = notes[this.noteIndex % notes.length];
      
      // Play arpeggio note
      this.playTone(freq, 1.8, 0.1);

      // Play occasional higher octave sparkle
      if (this.noteIndex % 4 === 0) {
        this.playTone(freq * 2, 2.2, 0.04);
      }

      this.noteIndex++;
      this.timerId = setTimeout(playNext, noteInterval);
    };

    playNext();
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
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

  // Sparkle chime sound effect
  playSparkleSound() {
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 0.6, 0.08), idx * 70);
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
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Triumphant celebration fanfare for YES
  playCelebrationSound() {
    this.initContext();
    const celebrationChords = [
      [523.25, 659.25, 783.99], // C Major
      [587.33, 739.99, 880.00], // D Major
      [659.25, 830.61, 987.77], // E Major
      [1046.50, 1318.51, 1567.98] // High C Super Sparkle
    ];

    celebrationChords.forEach((chord, step) => {
      setTimeout(() => {
        chord.forEach(f => this.playTone(f, 2.5, 0.15));
      }, step * 220);
    });
  }
}
