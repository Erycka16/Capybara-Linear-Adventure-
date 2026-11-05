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

  // Energetic snare drum roll crescendo followed by booming bass impact and crash cymbal!
  playDrumRoll() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Snare drum roll: 16 rapid crisp hits that crescendo
      const numHits = 16;
      for (let i = 0; i < numHits; i++) {
        const hitProgress = i / (numHits - 1);
        const hitTime = now + (i * 0.042) * (1 - hitProgress * 0.25);
        const hitGain = 0.08 + hitProgress * 0.38;

        const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1900 + hitProgress * 400, hitTime);
        noiseFilter.Q.setValueAtTime(1.8, hitTime);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(hitGain, hitTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.045);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.getDestination());

        noise.start(hitTime);
        noise.stop(hitTime + 0.05);

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(195 + hitProgress * 40, hitTime);
        oscGain.gain.setValueAtTime(hitGain * 0.45, hitTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.035);

        osc.connect(oscGain);
        oscGain.connect(this.getDestination());

        osc.start(hitTime);
        osc.stop(hitTime + 0.04);
      }

      // 2. Climax Drum Boom (Timpani & Bass drum) at roll finish
      const climaxTime = now + 0.62;
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(140, climaxTime);
      bassOsc.frequency.exponentialRampToValueAtTime(42, climaxTime + 0.45);

      bassGain.gain.setValueAtTime(0.55, climaxTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, climaxTime + 0.55);

      bassOsc.connect(bassGain);
      bassGain.connect(this.getDestination());
      bassOsc.start(climaxTime);
      bassOsc.stop(climaxTime + 0.6);

      // Crash Cymbal shimmer
      const cymbalSize = Math.floor(this.ctx.sampleRate * 0.5);
      const cymbalBuffer = this.ctx.createBuffer(1, cymbalSize, this.ctx.sampleRate);
      const cData = cymbalBuffer.getChannelData(0);
      for (let k = 0; k < cymbalSize; k++) {
        cData[k] = Math.random() * 2 - 1;
      }
      const cymbal = this.ctx.createBufferSource();
      cymbal.buffer = cymbalBuffer;
      const cymbalFilter = this.ctx.createBiquadFilter();
      cymbalFilter.type = 'highpass';
      cymbalFilter.frequency.setValueAtTime(4500, climaxTime);

      const cymbalGain = this.ctx.createGain();
      cymbalGain.gain.setValueAtTime(0.35, climaxTime);
      cymbalGain.gain.exponentialRampToValueAtTime(0.001, climaxTime + 0.5);

      cymbal.connect(cymbalFilter);
      cymbalFilter.connect(cymbalGain);
      cymbalGain.connect(this.getDestination());

      cymbal.start(climaxTime);
      cymbal.stop(climaxTime + 0.52);
    } catch {}
  }

  // Cheerful, joyous "Yippee!" sound synthesized with rising vocal formant frequencies!
  playYippee(delay: number = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime + delay;

      // Vocal formant 1: "Yip" (~540Hz) sweeping up to joyful "peeeee!" (~1180Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(540, now);
      osc1.frequency.linearRampToValueAtTime(620, now + 0.1);
      osc1.frequency.exponentialRampToValueAtTime(1180, now + 0.35);
      osc1.frequency.linearRampToValueAtTime(1260, now + 0.65);

      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(700, now);
      filter1.frequency.linearRampToValueAtTime(1300, now + 0.35);
      filter1.Q.setValueAtTime(2.5, now);

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.38, now + 0.08);
      gain1.gain.setValueAtTime(0.38, now + 0.45);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(this.getDestination());

      osc1.start(now);
      osc1.stop(now + 0.75);

      // Cheerful high harmonic chime bells for extra celebration
      const chimeFreqs = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0];
      chimeFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        const t = now + 0.18 + idx * 0.07;

        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, t);

        cGain.gain.setValueAtTime(0, t);
        cGain.gain.linearRampToValueAtTime(0.28, t + 0.02);
        cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

        chime.connect(cGain);
        cGain.connect(this.getDestination());

        chime.start(t);
        chime.stop(t + 0.35);
      });
    } catch {}
  }

  private lastVictoryTime: number = 0;

  // Grand celebratory level completion: Drum roll crescendo + "YIPPEEE!" + Triumphant Brass Fanfare!
  playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const curTime = this.ctx.currentTime;
      if (curTime - this.lastVictoryTime < 2.5) {
        return;
      }
      this.lastVictoryTime = curTime;

      // 1. Energetic drum roll crescendo
      this.playDrumRoll();

      // 2. Jubilant "Yippee!" voice exclamation right as drum reaches climax!
      this.playYippee(0.55);

      // 3. Grand Triumphant Brass Fanfare
      const now = this.ctx.currentTime + 0.65;
      const fanfare = [
        { f: 523.25, d: 0.14, t: 0.0 }, // C5
        { f: 659.25, d: 0.14, t: 0.14 }, // E5
        { f: 783.99, d: 0.14, t: 0.28 }, // G5
        { f: 1046.5, d: 0.38, t: 0.42 }, // C6
        { f: 880.00, d: 0.18, t: 0.85 }, // A5
        { f: 1046.5, d: 0.55, t: 1.05 }, // C6
        { f: 1318.5, d: 0.85, t: 1.62 }, // E6
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
