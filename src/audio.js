/**
 * Romantic Audio Engine
 * Synthesizes a Vietnamese-style romantic ballad melody using Web Audio API.
 * Falls back to live music URL if set.
 */

export class RomanticAudioEngine {
  constructor() {
    this.audioElement = document.getElementById('bg-music');
    this.ctx          = null;
    this.isPlaying    = false;
    this.useFallback  = false;
    this.synthTimerId = null;
    this.synthIndex   = 0;
    this.gainNode     = null;

    this._setupAudioElement();
  }

  _setupAudioElement() {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
    }

    // Try to load music.mp3 (place in /public/music.mp3 for production)
    this.audioElement.src   = './music.mp3';
    this.audioElement.loop  = true;
    this.audioElement.volume = 0.7;

    this.audioElement.addEventListener('error', () => {
      this.useFallback = true;
    });
  }

  _initCtx() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx       = new Ctx();
      this.gainNode  = this.ctx.createGain();
      this.gainNode.gain.value = 0.08;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  async startMusic() {
    this._initCtx();
    this.isPlaying = true;

    if (!this.useFallback && this.audioElement) {
      try {
        await this.audioElement.play();
        return; // MP3 loaded fine
      } catch {
        this.useFallback = true;
      }
    }

    this._startSynth();
  }

  stopMusic() {
    this.isPlaying = false;
    try { this.audioElement?.pause(); } catch {}
    if (this.synthTimerId) {
      clearTimeout(this.synthTimerId);
      this.synthTimerId = null;
    }
  }

  toggleMusic() {
    if (this.isPlaying) { this.stopMusic(); return false; }
    this.startMusic(); return true;
  }

  // ── Tone generator ──────────────────────────────────────
  _tone(freq, dur = 1.4, gain = 0.1, type = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g   = this.ctx.createGain();
    osc.type  = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  // ── Romantic Vietnamese ballad synth ────────────────────
  // Chord progression: Am – F – C – G (common Vietnamese pop ballad)
  _startSynth() {
    if (this.synthTimerId) return;

    // Notes in Hz for a warm, yearning ballad
    // Based on: Am – F – C – G progression in A minor pentatonic feel
    const melody = [
      // Am feel
      440.00, 523.25, 659.25, 880.00,
      // F feel
      349.23, 440.00, 523.25, 698.46,
      // C feel
      261.63, 329.63, 392.00, 523.25,
      // G feel
      392.00, 493.88, 587.33, 783.99,
      // Am feel (repeat)
      440.00, 523.25, 659.25, 880.00,
      // F feel
      349.23, 440.00, 523.25, 698.46,
      // Em feel
      329.63, 392.00, 493.88, 659.25,
      // Am resolve
      440.00, 523.25, 440.00, 329.63,
    ];

    // Optional bass notes under the melody
    const bass = [
      220.00, 174.61, 130.81, 196.00,
      220.00, 174.61, 130.81, 196.00,
    ];

    let bassIdx = 0;
    let step    = 0;

    const tick = () => {
      if (!this.isPlaying) return;

      const freq = melody[this.synthIndex % melody.length];
      this._tone(freq, 1.6, 0.09, 'sine');

      // Add a soft harmonic on every other note
      if (step % 2 === 0) this._tone(freq * 2, 1.2, 0.04, 'sine');

      // Add bass note every 4 notes
      if (step % 4 === 0) {
        const bf = bass[bassIdx % bass.length];
        this._tone(bf, 1.8, 0.07, 'triangle');
        bassIdx++;
      }

      this.synthIndex++;
      step++;
      this.synthTimerId = setTimeout(tick, 380);
    };

    tick();
  }

  // ── Sound Effects ────────────────────────────────────────
  playSparkleSound() {
    this._initCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this._tone(f, 0.45, 0.07), i * 55);
    });
  }

  playWhooshSound() {
    this._initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g   = this.ctx.createGain();
    osc.type  = 'triangle';
    const t   = this.ctx.currentTime;
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.15);
    g.gain.setValueAtTime(0.09, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playCelebrationSound() {
    this._initCtx();
    [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880.00],
      [659.25, 830.61, 987.77],
      [1046.5, 1318.5, 1567.98],
    ].forEach((chord, i) => {
      setTimeout(() => chord.forEach(f => this._tone(f, 2.5, 0.13)), i * 190);
    });
  }
}
