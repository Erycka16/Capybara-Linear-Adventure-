export interface Level1Question {
  id: string;
  eq1: string;
  eq2: string;
  displayQuestion: string;
  options: string[]; // e.g. ["(5, 2)", "(4, 3)", "(2, 5)"]
  correctIndex: number;
  correctCoord: [number, number];
  explanation: string;
}

export interface Level2Question {
  id: string;
  story: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Level3ClassroomQuestion {
  doorNumber: number; // 1 to 4
  doorTitle: string;
  theme: 'library' | 'school' | 'museum' | 'sports';
  story: string;
  equationOptions: string[];
  correctEqIndex: number;
  correctPoint: [number, number];
  eq1Label: string;
  eq2Label: string;
  xRange: [number, number];
  yRange: [number, number];
  explanation: string;
}

export type LevelDifficulty = 1 | 2 | 3;

export interface LevelConfig {
  level: LevelDifficulty;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgGradient: string;
  targetQuestions: number; // 5 for L1 & L2, 4 for L3
  baseFlightSpeed: number;
  boostFlightSpeed: number;
  slowFlightSpeed: number; // For slow down button
  gravity: number;
  flapStrength: number;
  spawnDistance: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vy: number;
  rotation: number;
  wingAngle: number;
  width: number;
  height: number;
  invulnerableTime: number;
  isFlapping: boolean;
  isSpeeding: boolean;
  isSlowing: boolean;
}

export interface GateChoice {
  text: string;
  isCorrect: boolean;
  y: number;
  height: number;
  hit: boolean;
}

export interface Gate {
  id: string;
  title: string;
  subtitle: string;
  options: string[];
  correctIndex: number;
  x: number;
  width: number;
  choices: GateChoice[];
  passed: boolean;
  resolved: boolean;
  pulseOffset: number;
  isLocked: boolean;
  isClassroomDoor?: boolean;
  doorNumber?: number;
}

export interface OrangeFruit {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  bobOffset: number;
}

// Extra collectible star for bonus score (+50 pts) across all levels
export interface BonusStar {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  bobOffset: number;
}

// Extra storm hazard cloud that knocks Capy and deducts 1 heart
export interface HazardCloud {
  id: string;
  x: number;
  y: number;
  radius: number;
  hit: boolean;
  bobOffset: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape: 'circle' | 'feather' | 'star' | 'speedLine';
}

export type GameStatus = 'TITLE' | 'LEVEL_SELECT' | 'PLAYING' | 'CLASSROOM' | 'PAUSED' | 'GAME_OVER' | 'VICTORY';

export type Level2Phase = 'STUDY' | 'FLYING';

export interface DoorRecord {
  doorNumber: number;
  doorTitle: string;
  isUnlocked: boolean;
  scoreEarned: number;
  unlockedAt?: string;
}

export interface LevelScoreRecord {
  level: number;
  score: number;
  heartsLeft: number;
  completedAt: string;
  timeUsed?: number; // for level 1
}

export interface GameStats {
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  wrongCount: number;
  hearts: number; // 5 Nyawa
  maxHearts: number;
  currentQuestionIndex: number;
  totalQuestions: number;

  // Level 1: exactly 2 minutes (120s) total timer
  level1TotalTimeLeft: number;

  // Level 2: 10s study timer
  level2Phase: Level2Phase;
  level2TimeLeft: number;

  // Level 3: 4 doors progression
  level3DoorNumber: number; // 1 to 4
  orangesCollected: number;
  hasKey: boolean;
}
