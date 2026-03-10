'use client';

import { motion } from 'framer-motion';

interface PauseScreenProps {
  onResume: () => void;
  onQuit: () => void;
}

export const PauseScreen = ({ onResume, onQuit }: PauseScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-dark-bg/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card neon-border-blue p-8 text-center max-w-sm w-full mx-4"
      >
        <h2 className="text-3xl font-bold neon-text-blue mb-6 tracking-wider">PAUSED</h2>
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onResume}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-neon py-3 px-8 rounded-xl font-bold text-dark-bg tracking-wider uppercase"
            style={{ backgroundColor: '#00d4ff', boxShadow: '0 0 20px #00d4ff44' }}
          >
            ▶ Resume
          </motion.button>
          <motion.button
            onClick={onQuit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-neon py-3 px-8 rounded-xl font-bold text-gray-400 border border-gray-700 hover:border-gray-500 tracking-wider uppercase"
          >
            Quit to Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
