'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GamePhase, Difficulty, TargetPosition, DistractorTarget } from '@/types/game';
import { DIFFICULTY_CONFIGS } from '@/constants/game';

interface GameAreaProps {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  difficulty: Difficulty;
  targetPosition: TargetPosition;
  distractors: DistractorTarget[];
  lastReactionTime: number | null;
  onAreaClick: (isTarget: boolean) => void;
  gameAreaRef: React.RefObject<HTMLDivElement | null>;
}

export const GameArea = ({
  phase,
  currentRound,
  totalRounds,
  difficulty,
  targetPosition,
  distractors,
  lastReactionTime,
  onAreaClick,
  gameAreaRef,
}: GameAreaProps) => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Handle click on the game area background
  const handleAreaClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Only handle clicks directly on the area (not bubbled from target)
    if ((e.target as HTMLElement).dataset.istTarget === 'true') return;
    onAreaClick(false);
  }, [onAreaClick]);

  const handleTargetClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onAreaClick(true);
  }, [onAreaClick]);

  return (
    <div
      ref={gameAreaRef}
      onClick={handleAreaClick}
      onTouchEnd={handleAreaClick}
      className="relative w-full flex-1 overflow-hidden no-select cursor-crosshair"
      style={{ minHeight: '60vh' }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Phase: Waiting */}
      <AnimatePresence>
        {phase === 'waiting' && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-gray-600 text-sm tracking-widest uppercase mb-2"
              >
                Wait for it...
              </motion.div>
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-4 h-4 rounded-full mx-auto"
                style={{ backgroundColor: config.color }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Early click */}
      <AnimatePresence>
        {phase === 'early' && (
          <motion.div
            key="early"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-red-900/10"
          >
            <div className="text-center">
              <motion.div
                animate={{ x: [-5, 5, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="text-4xl md:text-6xl font-bold text-red-500 mb-2"
                style={{ textShadow: '0 0 20px #ff4444' }}
              >
                TOO EARLY!
              </motion.div>
              <p className="text-red-400/60 text-sm">Next round starting...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Result */}
      <AnimatePresence>
        {phase === 'result' && lastReactionTime !== null && (
          <motion.div
            key="result"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-5xl md:text-7xl font-bold neon-text-green"
              >
                {lastReactionTime}
                <span className="text-2xl ml-1 text-green-400/70">ms</span>
              </motion.div>
              <p className="text-gray-500 text-sm mt-2">Next round...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Distractors */}
      <AnimatePresence>
        {phase === 'target' && distractors.map((d) => (
          <motion.div
            key={d.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); onAreaClick(false); }}
            onTouchEnd={(e) => { e.stopPropagation(); onAreaClick(false); }}
            className="absolute rounded-full cursor-pointer"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              backgroundColor: d.color,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 15px ${d.color}88`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Real Target */}
      <AnimatePresence>
        {phase === 'target' && (
          <motion.button
            key="target"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            data-ist-target="true"
            onClick={handleTargetClick}
            onTouchEnd={handleTargetClick}
            className="absolute rounded-full cursor-pointer focus:outline-none"
            style={{
              left: `${targetPosition.x}%`,
              top: `${targetPosition.y}%`,
              width: config.targetSize,
              height: config.targetSize,
              backgroundColor: config.color,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 30px ${config.color}, 0 0 60px ${config.color}66`,
              zIndex: 10,
            }}
          >
            {/* Inner ring */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: config.color }}
            />
            {/* Center dot */}
            <div
              className="absolute top-1/2 left-1/2 w-1/4 h-1/4 rounded-full"
              style={{
                backgroundColor: '#fff',
                transform: 'translate(-50%, -50%)',
                opacity: 0.8,
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Round progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: totalRounds }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < currentRound
                ? config.color
                : i === currentRound - 1 && phase === 'target'
                ? config.color
                : '#2a2a3a',
              boxShadow: i < currentRound ? `0 0 6px ${config.color}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};
