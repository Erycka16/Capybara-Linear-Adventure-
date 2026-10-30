import React, { useEffect, useRef } from 'react';
import { GameStatus, GameStats, LevelConfig, Gate, OrangeFruit, BonusStar, HazardCloud, Particle, PlayerState, Level2Phase } from '../types/game';
import { getActiveLevel1Data, getActiveLevel2Data, getActiveLevel3Data } from '../data/questions';
import { sounds } from '../utils/audio';

interface GameCanvasProps {
  levelConfig: LevelConfig;
  status: GameStatus;
  initialScore: number;
  initialHearts: number;
  isSpeedBoostActive: boolean;
  isSlowBoostActive: boolean;
  onUpdateStats: (stats: GameStats | ((prev: GameStats) => GameStats)) => void;
  onGameOver: (finalStats: GameStats, failedReason?: string) => void;
  onVictory: (finalStats: GameStats) => void;
  onShowFeedback: (text: string, isCorrect: boolean) => void;
  onEnterClassroom: (doorNumber: number) => void;
  onTriggerLevel2Study: () => void;
  level2Phase: Level2Phase;
  level3DoorNumber: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  levelConfig,
  status,
  initialScore,
  initialHearts,
  isSpeedBoostActive,
  isSlowBoostActive,
  onUpdateStats,
  onGameOver,
  onVictory,
  onShowFeedback,
  onEnterClassroom,
  onTriggerLevel2Study,
  level2Phase,
  level3DoorNumber,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const callbacksRef = useRef({
    onUpdateStats,
    onGameOver,
    onVictory,
    onShowFeedback,
    onEnterClassroom,
    onTriggerLevel2Study,
  });
  callbacksRef.current = {
    onUpdateStats,
    onGameOver,
    onVictory,
    onShowFeedback,
    onEnterClassroom,
    onTriggerLevel2Study,
  };

  const isSpeedBoostRef = useRef(isSpeedBoostActive);
  isSpeedBoostRef.current = isSpeedBoostActive;

  const isSlowBoostRef = useRef(isSlowBoostActive);
  isSlowBoostRef.current = isSlowBoostActive;

  const level2PhaseRef = useRef(level2Phase);
  level2PhaseRef.current = level2Phase;

  const level3DoorRef = useRef(level3DoorNumber);
  level3DoorRef.current = level3DoorNumber;

  const initialScoreRef = useRef(initialScore);
  const initialHeartsRef = useRef(initialHearts);

  const isTouchingRef = useRef(false);
  const touchTargetYRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const player: PlayerState = {
      x: Math.min(width * 0.22, 190),
      y: height * 0.5,
      vy: 0,
      rotation: 0,
      wingAngle: 0,
      width: 90,
      height: 58,
      invulnerableTime: 0,
      isFlapping: false,
      isSpeeding: false,
      isSlowing: false,
    };

    // Strictly preserve incoming hearts & cumulative score without resetting on frame updates
    let hearts = Math.max(1, initialHeartsRef.current);
    const maxHearts = 5;
    let cumulativeScore = initialScoreRef.current;
    let streak = 0;
    let maxStreak = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let qIndex = 0;

    // Level 1: Exactly 2 minutes (120 seconds) total countdown timer as requested!
    let l1TotalTimeLeft = 120;

    let hitstopTimer = 0;
    let screenShake = 0;
    let flashTimer = 0;

    let orangesCollected = 0;
    let gates: Gate[] = [];
    let oranges: OrangeFruit[] = [];
    let bonusStars: BonusStar[] = [];
    let hazards: HazardCloud[] = [];
    let particles: Particle[] = [];

    const clouds = [
      { x: 120, y: height * 0.16, size: 75, speed: 18 },
      { x: 480, y: height * 0.25, size: 95, speed: 24 },
      { x: 880, y: height * 0.14, size: 110, speed: 16 },
      { x: 1300, y: height * 0.32, size: 85, speed: 22 },
      { x: 1680, y: height * 0.22, size: 105, speed: 20 },
    ];

    const keys: Record<string, boolean> = {
      up: false,
      down: false,
      speedKey: false,
      slowKey: false,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyD') {
        keys.speedKey = true;
        sounds.playSpeedBoost();
      }
      if (e.code === 'KeyA' || e.code === 'ControlLeft' || e.code === 'KeyZ') {
        keys.slowKey = true;
        sounds.playSlowDown();
      }
      if (e.code === 'Space') {
        e.preventDefault();
        player.vy = levelConfig.flapStrength * 1.05;
        player.isFlapping = true;
        sounds.playFlap();
        createFeathers(player.x, player.y + 20, 4);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyD') keys.speedKey = false;
      if (e.code === 'KeyA' || e.code === 'ControlLeft' || e.code === 'KeyZ') keys.slowKey = false;
    };

    const handleBlur = () => {
      keys.up = false;
      keys.down = false;
      keys.speedKey = false;
      keys.slowKey = false;
      isTouchingRef.current = false;
      touchTargetYRef.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Touch Controls
    const handleTouchStart = (e: TouchEvent) => {
      isTouchingRef.current = true;
      touchTargetYRef.current = e.touches[0].clientY;
      player.vy = levelConfig.flapStrength * 0.8;
      player.isFlapping = true;
      sounds.playFlap();
      createFeathers(player.x, player.y + 20, 3);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTouchingRef.current && e.touches.length > 0) {
        touchTargetYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      touchTargetYRef.current = null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isTouchingRef.current = true;
      touchTargetYRef.current = e.clientY;
      player.vy = levelConfig.flapStrength * 0.85;
      player.isFlapping = true;
      sounds.playFlap();
      createFeathers(player.x, player.y + 20, 3);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchingRef.current) touchTargetYRef.current = e.clientY;
    };

    const handleMouseUp = () => {
      isTouchingRef.current = false;
      touchTargetYRef.current = null;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const createFeathers = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x - 10 + Math.random() * 20,
          y: y + Math.random() * 10,
          vx: -150 - Math.random() * 60,
          vy: (Math.random() - 0.5) * 60,
          life: 0.6 + Math.random() * 0.4,
          maxLife: 1.0,
          color: Math.random() > 0.3 ? '#FFFFFF' : '#F6C344',
          size: 4 + Math.random() * 4,
          shape: 'feather',
        });
      }
    };

    const createStarBurst = (x: number, y: number, color: string, count = 25) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const spd = 130 + Math.random() * 190;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0.8 + Math.random() * 0.4,
          maxLife: 1.2,
          color,
          size: 5 + Math.random() * 6,
          shape: 'star',
        });
      }
    };

    const createSpeedLines = () => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: window.innerWidth + 20,
          y: 120 + Math.random() * (window.innerHeight - 200),
          vx: -700 - Math.random() * 200,
          vy: (Math.random() - 0.5) * 10,
          life: 0.4,
          maxLife: 0.4,
          color: 'rgba(255, 255, 255, 0.65)',
          size: 30 + Math.random() * 40,
          shape: 'speedLine',
        });
      }
    };

    // Helper to add oranges continuously (Level 3)
    const addOrangesBatch = (startX: number, count: number) => {
      const curH = window.innerHeight;
      const topPlayArea = 160;
      const botPlayArea = curH - 70;
      const availableHeight = botPlayArea - topPlayArea;

      for (let i = 1; i <= count; i++) {
        const oy = topPlayArea + 25 + ((i * 79) % (availableHeight - 70));
        oranges.push({
          id: `orange_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          x: startX + i * 150,
          y: oy,
          collected: false,
          bobOffset: i * 0.8,
        });
      }
    };

    // Spawn elements according to Level (Gates, Oranges, Bonus Stars, Storm Clouds)
    const spawnWorldElements = (index: number) => {
      const curH = window.innerHeight;
      const curW = window.innerWidth;
      const topPlayArea = 160;
      const botPlayArea = curH - 70;
      const availableHeight = botPlayArea - topPlayArea;

      // 1. GATES
      const l1Questions = getActiveLevel1Data();
      const l2Questions = getActiveLevel2Data();
      const l3Questions = getActiveLevel3Data();

      if (levelConfig.level === 1) {
        const q = l1Questions[index % l1Questions.length];
        const numChoices = q.options.length;
        const choiceHeight = Math.min(100, (availableHeight - (numChoices + 1) * 16) / numChoices);
        const totalBlockHeight = numChoices * choiceHeight + (numChoices - 1) * 16;
        const startY = topPlayArea + (availableHeight - totalBlockHeight) / 2;

        const choices = q.options.map((opt, idx) => ({
          text: opt,
          isCorrect: idx === q.correctIndex,
          y: startY + idx * (choiceHeight + 16),
          height: choiceHeight,
          hit: false,
        }));

        gates = [
          {
            id: `l1_gate_${index}_${Date.now()}`,
            title: `${q.eq1} & ${q.eq2}`,
            subtitle: 'Pilih Titik (x, y)',
            options: q.options,
            correctIndex: q.correctIndex,
            x: curW + levelConfig.spawnDistance,
            width: 180,
            choices,
            passed: false,
            resolved: false,
            pulseOffset: Math.random() * Math.PI,
            isLocked: false,
          },
        ];
        oranges = [];
      } else if (levelConfig.level === 2) {
        // LEVEL 2: Wide & clear gate choices that neatly fit the full equations!
        const q = l2Questions[index % l2Questions.length];
        const numChoices = q.options.length;
        const choiceHeight = Math.min(105, (availableHeight - (numChoices + 1) * 16) / numChoices);
        const totalBlockHeight = numChoices * choiceHeight + (numChoices - 1) * 16;
        const startY = topPlayArea + (availableHeight - totalBlockHeight) / 2;

        const choices = q.options.map((opt, idx) => ({
          text: opt,
          isCorrect: idx === q.correctIndex,
          y: startY + idx * (choiceHeight + 16),
          height: choiceHeight,
          hit: false,
        }));

        const gateWidth = Math.min(460, Math.max(380, curW * 0.45));

        gates = [
          {
            id: `l2_gate_${index}_${Date.now()}`,
            title: 'Persamaan Linear',
            subtitle: 'Pilih Model Persamaan',
            options: q.options,
            correctIndex: q.correctIndex,
            x: curW + levelConfig.spawnDistance,
            width: gateWidth,
            choices,
            passed: false,
            resolved: false,
            pulseOffset: Math.random() * Math.PI,
            isLocked: false,
          },
        ];
        oranges = [];
      } else {
        // LEVEL 3: 4 Themed Doors & continuous oranges everywhere!
        const doorNum = level3DoorRef.current;
        const classroomQ = l3Questions[(doorNum - 1) % l3Questions.length];

        const doorHeight = Math.min(320, availableHeight - 40);
        const doorY = topPlayArea + (availableHeight - doorHeight) / 2;
        const isLocked = orangesCollected < 5;

        const doorX = curW + levelConfig.spawnDistance + 240;

        gates = [
          {
            id: `l3_door_${doorNum}_${Date.now()}`,
            title: classroomQ.doorTitle,
            subtitle: 'Masuk Bilik Kelas',
            options: ['Masuk Bilik Kelas'],
            correctIndex: 0,
            x: doorX,
            width: 190,
            choices: [
              {
                text: `🚪 MASUK ${classroomQ.doorTitle}`,
                isCorrect: true,
                y: doorY,
                height: doorHeight,
                hit: false,
              },
            ],
            passed: false,
            resolved: false,
            pulseOffset: Math.random() * Math.PI,
            isLocked,
            isClassroomDoor: true,
            doorNumber: doorNum,
          },
        ];

        oranges = [];
        addOrangesBatch(player.x + 80, 12);
        addOrangesBatch(doorX + 220, 16);
      }

      // 2. EXTRA BONUS STARS (Kutip Skor Tambahan +50 ⭐) across all levels!
      bonusStars = [];
      const numStars = 3;
      for (let s = 1; s <= numStars; s++) {
        const starX = curW + 280 * s + (s % 2 === 0 ? 50 : 0);
        const starY = topPlayArea + 35 + ((s * 95) % (availableHeight - 70));
        bonusStars.push({
          id: `star_${Date.now()}_${s}`,
          x: starX,
          y: starY,
          collected: false,
          bobOffset: s * 1.2,
        });
      }

      // 3. HAZARDS / AWAN RIBUT (Melanggar Capy -1 Nyawa ⛈️⚡) across all levels!
      hazards = [
        {
          id: `hazard_1_${Date.now()}`,
          x: curW + 420,
          y: topPlayArea + 50,
          radius: 30,
          hit: false,
          bobOffset: 0.5,
        },
        {
          id: `hazard_2_${Date.now()}`,
          x: curW + 780,
          y: botPlayArea - 65,
          radius: 30,
          hit: false,
          bobOffset: 2.1,
        },
      ];
    };

    spawnWorldElements(0);

    // GAME LOOP
    const gameLoop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05);

      const curW = window.innerWidth;
      const curH = window.innerHeight;

      if (hitstopTimer > 0) {
        hitstopTimer -= dt;
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 25);
      if (flashTimer > 0) flashTimer = Math.max(0, flashTimer - dt * 2);

      const isLevel2Paused = levelConfig.level === 2 && level2PhaseRef.current === 'STUDY';

      if (status === 'PLAYING') {
        // Level 1: 2-minute Countdown Timer (120s)
        if (levelConfig.level === 1) {
          l1TotalTimeLeft = Math.max(0, l1TotalTimeLeft - dt);

          if (l1TotalTimeLeft <= 0) {
            sounds.playGameOver();
            callbacksRef.current.onGameOver(
              {
                score: cumulativeScore,
                streak,
                maxStreak,
                correctCount,
                wrongCount,
                hearts: 0,
                maxHearts,
                currentQuestionIndex: qIndex,
                totalQuestions: levelConfig.targetQuestions,
                level1TotalTimeLeft: 0,
                level2Phase: 'FLYING',
                level2TimeLeft: 0,
                level3DoorNumber: 1,
                orangesCollected: 0,
                hasKey: false,
              },
              'Masa 2 Minit Telah Tamat!'
            );
            return;
          }
        }

        const isSpeeding = (isSpeedBoostRef.current || keys.speedKey) && !isLevel2Paused;
        const isSlowing = (isSlowBoostRef.current || keys.slowKey) && !isLevel2Paused;

        player.isSpeeding = isSpeeding;
        player.isSlowing = isSlowing;

        const effectiveSpeed = isLevel2Paused
          ? 0
          : isSpeeding
          ? levelConfig.boostFlightSpeed
          : isSlowing
          ? levelConfig.slowFlightSpeed
          : levelConfig.baseFlightSpeed;

        if (isSpeeding) createSpeedLines();

        // Player physics
        if (keys.up) player.vy -= 740 * dt;
        else if (keys.down) player.vy += 660 * dt;

        if (isTouchingRef.current && touchTargetYRef.current !== null) {
          const dy = touchTargetYRef.current - player.y;
          player.vy += Math.sign(dy) * Math.min(Math.abs(dy) * 8.5, 460) * dt;
        }

        if (isLevel2Paused) {
          const hoverY = curH * 0.5 + Math.sin(currentTime * 0.003) * 15;
          player.y += (hoverY - player.y) * 0.05;
          player.vy = 0;
          player.rotation *= 0.9;
        } else {
          player.vy += levelConfig.gravity * dt;
          player.vy *= 0.96;
          player.y += player.vy * dt;

          const minY = 135;
          const maxY = curH - 65;
          if (player.y < minY) {
            player.y = minY;
            player.vy = 20;
          }
          if (player.y > maxY) {
            player.y = maxY;
            player.vy = -45;
          }

          const targetRot = Math.max(-0.4, Math.min(0.4, (player.vy / 450) * 0.45));
          player.rotation += (targetRot - player.rotation) * 0.15;
        }

        const wingRate = isSpeeding ? 0.03 : isSlowing ? 0.009 : 0.015;
        player.wingAngle = Math.sin(currentTime * wingRate) * (isSpeeding ? 28 : isSlowing ? 14 : 20);

        if (player.invulnerableTime > 0) {
          player.invulnerableTime = Math.max(0, player.invulnerableTime - dt);
        }

        clouds.forEach((cloud) => {
          cloud.x -= (cloud.speed + (isSpeeding ? 80 : isSlowing ? -10 : 0)) * dt;
          if (cloud.x < -150) {
            cloud.x = curW + 120;
            cloud.y = curH * (0.12 + Math.random() * 0.35);
          }
        });

        // 1. EXTRA BONUS STARS (Kutip Skor Tambahan +50)
        bonusStars.forEach((star) => {
          star.x -= effectiveSpeed * dt;
          if (!star.collected) {
            const dist = Math.hypot(star.x - player.x, star.y - player.y);
            if (dist < 52) {
              star.collected = true;
              cumulativeScore += 50;
              sounds.playBonusStar();
              createStarBurst(star.x, star.y, '#FACC15', 20);
              callbacksRef.current.onShowFeedback('⭐ Bintang Bonus! (+50 Skor)', true);
              callbacksRef.current.onUpdateStats((prev) => ({
                ...prev,
                score: cumulativeScore,
              }));
            }
          }
        });

        // 2. EXTRA HAZARDS (Awan Ribut / Langgar Capy -1 Nyawa)
        hazards.forEach((hazard) => {
          hazard.x -= effectiveSpeed * dt;
          if (!hazard.hit && player.invulnerableTime <= 0) {
            const dist = Math.hypot(hazard.x - player.x, hazard.y - player.y);
            if (dist < hazard.radius + 24) {
              hazard.hit = true;
              hearts = Math.max(0, hearts - 1);
              player.invulnerableTime = 1.8;
              hitstopTimer = 0.08;
              screenShake = 14;
              flashTimer = 0.4;

              sounds.playStormZap();
              createStarBurst(player.x, player.y, '#38BDF8', 25);
              callbacksRef.current.onShowFeedback('⚡ Terlanggar Awan Ribut! -1 Nyawa.', false);

              if (hearts <= 0) {
                sounds.playGameOver();
                callbacksRef.current.onGameOver(
                  {
                    score: cumulativeScore,
                    streak,
                    maxStreak,
                    correctCount,
                    wrongCount,
                    hearts: 0,
                    maxHearts,
                    currentQuestionIndex: qIndex,
                    totalQuestions: levelConfig.targetQuestions,
                    level1TotalTimeLeft: l1TotalTimeLeft,
                    level2Phase: level2PhaseRef.current,
                    level2TimeLeft: 0,
                    level3DoorNumber: level3DoorRef.current,
                    orangesCollected,
                    hasKey: false,
                  },
                  'Kehabisan 5 nyawa akibat ribut petir!'
                );
                return;
              }

              callbacksRef.current.onUpdateStats((prev) => ({
                ...prev,
                hearts,
                wrongCount: prev.wrongCount + 1,
                streak: 0,
              }));
            }
          }
        });

        // 3. Level 3 Oranges collection & continuous spawn
        if (levelConfig.level === 3) {
          oranges.forEach((orange) => {
            orange.x -= effectiveSpeed * dt;

            if (!orange.collected) {
              const dist = Math.hypot(orange.x - player.x, orange.y - player.y);
              if (dist < 56) {
                orange.collected = true;
                orangesCollected++;
                cumulativeScore += 30;

                sounds.playOrangeCollect(orangesCollected);
                createStarBurst(orange.x, orange.y, '#F97316', 16);

                if (orangesCollected >= 5) {
                  gates.forEach((g) => {
                    if (g.isLocked) {
                      g.isLocked = false;
                      sounds.playDoorUnlock();
                      callbacksRef.current.onShowFeedback(`🔓 PINTU ${level3DoorRef.current} TERBUKA! Terbang Masuk!`, true);
                    }
                  });
                } else {
                  callbacksRef.current.onShowFeedback(`🍊 Oren ${orangesCollected}/5 Dikutip!`, true);
                }

                callbacksRef.current.onUpdateStats((prev) => ({
                  ...prev,
                  score: cumulativeScore,
                  orangesCollected,
                }));
              }
            }
          });

          // Continuously spawn more oranges ahead so player never runs out!
          const activeOranges = oranges.filter((o) => !o.collected && o.x > player.x - 50);
          if (activeOranges.length < 8) {
            const maxX = Math.max(...oranges.map((o) => o.x), curW);
            addOrangesBatch(maxX + 100, 12);
          }
        }

        // Gates collision & logic
        gates.forEach((gate) => {
          gate.x -= effectiveSpeed * dt;

          const playerFrontX = player.x + player.width * 0.4;
          const playerBackX = player.x - player.width * 0.3;

          // LEVEL 3: Classroom Door Handling
          if (gate.isClassroomDoor) {
            if (gate.isLocked && gate.x + gate.width < playerBackX) {
              // Missed locked door! Respawn door further ahead and place plenty of oranges on the way!
              gate.x = curW + 1100;
              addOrangesBatch(curW + 50, 14);
              callbacksRef.current.onShowFeedback(`Kumpul ${5 - orangesCollected} lagi oren! Pintu ada di hadapan.`, false);
              return;
            }

            // Entering unlocked door
            if (playerFrontX >= gate.x && playerBackX <= gate.x + gate.width) {
              if (gate.isLocked) {
                if (player.invulnerableTime <= 0) {
                  player.invulnerableTime = 1.2;
                  screenShake = 6;
                  sounds.playWrong();
                  callbacksRef.current.onShowFeedback(`🔒 Kumpul ${5 - orangesCollected} lagi oren! Teruskan terbang ke depan.`, false);
                }
                return;
              }

              // Unlocked: enter classroom!
              gate.resolved = true;
              sounds.playDoorUnlock();
              createStarBurst(gate.x + gate.width / 2, player.y, '#F59E0B', 35);
              callbacksRef.current.onEnterClassroom(gate.doorNumber || 1);
              return;
            }
          } else {
            // LEVEL 1 & 2: Choice Gates Handling
            if (!gate.resolved && gate.x + gate.width < playerBackX) {
              gate.x = curW + levelConfig.spawnDistance * 0.85;
              gate.resolved = false;
              if (levelConfig.level === 2) {
                callbacksRef.current.onTriggerLevel2Study();
                callbacksRef.current.onShowFeedback('Soalan terlepas! Diberi 10 saat meneliti dan cuba lagi.', false);
              } else {
                callbacksRef.current.onShowFeedback('Terlepas gerbang! Cuba lagi.', false);
              }
              return;
            }

            // Flying through a choice
            if (!gate.resolved && playerFrontX >= gate.x && playerBackX <= gate.x + gate.width) {
              for (let i = 0; i < gate.choices.length; i++) {
                const choice = gate.choices[i];
                const choiceTop = choice.y;
                const choiceBottom = choice.y + choice.height;

                if (player.y >= choiceTop && player.y <= choiceBottom) {
                  gate.resolved = true;
                  choice.hit = true;

                  if (choice.isCorrect) {
                    correctCount++;
                    streak++;
                    if (streak > maxStreak) maxStreak = streak;
                    const bonus = 150 + streak * 30;
                    cumulativeScore += bonus;

                    sounds.playCorrect();
                    createStarBurst(gate.x + gate.width / 2, player.y, '#10B981', 35);
                    callbacksRef.current.onShowFeedback(`Tepat Sekali! (+${bonus})`, true);

                    if (correctCount >= levelConfig.targetQuestions) {
                      sounds.playVictory();
                      callbacksRef.current.onVictory({
                        score: cumulativeScore,
                        streak,
                        maxStreak,
                        correctCount,
                        wrongCount,
                        hearts,
                        maxHearts,
                        currentQuestionIndex: qIndex + 1,
                        totalQuestions: levelConfig.targetQuestions,
                        level1TotalTimeLeft: l1TotalTimeLeft,
                        level2Phase: level2PhaseRef.current,
                        level2TimeLeft: 0,
                        level3DoorNumber: 1,
                        orangesCollected,
                        hasKey: false,
                      });
                      return;
                    }

                    qIndex++;
                    if (levelConfig.level === 2) {
                      callbacksRef.current.onTriggerLevel2Study();
                    }
                    spawnWorldElements(qIndex);
                  } else {
                    if (player.invulnerableTime <= 0) {
                      wrongCount++;
                      streak = 0;
                      hearts = Math.max(0, hearts - 1);
                      player.invulnerableTime = 1.8;
                      hitstopTimer = 0.08;
                      screenShake = 12;
                      flashTimer = 0.4;

                      sounds.playWrong();
                      createStarBurst(gate.x + gate.width / 2, player.y, '#EF4444', 25);
                      callbacksRef.current.onShowFeedback(
                        `Jawapan Kurang Tepat! -1 Nyawa. Sila kira semula!`,
                        false
                      );

                      if (hearts <= 0) {
                        sounds.playGameOver();
                        callbacksRef.current.onGameOver(
                          {
                            score: cumulativeScore,
                            streak,
                            maxStreak,
                            correctCount,
                            wrongCount,
                            hearts: 0,
                            maxHearts,
                            currentQuestionIndex: qIndex,
                            totalQuestions: levelConfig.targetQuestions,
                            level1TotalTimeLeft: l1TotalTimeLeft,
                            level2Phase: level2PhaseRef.current,
                            level2TimeLeft: 0,
                            level3DoorNumber: 1,
                            orangesCollected,
                            hasKey: false,
                          },
                          'Kehabisan 5 nyawa!'
                        );
                        return;
                      }

                      if (levelConfig.level === 2) {
                        callbacksRef.current.onTriggerLevel2Study();
                      }
                      spawnWorldElements(qIndex);
                    }
                  }

                  callbacksRef.current.onUpdateStats({
                    score: cumulativeScore,
                    streak,
                    maxStreak,
                    correctCount,
                    wrongCount,
                    hearts,
                    maxHearts,
                    currentQuestionIndex: qIndex,
                    totalQuestions: levelConfig.targetQuestions,
                    level1TotalTimeLeft: l1TotalTimeLeft,
                    level2Phase: level2PhaseRef.current,
                    level2TimeLeft: 0,
                    level3DoorNumber: 1,
                    orangesCollected,
                    hasKey: false,
                  });
                  break;
                }
              }
            }
          }
        });

        particles.forEach((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        particles = particles.filter((p) => p.life > 0);
      }

      // ================= DRAW =================
      ctx.save();
      if (screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
      }

      const grad = ctx.createLinearGradient(0, 0, 0, curH);
      if (levelConfig.level === 1) {
        grad.addColorStop(0, '#6EE7B7');
        grad.addColorStop(0.5, '#A7F3D0');
        grad.addColorStop(1, '#FEF08A');
      } else if (levelConfig.level === 2) {
        grad.addColorStop(0, '#38BDF8');
        grad.addColorStop(0.5, '#BAE6FD');
        grad.addColorStop(1, '#FED7AA');
      } else {
        grad.addColorStop(0, '#FB923C');
        grad.addColorStop(0.5, '#FDE047');
        grad.addColorStop(1, '#FDA4AF');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, curW, curH);

      clouds.forEach((c) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size * 0.45, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.35, c.y - c.size * 0.2, c.size * 0.4, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.7, c.y, c.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Bonus Stars (⭐ +50)
      bonusStars.forEach((star) => {
        if (star.collected) return;
        const sy = star.y + Math.sin(currentTime * 0.005 + star.bobOffset) * 7;
        const rot = currentTime * 0.002 + star.bobOffset;

        ctx.save();
        ctx.translate(star.x, sy);
        ctx.rotate(rot);

        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 14;

        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        drawStarPath(ctx, 0, 0, 5, 16, 8);
        ctx.fill();

        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        drawStarPath(ctx, 0, 0, 5, 11, 5.5);
        ctx.fill();

        ctx.restore();
      });

      // Draw Hazards / Storm Clouds (⛈️⚡)
      hazards.forEach((hazard) => {
        if (hazard.hit) return;
        const hy = hazard.y + Math.sin(currentTime * 0.004 + hazard.bobOffset) * 6;

        ctx.save();
        ctx.translate(hazard.x, hy);

        ctx.shadowColor = '#0284C7';
        ctx.shadowBlur = 15;

        // Dark stormy puffs
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.arc(-14, 0, 18, 0, Math.PI * 2);
        ctx.arc(10, -4, 20, 0, Math.PI * 2);
        ctx.arc(22, 6, 14, 0, Math.PI * 2);
        ctx.arc(-2, 10, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(-12, -2, 15, 0, Math.PI * 2);
        ctx.arc(8, -6, 17, 0, Math.PI * 2);
        ctx.arc(18, 4, 12, 0, Math.PI * 2);
        ctx.fill();

        // Crackling lightning bolt in center
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.moveTo(2, -12);
        ctx.lineTo(-6, 2);
        ctx.lineTo(0, 2);
        ctx.lineTo(-4, 14);
        ctx.lineTo(8, -1);
        ctx.lineTo(1, -1);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      });

      // Draw Level 3 Oranges
      if (levelConfig.level === 3) {
        oranges.forEach((o) => {
          if (o.collected) return;
          const oy = o.y + Math.sin(currentTime * 0.005 + o.bobOffset) * 6;

          ctx.save();
          ctx.translate(o.x, oy);
          ctx.shadowColor = '#F97316';
          ctx.shadowBlur = 12;

          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FB923C';
          ctx.beginPath();
          ctx.arc(-2, -2, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#16A34A';
          ctx.beginPath();
          ctx.ellipse(3, -17, 7, 3.5, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(-6, -6, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // Draw Gates
      gates.forEach((gate) => {
        if (gate.isClassroomDoor) {
          const choice = gate.choices[0];
          const doorX = gate.x;
          const doorY = choice.y;
          const doorW = gate.width;
          const doorH = choice.height;

          ctx.save();
          ctx.shadowColor = gate.isLocked ? '#EA580C' : '#10B981';
          ctx.shadowBlur = 20;

          ctx.fillStyle = gate.isLocked ? '#78350F' : '#047857';
          ctx.beginPath();
          ctx.roundRect(doorX - 10, doorY - 10, doorW + 20, doorH + 20, 24);
          ctx.fill();

          ctx.fillStyle = gate.isLocked ? '#B45309' : '#10B981';
          ctx.beginPath();
          ctx.roundRect(doorX, doorY, doorW, doorH, 18);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 15px "Fredoka", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`🚪 PINTU ${gate.doorNumber}`, doorX + doorW / 2, doorY + 40);

          ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('BILIK BELAJAR', doorX + doorW / 2, doorY + 65);

          const midY = doorY + doorH / 2;
          ctx.fillStyle = gate.isLocked ? '#FEE2E2' : '#D1FAE5';
          ctx.beginPath();
          ctx.arc(doorX + doorW / 2, midY, 40, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '32px sans-serif';
          ctx.fillText(gate.isLocked ? '🔒' : '🔓', doorX + doorW / 2, midY + 10);

          ctx.fillStyle = gate.isLocked ? '#991B1B' : '#065F46';
          ctx.font = 'bold 11px "Fredoka", sans-serif';
          ctx.fillText(
            gate.isLocked ? `Kumpul ${5 - orangesCollected} Oren!` : 'TERBANG MASUK!',
            doorX + doorW / 2,
            doorY + doorH - 40
          );
          ctx.restore();
        } else {
          gate.choices.forEach((choice, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const boxX = gate.x;
            const boxY = choice.y;
            const boxW = gate.width;
            const boxH = choice.height;

            ctx.save();
            let portalBg = 'rgba(255, 255, 255, 0.96)';
            let borderColor = '#0284C7';
            let badgeBg = '#0284C7';

            if (choice.hit) {
              if (choice.isCorrect) {
                portalBg = 'rgba(209, 250, 229, 0.98)';
                borderColor = '#10B981';
                badgeBg = '#059669';
              } else {
                portalBg = 'rgba(254, 226, 226, 0.98)';
                borderColor = '#EF4444';
                badgeBg = '#DC2626';
              }
            }

            ctx.shadowColor = borderColor;
            ctx.shadowBlur = 12;

            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxW, boxH, 18);
            ctx.fillStyle = portalBg;
            ctx.fill();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = borderColor;
            ctx.stroke();

            // Badge
            ctx.shadowBlur = 0;
            ctx.fillStyle = badgeBg;
            ctx.beginPath();
            ctx.arc(boxX + 28, boxY + boxH / 2, 17, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px "Fredoka", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(letter, boxX + 28, boxY + boxH / 2 + 1);

            // Choice text
            ctx.fillStyle = '#0F172A';
            if (levelConfig.level === 1) {
              ctx.font = 'bold 22px monospace';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(choice.text, boxX + 56, boxY + boxH / 2);
            } else {
              ctx.font = 'bold 17px "Fredoka", monospace';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(choice.text, boxX + 56, boxY + boxH / 2);
            }

            ctx.restore();
          });
        }
      });

      // Player with dynamic organic floating wave
      ctx.save();
      const dynamicFloat = Math.sin(currentTime * 0.004) * 4;
      ctx.translate(player.x, player.y + dynamicFloat);
      ctx.rotate(player.rotation);

      const shouldDraw = player.invulnerableTime <= 0 || Math.floor(currentTime * 0.02) % 2 === 0;
      if (shouldDraw) {
        drawCapybaraAndDuck(ctx, player.wingAngle, currentTime, player.invulnerableTime > 0);
      }
      ctx.restore();

      // Particles
      particles.forEach((p) => {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'speedLine') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.size, p.y);
          ctx.stroke();
        } else if (p.shape === 'star') {
          const r = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - r);
          ctx.quadraticCurveTo(p.x, p.y, p.x + r, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x + r, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x - r, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - r);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.6, p.vx * 0.01, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (flashTimer > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${flashTimer * 0.4})`;
        ctx.fillRect(0, 0, curW, curH);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [levelConfig.level, status]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block w-full h-full cursor-pointer touch-none"
    />
  );
};

// Helper to draw a 5-point star
function drawStarPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

// Pre-render SVG sprites from the EXACT SVG markup of CapybaraDuckIllustration (opening interface!)
function buildCapyDuckSvg(wingAngle: number = 0, eyeState: 'sleep' | 'dizzy' = 'sleep'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" width="240" height="160">
    <g>
      <!-- DUCK FEET (Yellow webbed feet trailing behind) -->
      <g transform="translate(18, 88)">
        <path d="M 12 12 C 4 8, -6 14, -12 18 C -14 26, -6 32, 2 34 C 14 36, 26 28, 32 20 Z" fill="#F6C344" stroke="#1E1E1E" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 2 34 C -4 38, -10 32, -6 24 C -2 18, 6 16, 14 18" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round"/>
        <path d="M -6 24 C -12 22, -14 14, -8 10" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round"/>
      </g>
      <!-- DUCK BODY (Plump White Body) -->
      <path d="M 68 82 C 48 84, 40 102, 54 116 C 68 130, 96 136, 134 134 C 172 132, 194 118, 204 98 C 200 86, 186 78, 172 78 C 152 78, 140 82, 126 84 C 104 84, 88 80, 68 82 Z" fill="#FFFFFF" stroke="#1E1E1E" stroke-width="4" stroke-linejoin="round"/>
      <!-- DUCK HEAD & BEAK -->
      <path d="M 194 92 C 208 92, 218 94, 224 102 C 222 108, 214 116, 198 116 C 192 116, 188 112, 190 106 Z" fill="#F6C344" stroke="#1E1E1E" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M 204 100 Q 206 101 208 101" stroke="#1E1E1E" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="184" cy="94" r="3.8" fill="#1E1E1E"/>
      <circle cx="185.2" cy="92.8" r="1.2" fill="#FFFFFF"/>
      <!-- DUCK WING -->
      <g transform="rotate(${wingAngle}, 100, 108)">
        <path d="M 78 100 C 82 118, 92 126, 114 124 C 124 122, 134 112, 126 98 C 114 94, 94 94, 78 100 Z" fill="#FFFFFF" stroke="#1E1E1E" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 94 102 C 98 114, 106 118, 118 114" fill="none" stroke="#1E1E1E" stroke-width="2.8" stroke-linecap="round"/>
      </g>
      <!-- CAPYBARA -->
      <ellipse cx="62" cy="70" rx="6.5" ry="6.5" fill="#C48E58" stroke="#1E1E1E" stroke-width="3.5"/>
      <path d="M 68 76 C 62 62, 70 48, 92 46 C 120 44, 134 40, 150 44 C 168 48, 186 58, 188 74 C 188 84, 182 92, 172 94 C 152 96, 146 88, 132 88 C 118 88, 112 92, 94 92 C 78 92, 72 86, 68 76 Z" fill="#C48E58" stroke="#1E1E1E" stroke-width="4" stroke-linejoin="round"/>
      <path d="M 166 56 C 178 54, 188 62, 188 74 C 188 84, 182 90, 172 92 C 162 92, 156 84, 158 74 C 160 64, 162 58, 166 56 Z" fill="#A46E3E" stroke="#1E1E1E" stroke-width="3"/>
      <path d="M 183 67 C 182 66, 180 67, 181 69 C 182 71, 184 71, 185 69 Z" fill="#3B2314"/>
      <path d="M 182 78 C 178 82, 175 80, 176 76" stroke="#1E1E1E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <ellipse cx="148" cy="74" rx="7" ry="5.5" fill="#FF8D8D" opacity="0.85"/>
      ${
        eyeState === 'dizzy'
          ? '<path d="M 153 60 L 161 68 M 161 60 L 153 68" stroke="#1E1E1E" stroke-width="2.8" stroke-linecap="round"/>'
          : '<path d="M 152 64 C 156 61, 162 61, 165 64" stroke="#1E1E1E" stroke-width="3.2" stroke-linecap="round" fill="none"/>'
      }
      <path d="M 124 44 C 122 36, 130 32, 136 36 C 140 40, 138 46, 134 46 Z" fill="#945F34" stroke="#1E1E1E" stroke-width="3"/>
      <path d="M 132 46 C 130 38, 140 34, 146 38 C 150 42, 148 48, 142 48 Z" fill="#A87244" stroke="#1E1E1E" stroke-width="3"/>
      <path d="M 72 82 C 70 88, 76 96, 84 94 C 90 92, 88 82, 82 80 Z" fill="#A46E3E" stroke="#1E1E1E" stroke-width="3"/>
      <path d="M 144 86 C 142 92, 148 98, 156 96 C 162 94, 160 86, 154 84 Z" fill="#A46E3E" stroke="#1E1E1E" stroke-width="3"/>
    </g>
  </svg>`;
}

function createSvgSprite(svg: string): HTMLImageElement {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return img;
}

// Pre-create sprite cache for instant rendering
const spriteNeutral = createSvgSprite(buildCapyDuckSvg(0, 'sleep'));
const spriteFlapUp = createSvgSprite(buildCapyDuckSvg(-14, 'sleep'));
const spriteFlapDown = createSvgSprite(buildCapyDuckSvg(18, 'sleep'));
const spriteDizzy = createSvgSprite(buildCapyDuckSvg(0, 'dizzy'));

// Render Capybara riding Duck — EXACT SAME ARTWORK as opening interface!
function drawCapybaraAndDuck(ctx: CanvasRenderingContext2D, wingAngle: number, currentTime: number = 0, isDizzy: boolean = false) {
  let sprite = spriteNeutral;
  if (isDizzy) {
    sprite = spriteDizzy;
  } else if (wingAngle < -5) {
    sprite = spriteFlapUp;
  } else if (wingAngle > 5) {
    sprite = spriteFlapDown;
  }

  // Draw identical SVG artwork matching the opening interface!
  if (sprite.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, -58, -39, 116, 78);
  } else {
    // Immediate fallback with Path2D while SVG finishes decoding
    ctx.save();
    ctx.translate(-58, -39);
    ctx.scale(116 / 240, 78 / 160);
    // Duck Feet
    ctx.fillStyle = '#F6C344';
    ctx.strokeStyle = '#1E1E1E';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(30, 106, 18, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Duck Body
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(120, 108, 68, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Duck Beak
    ctx.fillStyle = '#F6C344';
    ctx.beginPath();
    ctx.ellipse(204, 104, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Duck eye
    ctx.fillStyle = '#1E1E1E';
    ctx.beginPath();
    ctx.arc(184, 94, 3.8, 0, Math.PI * 2);
    ctx.fill();
    // Capybara Body
    ctx.fillStyle = '#C48E58';
    ctx.beginPath();
    ctx.ellipse(120, 70, 48, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Capybara Snout
    ctx.fillStyle = '#A46E3E';
    ctx.beginPath();
    ctx.ellipse(172, 74, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Cheek
    ctx.fillStyle = '#FF8D8D';
    ctx.beginPath();
    ctx.arc(148, 74, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

