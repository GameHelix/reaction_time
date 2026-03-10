// Game state types

export type GamePhase =
  | 'menu'        // Main menu
  | 'countdown'   // 3-2-1 countdown before game starts
  | 'waiting'     // Waiting for target to appear (random delay)
  | 'target'      // Target is visible, player should click
  | 'early'       // Player clicked too early
  | 'result'      // Round result shown briefly
  | 'gameover'    // All rounds finished, showing final results
  | 'paused';     // Game paused

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  label: string;
  rounds: number;
  minDelay: number;   // ms before target appears
  maxDelay: number;   // ms before target appears
  targetSize: number; // px
  showDistractors: boolean;
  distractorCount: number;
  color: string;
  description: string;
}

export interface RoundResult {
  round: number;
  reactionTime: number | null; // null if early click
  isEarly: boolean;
  targetPosition: { x: number; y: number };
}

export interface GameStats {
  rounds: RoundResult[];
  averageTime: number | null;
  bestTime: number | null;
  worstTime: number | null;
  earlyClicks: number;
  difficulty: Difficulty;
  completedAt: Date;
}

export interface HighScore {
  score: number; // average reaction time in ms (lower is better)
  difficulty: Difficulty;
  date: string;
  rounds: number;
}

export interface HighScores {
  easy: HighScore | null;
  medium: HighScore | null;
  hard: HighScore | null;
}

export interface TargetPosition {
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface DistractorTarget {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}
