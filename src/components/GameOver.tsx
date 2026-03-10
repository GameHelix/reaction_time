'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStats, HighScores } from '@/types/game';
import { DIFFICULTY_CONFIGS, getRating } from '@/constants/game';

interface GameOverProps {
  stats: GameStats;
  highScores: HighScores;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOver = ({ stats, highScores, isNewHighScore, onRestart, onMenu }: GameOverProps) => {
  const config = DIFFICULTY_CONFIGS[stats.difficulty];
  const rating = stats.averageTime ? getRating(stats.averageTime) : null;
  const [showRounds, setShowRounds] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowRounds(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto py-8"
      style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div className="w-full max-w-lg mx-4">
        {/* New High Score banner */}
        <AnimatePresence>
          {isNewHighScore && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-xl font-bold tracking-widest"
                style={{ color: '#ffee00', textShadow: '0 0 20px #ffee00' }}
              >
                ⚡ NEW HIGH SCORE! ⚡
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main result card */}
        <motion.div
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass-card p-6 mb-4"
          style={{ border: `1px solid ${config.color}33` }}
        >
          <h2 className="text-center text-sm uppercase tracking-widest text-gray-500 mb-1">
            {config.label} Mode Complete
          </h2>

          {/* Average time - big display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="text-center my-4"
          >
            {stats.averageTime ? (
              <>
                <div
                  className="text-6xl md:text-7xl font-bold"
                  style={{ color: config.color, textShadow: `0 0 30px ${config.color}` }}
                >
                  {stats.averageTime}
                </div>
                <div className="text-gray-400 text-sm mt-1">ms average</div>
              </>
            ) : (
              <div className="text-4xl font-bold text-red-400">No valid rounds</div>
            )}
          </motion.div>

          {/* Rating */}
          {rating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-4"
            >
              <span
                className="text-2xl font-bold tracking-widest"
                style={{ color: rating.color, textShadow: `0 0 15px ${rating.color}` }}
              >
                {rating.emoji} {rating.label}
              </span>
            </motion.div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Best', value: stats.bestTime ? `${stats.bestTime}ms` : '---', color: '#00ff88' },
              { label: 'Worst', value: stats.worstTime ? `${stats.worstTime}ms` : '---', color: '#ff4444' },
              { label: 'Early', value: stats.earlyClicks.toString(), color: '#ff8800' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="glass-card p-3 rounded-xl"
              >
                <div className="text-xs text-gray-500 uppercase mb-1">{item.label}</div>
                <div className="font-bold text-sm" style={{ color: item.color }}>{item.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Round-by-round breakdown */}
        <AnimatePresence>
          {showRounds && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-card p-4 mb-4"
            >
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Round Results</h3>
              <div className="grid gap-1">
                {stats.rounds.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex justify-between items-center text-sm py-1 border-b border-gray-800 last:border-0"
                  >
                    <span className="text-gray-500">Round {r.round}</span>
                    {r.isEarly ? (
                      <span className="text-red-400 text-xs">EARLY CLICK</span>
                    ) : (
                      <span style={{ color: config.color }}>{r.reactionTime}ms</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <motion.button
            onClick={onRestart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-neon flex-1 py-4 rounded-xl font-bold text-dark-bg tracking-wider uppercase"
            style={{ backgroundColor: config.color, boxShadow: `0 0 20px ${config.color}44` }}
          >
            Play Again
          </motion.button>
          <motion.button
            onClick={onMenu}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-neon py-4 px-6 rounded-xl font-bold text-gray-400 border border-gray-700 hover:border-gray-500 tracking-wider uppercase"
          >
            Menu
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
