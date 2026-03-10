'use client';

import { useCallback, useEffect, useState } from 'react';
import { HighScores, GameStats } from '@/types/game';
import { HIGH_SCORES_KEY } from '@/constants/game';

const defaultHighScores: HighScores = {
  easy: null,
  medium: null,
  hard: null,
};

export const useHighScores = () => {
  const [highScores, setHighScores] = useState<HighScores>(defaultHighScores);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(HIGH_SCORES_KEY);
      if (saved) {
        setHighScores(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const updateHighScore = useCallback((stats: GameStats): boolean => {
    if (!stats.averageTime) return false;
    const diff = stats.difficulty;
    const current = highScores[diff];

    // Lower is better for reaction time
    if (!current || stats.averageTime < current.score) {
      const newScores: HighScores = {
        ...highScores,
        [diff]: {
          score: stats.averageTime,
          difficulty: diff,
          date: new Date().toLocaleDateString(),
          rounds: stats.rounds.length,
        },
      };
      setHighScores(newScores);
      try {
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(newScores));
      } catch {}
      return true; // New high score!
    }
    return false;
  }, [highScores]);

  const clearHighScores = useCallback(() => {
    setHighScores(defaultHighScores);
    try {
      localStorage.removeItem(HIGH_SCORES_KEY);
    } catch {}
  }, []);

  return { highScores, updateHighScore, clearHighScores };
};
