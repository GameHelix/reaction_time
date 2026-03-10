'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  value: number;
}

export const Countdown = ({ value }: CountdownProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-dark-bg/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-center"
        >
          <div
            className="text-8xl md:text-[12rem] font-bold"
            style={{
              color: value === 1 ? '#ff0080' : value === 2 ? '#ffee00' : '#00ff88',
              textShadow: `0 0 40px currentColor, 0 0 80px currentColor`,
            }}
          >
            {value}
          </div>
          <p className="text-gray-500 text-sm tracking-widest uppercase mt-4">
            {value === 1 ? 'Get Ready!' : 'Loading...'}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
