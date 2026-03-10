'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { MainMenu } from '@/components/MainMenu';
import { GameArea } from '@/components/GameArea';
import { HUD } from '@/components/HUD';
import { Countdown } from '@/components/Countdown';
import { PauseScreen } from '@/components/PauseScreen';
import { GameOver } from '@/components/GameOver';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { useHighScores } from '@/hooks/useHighScores';

export default function Home() {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { playSound, soundEnabled, toggleSound } = useSound();
  const { highScores, updateHighScore } = useHighScores();

  const {
    phase,
    currentRound,
    totalRounds,
    rounds,
    targetPosition,
    distractors,
    countdownValue,
    difficulty,
    lastReactionTime,
    gameStats,
    startGame,
    handleClick,
    restartGame,
    goToMenu,
    togglePause,
    changeDifficulty,
  } = useGameState(gameAreaRef, playSound);

  // Track new high score only when gameStats changes
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  useEffect(() => {
    if (gameStats) {
      const isNew = updateHighScore(gameStats);
      setIsNewHighScore(isNew);
    } else {
      setIsNewHighScore(false);
    }
  }, [gameStats]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard controls: Space = pause, Escape = menu
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'waiting' || phase === 'paused') togglePause();
      }
      if (e.code === 'Escape') {
        if (phase === 'paused') goToMenu();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, togglePause, goToMenu]);

  const handleStart = useCallback(() => {
    startGame(difficulty);
  }, [startGame, difficulty]);

  const handleAreaClick = useCallback((isTarget: boolean) => {
    handleClick(isTarget, gameAreaRef);
  }, [handleClick]);

  return (
    <main className="min-h-screen bg-dark-bg relative overflow-hidden flex flex-col">
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Main Menu */}
      <AnimatePresence>
        {phase === 'menu' && (
          <MainMenu
            selectedDifficulty={difficulty}
            onDifficultyChange={changeDifficulty}
            onStart={handleStart}
            highScores={highScores}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}
      </AnimatePresence>

      {/* Game UI */}
      <AnimatePresence>
        {phase !== 'menu' && phase !== 'gameover' && (
          <div className="flex flex-col flex-1 relative z-10">
            <HUD
              phase={phase}
              currentRound={currentRound}
              totalRounds={totalRounds}
              difficulty={difficulty}
              rounds={rounds}
              onPause={togglePause}
              soundEnabled={soundEnabled}
              onToggleSound={toggleSound}
            />
            <GameArea
              phase={phase}
              currentRound={currentRound}
              totalRounds={totalRounds}
              difficulty={difficulty}
              targetPosition={targetPosition}
              distractors={distractors}
              lastReactionTime={lastReactionTime}
              onAreaClick={handleAreaClick}
              gameAreaRef={gameAreaRef}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === 'countdown' && <Countdown value={countdownValue} />}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {phase === 'paused' && (
          <PauseScreen onResume={togglePause} onQuit={goToMenu} />
        )}
      </AnimatePresence>

      {/* Game Over screen */}
      <AnimatePresence>
        {phase === 'gameover' && gameStats && (
          <GameOver
            stats={gameStats}
            highScores={highScores}
            isNewHighScore={isNewHighScore}
            onRestart={restartGame}
            onMenu={goToMenu}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
