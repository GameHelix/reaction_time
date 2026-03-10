import { DifficultyConfig } from '@/types/game';

// Difficulty configurations
export const DIFFICULTY_CONFIGS: Record<string, DifficultyConfig> = {
  easy: {
    label: 'Easy',
    rounds: 5,
    minDelay: 1500,
    maxDelay: 4000,
    targetSize: 120,
    showDistractors: false,
    distractorCount: 0,
    color: '#00ff88',
    description: 'Large target, longer wait, no distractors',
  },
  medium: {
    label: 'Medium',
    rounds: 7,
    minDelay: 1000,
    maxDelay: 3000,
    targetSize: 80,
    showDistractors: true,
    distractorCount: 2,
    color: '#00d4ff',
    description: 'Medium target, moderate wait, 2 distractors',
  },
  hard: {
    label: 'Hard',
    rounds: 10,
    minDelay: 500,
    maxDelay: 2500,
    targetSize: 50,
    showDistractors: true,
    distractorCount: 5,
    color: '#ff0080',
    description: 'Small target, short wait, 5 distractors',
  },
};

// Reaction time rating thresholds (ms)
export const RATING_THRESHOLDS = {
  legendary: 150,
  excellent: 200,
  great: 250,
  good: 300,
  average: 400,
  slow: 500,
};

export const getRating = (avgMs: number): { label: string; color: string; emoji: string } => {
  if (avgMs < RATING_THRESHOLDS.legendary) return { label: 'LEGENDARY', color: '#ffee00', emoji: '⚡' };
  if (avgMs < RATING_THRESHOLDS.excellent) return { label: 'EXCELLENT', color: '#00ff88', emoji: '🏆' };
  if (avgMs < RATING_THRESHOLDS.great) return { label: 'GREAT', color: '#00d4ff', emoji: '🎯' };
  if (avgMs < RATING_THRESHOLDS.good) return { label: 'GOOD', color: '#bf00ff', emoji: '👍' };
  if (avgMs < RATING_THRESHOLDS.average) return { label: 'AVERAGE', color: '#ff8800', emoji: '😐' };
  if (avgMs < RATING_THRESHOLDS.slow) return { label: 'SLOW', color: '#ff4444', emoji: '🐢' };
  return { label: 'VERY SLOW', color: '#ff0000', emoji: '🦥' };
};

// Distractor colors (not the real target color)
export const DISTRACTOR_COLORS = ['#ff4444', '#ff8800', '#8844ff', '#ff44aa', '#44aaff'];

// Local storage key
export const HIGH_SCORES_KEY = 'reflex-arena-high-scores';
export const SETTINGS_KEY = 'reflex-arena-settings';

// Game area padding (px) to keep targets away from edges
export const GAME_AREA_PADDING = 80;
