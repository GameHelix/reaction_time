'use client';

import { motion } from 'framer-motion';
import { GamePhase, Difficulty, RoundResult } from '@/types/game';
import { DIFFICULTY_CONFIGS } from '@/constants/game';

interface HUDProps {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  difficulty: Difficulty;
  rounds: RoundResult[];
  onPause: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HUD = ({
  phase,
  currentRound,
  totalRounds,
  difficulty,
  rounds,
  onPause,
  soundEnabled,
  onToggleSound,
}: HUDProps) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const validTimes = rounds.filter(r => !r.isEarly && r.reactionTime).map(r => r.reactionTime as number);
  const avgTime = validTimes.length > 0
    ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length)
    : null;

  return (
    <div className="flex items-center justify-between px-4 py-3 glass-card mx-4 mt-4 relative z-20">
      {/* Round counter */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Round</span>
        <span className="font-bold" style={{ color: config.color }}>
          {Math.min(currentRound, totalRounds)}
        </span>
        <span className="text-gray-600 text-xs">/ {totalRounds}</span>
      </div>

      {/* Average time */}
      <div className="text-center">
        <motion.div
          key={avgTime}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold"
          style={{ color: avgTime ? config.color : '#444' }}
        >
          {avgTime ? `${avgTime}ms avg` : 'avg: ---'}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSound}
          className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          title="Toggle sound"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        {(phase === 'waiting' || phase === 'paused') && (
          <button
            onClick={onPause}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xs uppercase tracking-wider"
          >
            {phase === 'paused' ? '▶ Resume' : '⏸ Pause'}
          </button>
        )}
      </div>
    </div>
  );
};
