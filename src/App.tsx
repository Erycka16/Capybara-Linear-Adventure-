/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameStatus, GameStats, LevelDifficulty, Level2Phase } from './types/game';
import { LEVEL_CONFIGS, getActiveLevel3Data, shuffleAllQuestions } from './data/questions';
import { sounds } from './utils/audio';
import { GameCanvas } from './game/GameCanvas';
import { HUD } from './components/HUD';
import { TitleScreen } from './components/TitleScreen';
import { LevelSelectModal } from './components/LevelSelectModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { ClassroomModal } from './components/ClassroomModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import { Sparkles } from 'lucide-react';

interface PlayerScoreRecord {
  id: string;
  name: string;
  score: number;
  level: number;
  doorsUnlocked: number;
  date: string;
}

export default function App() {
  const [status, setStatus] = useState<GameStatus>('TITLE');
  const [selectedLevel, setSelectedLevel] = useState<LevelDifficulty>(1);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Player Name and Persistent Records
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('capy_player_name') || 'Murid Pintar';
    } catch {
      return 'Murid Pintar';
    }
  });

  const [playerRecords, setPlayerRecords] = useState<PlayerScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('capy_player_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Speed and Slow flight boost states
  const [isSpeedBoostActive, setIsSpeedBoostActive] = useState(false);
  const [isSlowBoostActive, setIsSlowBoostActive] = useState(false);

  // Level 2 special study timer: 10 seconds per new question
  const [level2Phase, setLevel2Phase] = useState<Level2Phase>('STUDY');
  const [level2TimeLeft, setLevel2TimeLeft] = useState<number>(10);

  // Level 3 Classroom state
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const [currentDoorNum, setCurrentDoorNum] = useState<number>(1);
  const [doorsUnlockedCount, setDoorsUnlockedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('capy_linear_doors_unlocked_count');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // High Scores & Best Times
  const [highScores, setHighScores] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('capy_linear_high_scores');
      return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0 };
    } catch {
      return { 1: 0, 2: 0, 3: 0 };
    }
  });

  const [bestTimes, setBestTimes] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('capy_linear_best_times');
      return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0 };
    } catch {
      return { 1: 0, 2: 0, 3: 0 };
    }
  });

  const [doorRecords, setDoorRecords] = useState<Record<number, { isUnlocked: boolean; scoreEarned: number; unlockedAt?: string }>>(() => {
    try {
      const saved = localStorage.getItem('capy_linear_door_records');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const levelConfig = useMemo(() => LEVEL_CONFIGS[selectedLevel], [selectedLevel]);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    wrongCount: 0,
    hearts: 5,
    maxHearts: 5,
    currentQuestionIndex: 0,
    totalQuestions: levelConfig.targetQuestions,
    level1TotalTimeLeft: 120, // Exactly 2 minutes (120 seconds) as requested!
    level2Phase: 'STUDY',
    level2TimeLeft: 10,
    level3DoorNumber: 1,
    orangesCollected: 0,
    hasKey: false,
  });

  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | undefined>();

  const showFeedback = useCallback((text: string, isCorrect: boolean) => {
    setFeedback({ text, isCorrect });
    window.setTimeout(() => {
      setFeedback((prev) => (prev?.text === text ? null : prev));
    }, 2000);
  }, []);

  const recordPlayerScore = useCallback((nameToRecord: string, scoreToRecord: number, lvlToRecord: number, doorsToRecord: number) => {
    if (!nameToRecord.trim() || scoreToRecord <= 0) return;
    const newRecord: PlayerScoreRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: nameToRecord.trim(),
      score: scoreToRecord,
      level: lvlToRecord,
      doorsUnlocked: doorsToRecord,
      date: new Date().toLocaleDateString('ms-MY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setPlayerRecords((prev) => {
      const updated = [newRecord, ...prev.filter(r => !(r.name === newRecord.name && r.level === newRecord.level && r.score === newRecord.score))].slice(0, 50);
      try {
        localStorage.setItem('capy_player_records', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const handlePlayerNameChange = useCallback((newName: string) => {
    // If previous name had scored, record it before changing name!
    if (stats.score > 0 && playerName.trim()) {
      recordPlayerScore(playerName, stats.score, selectedLevel, doorsUnlockedCount);
    }
    setPlayerName(newName);
    try {
      localStorage.setItem('capy_player_name', newName);
    } catch {}
  }, [stats.score, playerName, selectedLevel, doorsUnlockedCount, recordPlayerScore]);

  const checkAndSaveRecords = useCallback((level: number, finalScore: number, finalElapsed?: number) => {
    // Record into player-specific scoreboard history
    recordPlayerScore(playerName, finalScore, level, doorsUnlockedCount);

    setHighScores((prev) => {
      const current = prev[level] || 0;
      if (finalScore > current) {
        const updated = { ...prev, [level]: finalScore };
        try {
          localStorage.setItem('capy_linear_high_scores', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });

    if (level === 1 && finalElapsed !== undefined && finalElapsed > 0) {
      setBestTimes((prev) => {
        const current = prev[1] || 0;
        if (current === 0 || finalElapsed < current) {
          const updated = { ...prev, 1: finalElapsed };
          try {
            localStorage.setItem('capy_linear_best_times', JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return prev;
      });
    }
  }, [playerName, doorsUnlockedCount, recordPlayerScore]);

  const handleDeleteSingleRecord = useCallback((recordId: string) => {
    setPlayerRecords((prev) => {
      const recordToDelete = prev.find((r) => r.id === recordId);
      const updated = prev.filter((r) => r.id !== recordId);
      try {
        localStorage.setItem('capy_player_records', JSON.stringify(updated));
      } catch {}
      if (recordToDelete) {
        showFeedback(`🗑️ Rekod "${recordToDelete.name}" telah dipadam!`, true);
      }
      return updated;
    });
  }, [showFeedback]);

  const handleClearRecords = useCallback(() => {
    try {
      localStorage.removeItem('capy_player_records');
      localStorage.removeItem('capy_linear_high_scores');
      localStorage.removeItem('capy_linear_door_records');
      localStorage.removeItem('capy_linear_doors_unlocked_count');
      localStorage.removeItem('capy_player_name');
    } catch {}
    setPlayerRecords([]);
    setHighScores({ 1: 0, 2: 0, 3: 0 });
    setDoorRecords({});
    setDoorsUnlockedCount(0);
    setPlayerName('Murid Pintar');
    showFeedback('🗑️ Semua rekod telah diset semula!', true);
  }, [showFeedback]);

  useEffect(() => {
    if (status === 'TITLE' && !isMuted) {
      sounds.startTitleBgm();
    }
  }, [status, isMuted]);

  // Smooth screen transition (fade-to-black)
  const [isFadeBlack, setIsFadeBlack] = useState(false);
  const [fadeMessage, setFadeMessage] = useState('Memuatkan Babak...');

  const triggerScreenTransition = useCallback((action: () => void, message = 'Memuatkan Babak...') => {
    setFadeMessage(message);
    setIsFadeBlack(true);
    window.setTimeout(() => {
      action();
      window.setTimeout(() => {
        setIsFadeBlack(false);
      }, 180);
    }, 380);
  }, []);

  // Return to main menu with smooth fade-to-black
  const handleGoHome = useCallback(() => {
    triggerScreenTransition(() => {
      setIsClassroomOpen(false);
      setIsLevelSelectOpen(false);
      setIsScoreboardOpen(false);
      setStatus('TITLE');
    }, 'Kembali ke Menu Utama...');
  }, [triggerScreenTransition]);

  // Internal Start Game Logic
  const doStartGame = useCallback((lvl: number) => {
    // Shuffle question options every time a game starts or completes!
    shuffleAllQuestions();

    const validLevel = (lvl >= 1 && lvl <= 3 ? lvl : 1) as LevelDifficulty;
    setSelectedLevel(validLevel);
    setIsClassroomOpen(false);
    setCurrentDoorNum(1);
    setGameOverReason(undefined);
    setFeedback(null);
    setIsSpeedBoostActive(false);
    setIsSlowBoostActive(false);

    const initialLevel2Phase: Level2Phase = validLevel === 2 ? 'STUDY' : 'FLYING';
    setLevel2Phase(initialLevel2Phase);
    setLevel2TimeLeft(10); // 10s study

    setStats({
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      hearts: 5,
      maxHearts: 5,
      currentQuestionIndex: 0,
      totalQuestions: LEVEL_CONFIGS[validLevel].targetQuestions,
      level1TotalTimeLeft: 120, // Exactly 2 min
      level2Phase: initialLevel2Phase,
      level2TimeLeft: 10,
      level3DoorNumber: 1,
      orangesCollected: 0,
      hasKey: false,
    });

    setIsLevelSelectOpen(false);
    setStatus('PLAYING');

    if (!isMuted) {
      sounds.startGameBgm();
    }
  }, [isMuted]);

  // Start Game with smooth fade-to-black transition
  const startGame = useCallback((lvl: number) => {
    triggerScreenTransition(() => doStartGame(lvl), `Memulakan Tahap ${lvl}...`);
  }, [triggerScreenTransition, doStartGame]);

  const restartLevel = useCallback(() => {
    triggerScreenTransition(() => doStartGame(selectedLevel), 'Memulakan Semula...');
  }, [triggerScreenTransition, doStartGame, selectedLevel]);

  const handleNextLevel = useCallback(() => {
    if (selectedLevel < 3) {
      triggerScreenTransition(() => doStartGame((selectedLevel + 1) as LevelDifficulty), `Beralih ke Tahap ${selectedLevel + 1}...`);
    } else {
      setIsLevelSelectOpen(true);
    }
  }, [selectedLevel, triggerScreenTransition, doStartGame]);

  // Level 1: Add 60s time at the cost of 1 heart
  const handleAddLevel1Time = useCallback(() => {
    setStats((prev) => {
      if (prev.hearts <= 1) return prev;
      showFeedback('⏳ +60 Saat Ditambah! (-1 Nyawa)', true);
      sounds.playCorrect();
      return {
        ...prev,
        hearts: prev.hearts - 1,
        level1TotalTimeLeft: prev.level1TotalTimeLeft + 60,
      };
    });
  }, [showFeedback]);

  // Level 2: 10s study timer
  const advanceLevel2Phase = useCallback((nextPhase: Level2Phase) => {
    setLevel2Phase(nextPhase);
    if (nextPhase === 'STUDY') setLevel2TimeLeft(10);
    else setLevel2TimeLeft(0);
  }, []);

  const handleTriggerLevel2Study = useCallback(() => {
    setLevel2Phase('STUDY');
    setLevel2TimeLeft(10);
  }, []);

  const handleSkipLevel2Phase = useCallback(() => {
    advanceLevel2Phase('FLYING');
  }, [advanceLevel2Phase]);

  useEffect(() => {
    if (status !== 'PLAYING' || selectedLevel !== 2 || level2Phase !== 'STUDY') return;

    const interval = window.setInterval(() => {
      setLevel2TimeLeft((prev) => {
        if (prev <= 1) {
          advanceLevel2Phase('FLYING');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, selectedLevel, level2Phase, advanceLevel2Phase]);

  // Entering Level 3 Classroom (Scene switch!)
  const handleEnterClassroom = useCallback((doorNum: number) => {
    triggerScreenTransition(() => {
      setCurrentDoorNum(doorNum);
      setIsClassroomOpen(true);
    }, `Memasuki Bilik Pembelajaran Pintu ${doorNum}...`);
  }, [triggerScreenTransition]);

  const handleClassroomDeductHeart = useCallback(() => {
    setStats((prev) => {
      const newHearts = Math.max(0, prev.hearts - 1);
      if (newHearts <= 0) {
        setIsClassroomOpen(false);
        sounds.playGameOver();
        setStatus('GAME_OVER');
        setGameOverReason('Kehabisan 5 nyawa di bilik pembelajaran!');
      }
      return { ...prev, hearts: newHearts, wrongCount: prev.wrongCount + 1, streak: 0 };
    });
  }, []);

  // Solve Door and unlock exit with Golden Key
  const handleSolveDoor = useCallback((doorNum: number) => {
    // Save individual door achievement in doorRecords for the scoreboard!
    setDoorRecords((prev) => {
      const updated = {
        ...prev,
        [doorNum]: {
          isUnlocked: true,
          scoreEarned: 300,
          unlockedAt: new Date().toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' }),
        },
      };
      try {
        localStorage.setItem('capy_linear_door_records', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setDoorsUnlockedCount((prev) => {
      const newUnlocked = Math.min(4, Math.max(prev, doorNum));
      try {
        localStorage.setItem('capy_linear_doors_unlocked_count', newUnlocked.toString());
      } catch {}
      return newUnlocked;
    });

    setStats((prev) => {
      const nextCorrect = prev.correctCount + 1;
      const nextScore = prev.score + 300;
      const nextDoor = doorNum + 1;

      if (doorNum >= 4) {
        sounds.playVictory();
        checkAndSaveRecords(3, nextScore);
        triggerScreenTransition(() => {
          setIsClassroomOpen(false);
          setStatus('VICTORY');
        }, 'Menamatkan Tahap 3: Tahniah!');
        return {
          ...prev,
          correctCount: nextCorrect,
          score: nextScore,
          orangesCollected: 0,
        };
      }

      showFeedback(`🔑 Pintu ${doorNum} Dibuka dengan Kunci Emas! Terbang & Kumpul Oren Untuk Pintu ${nextDoor}!`, true);
      setCurrentDoorNum(nextDoor);
      triggerScreenTransition(() => {
        setIsClassroomOpen(false);
      }, 'Kembali ke Dunia Penerbangan...');

      return {
        ...prev,
        correctCount: nextCorrect,
        score: nextScore,
        level3DoorNumber: nextDoor,
        orangesCollected: 0,
        currentQuestionIndex: nextDoor - 1,
      };
    });
  }, [checkAndSaveRecords, showFeedback, triggerScreenTransition]);

  // Game Over
  const handleGameOver = useCallback((finalStats: GameStats, reason?: string) => {
    shuffleAllQuestions();
    setStats(finalStats);
    setGameOverReason(reason);
    checkAndSaveRecords(selectedLevel, finalStats.score);
    setStatus('GAME_OVER');
  }, [selectedLevel, checkAndSaveRecords]);

  // Victory
  const handleVictory = useCallback((finalStats: GameStats) => {
    shuffleAllQuestions();
    setStats(finalStats);
    const timeUsed = selectedLevel === 1 ? (120 - finalStats.level1TotalTimeLeft) : undefined;
    checkAndSaveRecords(selectedLevel, finalStats.score, timeUsed);
    setStatus('VICTORY');
  }, [selectedLevel, checkAndSaveRecords]);

  const handlePause = useCallback(() => {
    if (status === 'PLAYING') setStatus('PAUSED');
  }, [status]);

  const handleResume = useCallback(() => {
    if (status === 'PAUSED') setStatus('PLAYING');
  }, [status]);

  const handleToggleMute = useCallback(() => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  }, []);

  // Flight Speed Modes: NORMAL | SPEED | SLOW
  const handleToggleSpeedBoost = useCallback(() => {
    setIsSpeedBoostActive((prev) => {
      const next = !prev;
      if (next) {
        setIsSlowBoostActive(false);
        sounds.playSpeedBoost();
        showFeedback('⚡ MOD LAJU DIAKTIFKAN!', true);
      } else {
        showFeedback('✈️ MOD BIASA (KELAJUAN NORMAL)', true);
      }
      return next;
    });
  }, [showFeedback]);

  const handleSetSpeedBoost = useCallback((active: boolean) => {
    setIsSpeedBoostActive(active);
    if (active) {
      setIsSlowBoostActive(false);
      sounds.playSpeedBoost();
    }
  }, []);

  // Slow Down Boost
  const handleToggleSlowBoost = useCallback(() => {
    setIsSlowBoostActive((prev) => {
      const next = !prev;
      if (next) {
        setIsSpeedBoostActive(false);
        sounds.playSlowDown();
        showFeedback('🐢 MOD PERLAHAN DIAKTIFKAN!', true);
      } else {
        showFeedback('✈️ MOD BIASA (KELAJUAN NORMAL)', true);
      }
      return next;
    });
  }, [showFeedback]);

  const handleSetSlowBoost = useCallback((active: boolean) => {
    setIsSlowBoostActive(active);
    if (active) {
      setIsSpeedBoostActive(false);
      sounds.playSlowDown();
    }
  }, []);

  const handleSetNormalSpeed = useCallback(() => {
    setIsSpeedBoostActive(false);
    setIsSlowBoostActive(false);
    showFeedback('✈️ MOD BIASA (KELAJUAN NORMAL)', true);
  }, [showFeedback]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (status === 'PLAYING') handlePause();
        else if (status === 'PAUSED') handleResume();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status, handlePause, handleResume]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sky-100 select-none font-sans">
      {/* Game Canvas Viewport */}
      {(status === 'PLAYING' || status === 'PAUSED' || status === 'VICTORY' || status === 'GAME_OVER') && !isClassroomOpen && (
        <>
          <GameCanvas
            key={`canvas_${selectedLevel}_${currentDoorNum}`}
            levelConfig={levelConfig}
            status={status}
            initialScore={stats.score}
            initialHearts={stats.hearts}
            isSpeedBoostActive={isSpeedBoostActive}
            isSlowBoostActive={isSlowBoostActive}
            onUpdateStats={setStats}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            onShowFeedback={showFeedback}
            onEnterClassroom={handleEnterClassroom}
            onTriggerLevel2Study={handleTriggerLevel2Study}
            level2Phase={level2Phase}
            level3DoorNumber={currentDoorNum}
          />

          {/* HUD Overlay */}
          <HUD
            stats={stats}
            levelConfig={levelConfig}
            feedbackText={feedback?.text || null}
            isFeedbackCorrect={feedback?.isCorrect ?? true}
            isMuted={isMuted}
            isSpeedBoostActive={isSpeedBoostActive}
            isSlowBoostActive={isSlowBoostActive}
            onToggleSpeedBoost={handleToggleSpeedBoost}
            onSetSpeedBoost={handleSetSpeedBoost}
            onToggleSlowBoost={handleToggleSlowBoost}
            onSetSlowBoost={handleSetSlowBoost}
            onSetNormalSpeed={handleSetNormalSpeed}
            onToggleMute={handleToggleMute}
            onPause={handlePause}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
            onAddLevel1Time={handleAddLevel1Time}
            onGoHome={handleGoHome}
            level2Phase={level2Phase}
            level2TimeLeft={level2TimeLeft}
            onSkipLevel2Phase={handleSkipLevel2Phase}
            level3DoorNumber={currentDoorNum}
          />
        </>
      )}

      {/* Level 3 Themed Scene Modal (Classroom with Serious Music, matching image) */}
      {isClassroomOpen && (
        <ClassroomModal
          question={getActiveLevel3Data()[(currentDoorNum - 1) % getActiveLevel3Data().length]}
          hearts={stats.hearts}
          onDeductHeart={handleClassroomDeductHeart}
          onSolveDoor={handleSolveDoor}
          onGoHome={handleGoHome}
        />
      )}

      {/* Scoreboard Modal */}
      {isScoreboardOpen && (
        <ScoreboardModal
          onClose={() => setIsScoreboardOpen(false)}
          highScores={highScores}
          bestTimes={bestTimes}
          doorsUnlockedCount={doorsUnlockedCount}
          doorRecords={doorRecords}
          playerRecords={playerRecords}
          currentPlayerName={playerName}
          currentScore={stats.score}
          onDeleteRecord={handleDeleteSingleRecord}
        />
      )}

      {/* Title Screen */}
      {status === 'TITLE' && (
        <TitleScreen
          onStartGame={startGame}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          highScores={highScores}
          bestTimes={bestTimes}
          playerName={playerName}
          onPlayerNameChange={handlePlayerNameChange}
        />
      )}

      {/* Level Select Modal */}
      {isLevelSelectOpen && (
        <LevelSelectModal
          onSelectLevel={(lvl) => startGame(lvl)}
          onClose={() => setIsLevelSelectOpen(false)}
          highScores={highScores}
          bestTimes={bestTimes}
        />
      )}

      {/* Pause Modal */}
      {status === 'PAUSED' && (
        <PauseModal
          levelConfig={levelConfig}
          isMuted={isMuted}
          onResume={handleResume}
          onRestart={restartLevel}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onGoHome={handleGoHome}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Victory Modal */}
      {status === 'VICTORY' && (
        <VictoryModal
          stats={stats}
          levelConfig={levelConfig}
          onRestart={restartLevel}
          onNextLevel={handleNextLevel}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
          onGoHome={handleGoHome}
          playerName={playerName}
        />
      )}

      {/* Game Over Modal */}
      {status === 'GAME_OVER' && (
        <GameOverModal
          stats={stats}
          levelConfig={levelConfig}
          failedReason={gameOverReason}
          onRestart={restartLevel}
          onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
          onGoHome={handleGoHome}
        />
      )}

      {/* Smooth Fade-to-Black Scene Transition Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-slate-950 transition-opacity duration-400 ease-in-out flex flex-col items-center justify-center select-none ${
          isFadeBlack ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-amber-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-amber-300 animate-spin" style={{ animationDuration: '3.5s' }} />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-100 drop-shadow-md">
            {fadeMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
