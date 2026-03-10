'use client';

import { motion } from 'framer-motion';
import { Difficulty } from '@/types/game';
import { DIFFICULTY_CONFIGS } from '@/constants/game';
import { HighScores } from '@/types/game';

interface MainMenuProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStart: () => void;
  highScores: HighScores;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MainMenu = ({
  selectedDifficulty,
  onDifficultyChange,
  onStart,
  highScores,
  soundEnabled,
  onToggleSound,
}: MainMenuProps) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 relative z-10">
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold neon-text-green mb-2 tracking-wider"
          animate={{ textShadow: ['0 0 10px #00ff88, 0 0 20px #00ff88', '0 0 20px #00ff88, 0 0 40px #00ff88, 0 0 60px #00ff88', '0 0 10px #00ff88, 0 0 20px #00ff88'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          REFLEX
        </motion.h1>
        <motion.h1
          className="text-5xl md:text-7xl font-bold neon-text-blue tracking-wider"
          animate={{ textShadow: ['0 0 10px #00d4ff, 0 0 20px #00d4ff', '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff', '0 0 10px #00d4ff, 0 0 20px #00d4ff'] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          ARENA
        </motion.h1>
        <p className="text-gray-400 mt-4 text-sm md:text-base tracking-widest uppercase">
          Test your reaction time
        </p>
      </motion.div>

      {/* Difficulty Selection */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-lg mb-8"
      >
        <p className="text-center text-gray-400 text-xs tracking-widest uppercase mb-4">
          Select Difficulty
        </p>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map((diff) => {
            const config = DIFFICULTY_CONFIGS[diff];
            const hs = highScores[diff];
            const isSelected = selectedDifficulty === diff;
            return (
              <motion.button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`btn-neon relative p-3 md:p-4 rounded-xl border transition-all duration-300 text-center ${
                  isSelected
                    ? 'border-opacity-100 bg-opacity-20'
                    : 'border-gray-700 bg-dark-card hover:border-gray-500'
                }`}
                style={isSelected ? {
                  borderColor: config.color,
                  backgroundColor: `${config.color}15`,
                  boxShadow: `0 0 20px ${config.color}30`,
                } : {}}
              >
                <div
                  className="text-base md:text-lg font-bold mb-1"
                  style={{ color: isSelected ? config.color : '#888' }}
                >
                  {config.label}
                </div>
                <div className="text-gray-500 text-xs mb-2">{config.rounds} rounds</div>
                {hs && (
                  <div className="text-xs" style={{ color: config.color }}>
                    Best: {hs.score}ms
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
        <p className="text-center text-gray-600 text-xs mt-3">
          {DIFFICULTY_CONFIGS[selectedDifficulty].description}
        </p>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5, type: 'spring' }}
        className="mb-8"
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-neon px-12 py-4 text-xl font-bold rounded-xl tracking-widest uppercase transition-all duration-300"
          style={{
            color: '#0a0a0f',
            backgroundColor: '#00ff88',
            boxShadow: '0 0 20px #00ff88, 0 0 40px #00ff8844',
          }}
        >
          START GAME
        </motion.button>
      </motion.div>

      {/* High Scores */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="glass-card p-4 w-full max-w-lg mb-6"
      >
        <h3 className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">
          High Scores (Best Avg)
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          {difficulties.map(diff => {
            const hs = highScores[diff];
            const config = DIFFICULTY_CONFIGS[diff];
            return (
              <div key={diff}>
                <div className="text-xs text-gray-500 mb-1">{config.label}</div>
                <div className="text-sm font-bold" style={{ color: hs ? config.color : '#444' }}>
                  {hs ? `${hs.score}ms` : '---'}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex items-center gap-6 text-xs text-gray-600"
      >
        <span>CLICK / TAP target</span>
        <span>|</span>
        <span>SPACE to pause</span>
        <span>|</span>
        <button
          onClick={onToggleSound}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          Sound: {soundEnabled ? '🔊 ON' : '🔇 OFF'}
        </button>
      </motion.div>
    </div>
  );
};
