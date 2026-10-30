// Catchy, loud, high-energy Web Audio synthesizer for Capy Linear Math
// Featuring the viral "Capybara, Capybara, Capybara" song for the opening!

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private currentBgm: 'TITLE' | 'GAMEPLAY' | 'SERIOUS' | null = null;
  private bgmTimeout: number | null = null;
  private isPlayingBgm: boolean = false;

  // Master volume node
  private masterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.95, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private getDestination(): AudioNode {
    return this.masterGain || this.ctx!.destination;
  }

  // Play wing flap swoosh
  playFlap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {}
  }

  // Speed boost rocket swoosh
  playSpeedBoost() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.22);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 0.29);
    } catch {}
  }

  // Slow down gentle braking sound
  playSlowDown() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.25);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 0.29);
    } catch {}
  }

  // Bonus Star collect sound (Sparkling bell twinkle +50 pts)
  playBonusStar() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98, 2093.0];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(t);
        osc.stop(t + 0.23);
      });
    } catch {}
  }

  // Hazard bump zap sound (thundercloud lightning zap)
  playStormZap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.2);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.getDestination());
      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  // Super catchy, radiant success fanfare (triumphant multi-voice sparkle)
  playCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.05;

        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.42, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(t);
        osc.stop(t + 0.48);
      });
    } catch {}
  }

  // Comical error sound
  playWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const tones = [
        { f1: 370, f2: 190, delay: 0 },
        { f1: 270, f2: 120, delay: 0.17 },
      ];

      tones.forEach((tone) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + tone.delay;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(tone.f1, t);
        osc.frequency.exponentialRampToValueAtTime(tone.f2, t + 0.15);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(t);
        osc.stop(t + 0.19);
      });
    } catch {}
  }

  // Orange fruit pickup pop
  playOrangeCollect(count: number = 1) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 659.25 + (count % 8) * 120;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.1);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 0.21);
    } catch {}
  }

  // Golden key obtain sound
  playKeyObtain() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [783.99, 987.77, 1174.66, 1479.98, 1760.00, 2093.0];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.42, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(t);
        osc.stop(t + 0.48);
      });
    } catch {}
  }

  // Door unlock
  playDoorUnlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.38, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(t);
        osc.stop(t + 0.39);
      });
    } catch {}
  }

  playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.12, t: 0.0 },
        { f: 659.25, d: 0.12, t: 0.12 },
        { f: 783.99, d: 0.12, t: 0.24 },
        { f: 1046.5, d: 0.35, t: 0.36 },
        { f: 880.00, d: 0.18, t: 0.75 },
        { f: 1046.5, d: 0.60, t: 0.95 },
        { f: 1318.5, d: 0.80, t: 1.55 },
      ];

      fanfare.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const st = now + n.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, st);

        gain.gain.setValueAtTime(0, st);
        gain.gain.linearRampToValueAtTime(0.42, st + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, st + n.d);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(st);
        osc.stop(st + n.d + 0.05);
      });
    } catch {}
  }

  playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 392, 349.2, 293.6, 261.63];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.19;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(this.getDestination());

        osc.start(t);
        osc.stop(t + 0.29);
      });
    } catch {}
  }

  // ================= BGM 1: THE VIRAL "CAPYBARA... CAPYBARA CAPYBARA" OPENING THEME! =================
  startTitleBgm() {
    if (this.currentBgm === 'TITLE' && this.isPlayingBgm) return;
    this.stopBgm();
    this.initCtx();
    if (!this.ctx) return;

    this.currentBgm = 'TITLE';
    this.isPlayingBgm = true;

    // The iconic viral TikTok Capybara song:
    // "Ca-py-ba-ra... Ca-py-ba-ra, Ca-py-ba-ra, Ca-py-ba-ra, Ca-py-ba-ra!"
    const capyRhythmMelody = [
      // 1. "Ca - py - ba - raaaaa" (long singing note)
      { f: 349.23, d: 0.22, bass: 174.61 }, // F4 "Ca"
      { f: 440.00, d: 0.22, bass: 174.61 }, // A4 "py"
      { f: 523.25, d: 0.22, bass: 174.61 }, // C5 "ba"
      { f: 587.33, d: 0.65, bass: 146.83 }, // D5 "raaaaa"

      // 2. "Capybara, Capybara, Capybara, Capybara!" (fast catchy syncopated chant)
      { f: 587.33, d: 0.13, bass: 146.83 }, // D5 "Ca"
      { f: 587.33, d: 0.13, bass: 146.83 }, // D5 "py"
      { f: 523.25, d: 0.13, bass: 146.83 }, // C5 "ba"
      { f: 587.33, d: 0.15, bass: 146.83 }, // D5 "ra,"
      { f: 523.25, d: 0.13, bass: 130.81 }, // C5 "Ca"
      { f: 440.00, d: 0.13, bass: 130.81 }, // A4 "py"
      { f: 392.00, d: 0.13, bass: 130.81 }, // G4 "ba"
      { f: 440.00, d: 0.24, bass: 130.81 }, // A4 "ra!"

      // 3. Repeat "Ca - py - ba - raaaaa"
      { f: 349.23, d: 0.22, bass: 174.61 }, // F4 "Ca"
      { f: 440.00, d: 0.22, bass: 174.61 }, // A4 "py"
      { f: 523.25, d: 0.22, bass: 174.61 }, // C5 "ba"
      { f: 587.33, d: 0.65, bass: 146.83 }, // D5 "raaaaa"

      // 4. "Capybara, Capybara, Capybara, Capybara!" (turnaround ending hook)
      { f: 587.33, d: 0.13, bass: 146.83 }, // D5 "Ca"
      { f: 587.33, d: 0.13, bass: 146.83 }, // D5 "py"
      { f: 523.25, d: 0.13, bass: 146.83 }, // C5 "ba"
      { f: 587.33, d: 0.15, bass: 146.83 }, // D5 "ra,"
      { f: 698.46, d: 0.13, bass: 174.61 }, // F5 "Ca"
      { f: 659.25, d: 0.13, bass: 164.81 }, // E5 "py"
      { f: 587.33, d: 0.13, bass: 146.83 }, // D5 "ba"
      { f: 523.25, d: 0.28, bass: 130.81 }, // C5 "ra!"
    ];

    let noteIdx = 0;
    const playCapySong = () => {
      if (!this.isPlayingBgm || this.currentBgm !== 'TITLE' || !this.ctx || this.isMuted) {
        this.bgmTimeout = window.setTimeout(playCapySong, 300);
        return;
      }

      try {
        const now = this.ctx.currentTime;
        const note = capyRhythmMelody[noteIdx % capyRhythmMelody.length];

        // Lead synth singing "Capybara!"
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 0.92);

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(now);
        osc.stop(now + note.d);

        // Bouncy dance bassline
        if (note.bass) {
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'sawtooth';
          bOsc.frequency.setValueAtTime(note.bass, now);

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);

          bGain.gain.setValueAtTime(0.28, now);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + note.d * 0.85);

          bOsc.connect(filter);
          filter.connect(bGain);
          bGain.connect(this.getDestination());
          bOsc.start(now);
          bOsc.stop(now + note.d);
        }

        noteIdx++;
        this.bgmTimeout = window.setTimeout(playCapySong, note.d * 1000);
      } catch {
        this.bgmTimeout = window.setTimeout(playCapySong, 300);
      }
    };

    playCapySong();
  }

  // ================= BGM 2: SUPER CATCHY & LOUD GAMEPLAY BGM =================
  startGameBgm() {
    if (this.currentBgm === 'GAMEPLAY' && this.isPlayingBgm) return;
    this.stopBgm();
    this.initCtx();
    if (!this.ctx) return;

    this.currentBgm = 'GAMEPLAY';
    this.isPlayingBgm = true;

    const riffs = [
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 1046.5, d: 0.22 },
      { f: 783.99, d: 0.15 },
      { f: 880.00, d: 0.22 },
      { f: 783.99, d: 0.30 },

      { f: 659.25, d: 0.15 },
      { f: 587.33, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.22 },
      { f: 783.99, d: 0.22 },
      { f: 880.00, d: 0.30 },

      { f: 698.46, d: 0.15 },
      { f: 659.25, d: 0.15 },
      { f: 587.33, d: 0.15 },
      { f: 698.46, d: 0.22 },
      { f: 880.00, d: 0.22 },
      { f: 1046.5, d: 0.30 },

      { f: 987.77, d: 0.15 },
      { f: 880.00, d: 0.15 },
      { f: 783.99, d: 0.15 },
      { f: 987.77, d: 0.22 },
      { f: 1174.6, d: 0.22 },
      { f: 1318.5, d: 0.32 },
    ];

    const bassLine = [
      130.81, 130.81, 196.0, 130.81,
      110.00, 110.00, 164.81, 110.00,
      87.31, 87.31, 130.81, 87.31,
      98.00, 98.00, 146.83, 196.0,
    ];

    let noteIdx = 0;
    const playStep = () => {
      if (!this.isPlayingBgm || this.currentBgm !== 'GAMEPLAY' || !this.ctx || this.isMuted) {
        this.bgmTimeout = window.setTimeout(playStep, 250);
        return;
      }

      try {
        const now = this.ctx.currentTime;
        const currentNote = riffs[noteIdx % riffs.length];
        const bassNote = bassLine[Math.floor(noteIdx / 2) % bassLine.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(currentNote.f, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.26, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + currentNote.d * 0.9);

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(now);
        osc.stop(now + currentNote.d);

        if (noteIdx % 2 === 0) {
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'sawtooth';
          bOsc.frequency.setValueAtTime(bassNote, now);

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(460, now);

          bGain.gain.setValueAtTime(0.26, now);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

          bOsc.connect(filter);
          filter.connect(bGain);
          bGain.connect(this.getDestination());
          bOsc.start(now);
          bOsc.stop(now + 0.25);
        }

        noteIdx++;
        this.bgmTimeout = window.setTimeout(playStep, currentNote.d * 1000);
      } catch {
        this.bgmTimeout = window.setTimeout(playStep, 250);
      }
    };

    playStep();
  }

  // ================= BGM 3: SERIOUS ACADEMIC PUZZLE BGM =================
  startSeriousBgm() {
    if (this.currentBgm === 'SERIOUS' && this.isPlayingBgm) return;
    this.stopBgm();
    this.initCtx();
    if (!this.ctx) return;

    this.currentBgm = 'SERIOUS';
    this.isPlayingBgm = true;

    const seriousNotes = [
      { f: 293.66, d: 0.32 },
      { f: 349.23, d: 0.32 },
      { f: 440.00, d: 0.42 },
      { f: 587.33, d: 0.60 },
      { f: 523.25, d: 0.32 },
      { f: 440.00, d: 0.32 },
      { f: 392.00, d: 0.52 },
      { f: 349.23, d: 0.32 },
      { f: 329.63, d: 0.32 },
      { f: 293.66, d: 0.70 },
      { f: 220.00, d: 0.42 },
      { f: 261.63, d: 0.42 },
      { f: 293.66, d: 0.80 },
    ];

    const seriousChords = [
      [146.83, 220.00],
      [130.81, 196.00],
      [116.54, 174.61],
      [110.00, 164.81],
    ];

    let step = 0;
    const playSeriousStep = () => {
      if (!this.isPlayingBgm || this.currentBgm !== 'SERIOUS' || !this.ctx || this.isMuted) {
        this.bgmTimeout = window.setTimeout(playSeriousStep, 350);
        return;
      }

      try {
        const now = this.ctx.currentTime;
        const note = seriousNotes[step % seriousNotes.length];
        const chord = seriousChords[Math.floor(step / 3) % seriousChords.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1100, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.26, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + note.d * 0.95);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.getDestination());
        osc.start(now);
        osc.stop(now + note.d);

        if (step % 3 === 0) {
          chord.forEach((freq) => {
            if (!this.ctx) return;
            const bOsc = this.ctx.createOscillator();
            const bGain = this.ctx.createGain();
            bOsc.type = 'sine';
            bOsc.frequency.setValueAtTime(freq, now);

            bGain.gain.setValueAtTime(0, now);
            bGain.gain.linearRampToValueAtTime(0.22, now + 0.05);
            bGain.gain.exponentialRampToValueAtTime(0.0005, now + 1.2);

            bOsc.connect(bGain);
            bGain.connect(this.getDestination());
            bOsc.start(now);
            bOsc.stop(now + 1.25);
          });
        }

        step++;
        this.bgmTimeout = window.setTimeout(playSeriousStep, note.d * 1000);
      } catch {
        this.bgmTimeout = window.setTimeout(playSeriousStep, 350);
      }
    };

    playSeriousStep();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    this.currentBgm = null;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      if (this.currentBgm === 'TITLE') this.startTitleBgm();
      else if (this.currentBgm === 'SERIOUS') this.startSeriousBgm();
      else this.startGameBgm();
    }
    return this.isMuted;
  }
}

export const sounds = new SoundEngine();
