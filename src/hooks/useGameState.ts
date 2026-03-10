'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GamePhase, Difficulty, RoundResult, GameStats, TargetPosition, DistractorTarget } from '@/types/game';
import { DIFFICULTY_CONFIGS, DISTRACTOR_COLORS, GAME_AREA_PADDING } from '@/constants/game';

interface GameState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  rounds: RoundResult[];
  targetPosition: TargetPosition;
  distractors: DistractorTarget[];
  countdownValue: number;
  roundStartTime: number | null;
  difficulty: Difficulty;
  lastReactionTime: number | null;
  gameStats: GameStats | null;
  isPaused: boolean;
}

interface UseGameStateReturn extends GameState {
  startGame: (difficulty: Difficulty) => void;
  handleClick: (isTarget: boolean, gameAreaRef: React.RefObject<HTMLDivElement | null>) => void;
  restartGame: () => void;
  goToMenu: () => void;
  togglePause: () => void;
  changeDifficulty: (difficulty: Difficulty) => void;
}

const generateTargetPosition = (gameAreaRef: React.RefObject<HTMLDivElement | null>, targetSize: number): TargetPosition => {
  const el = gameAreaRef.current;
  if (!el) return { x: 50, y: 50 };
  const rect = el.getBoundingClientRect();
  const halfSize = targetSize / 2;
  const pad = GAME_AREA_PADDING;
  const xMin = ((pad + halfSize) / rect.width) * 100;
  const xMax = ((rect.width - pad - halfSize) / rect.width) * 100;
  const yMin = ((pad + halfSize) / rect.height) * 100;
  const yMax = ((rect.height - pad - halfSize) / rect.height) * 100;
  return {
    x: Math.random() * (xMax - xMin) + xMin,
    y: Math.random() * (yMax - yMin) + yMin,
  };
};

const generateDistractors = (
  count: number,
  targetPos: TargetPosition,
  gameAreaRef: React.RefObject<HTMLDivElement | null>
): DistractorTarget[] => {
  return Array.from({ length: count }, (_, i) => {
    let x: number, y: number;
    let attempts = 0;
    // Ensure distractors don't overlap with target
    do {
      x = Math.random() * 80 + 10;
      y = Math.random() * 80 + 10;
      attempts++;
    } while (
      Math.sqrt(Math.pow(x - targetPos.x, 2) + Math.pow(y - targetPos.y, 2)) < 15 &&
      attempts < 20
    );
    return {
      id: i,
      x,
      y,
      color: DISTRACTOR_COLORS[i % DISTRACTOR_COLORS.length],
      size: Math.random() * 30 + 40, // 40-70px
    };
  });
};

type SoundCallback = (sound: string) => void;

export const useGameState = (
  gameAreaRef: React.RefObject<HTMLDivElement | null>,
  onSound: SoundCallback
): UseGameStateReturn => {
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [targetPosition, setTargetPosition] = useState<TargetPosition>({ x: 50, y: 50 });
  const [distractors, setDistractors] = useState<DistractorTarget[]>([]);
  const [countdownValue, setCountdownValue] = useState(3);
  const [roundStartTime, setRoundStartTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const difficultyRef = useRef<Difficulty>('medium');
  const phaseRef = useRef<GamePhase>('menu');
  const roundsRef = useRef<RoundResult[]>([]);
  const currentRoundRef = useRef(0);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  phaseRef.current = phase;
  difficultyRef.current = difficulty;
  roundsRef.current = rounds;
  currentRoundRef.current = currentRound;

  // Cleanup timers
  const clearWaitingTimer = useCallback(() => {
    if (waitingTimerRef.current) {
      clearTimeout(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
  }, []);

  const showTarget = useCallback((roundNum: number) => {
    const config = DIFFICULTY_CONFIGS[difficultyRef.current];
    const pos = generateTargetPosition(gameAreaRef, config.targetSize);
    const dist = config.showDistractors
      ? generateDistractors(config.distractorCount, pos, gameAreaRef)
      : [];
    setTargetPosition(pos);
    setDistractors(dist);
    setRoundStartTime(Date.now());
    setPhase('target');
    onSound('target');
  }, [gameAreaRef, onSound]);

  const scheduleTarget = useCallback((roundNum: number) => {
    const config = DIFFICULTY_CONFIGS[difficultyRef.current];
    const delay = Math.random() * (config.maxDelay - config.minDelay) + config.minDelay;
    clearWaitingTimer();
    setPhase('waiting');
    waitingTimerRef.current = setTimeout(() => {
      showTarget(roundNum);
    }, delay);
  }, [clearWaitingTimer, showTarget]);

  const startCountdown = useCallback((diff: Difficulty) => {
    setPhase('countdown');
    setCountdownValue(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdownValue(count);
      onSound('countdown');
      if (count <= 0) {
        clearInterval(interval);
        // Start round 1
        setTimeout(() => {
          scheduleTarget(1);
          setCurrentRound(1);
        }, 400);
      }
    }, 1000);
  }, [scheduleTarget, onSound]);

  const startGame = useCallback((diff: Difficulty) => {
    clearWaitingTimer();
    const config = DIFFICULTY_CONFIGS[diff];
    setDifficulty(diff);
    difficultyRef.current = diff;
    setTotalRounds(config.rounds);
    setCurrentRound(0);
    setRounds([]);
    roundsRef.current = [];
    setGameStats(null);
    setLastReactionTime(null);
    setIsPaused(false);
    startCountdown(diff);
  }, [startCountdown, clearWaitingTimer]);

  const finishGame = useCallback((finalRounds: RoundResult[]) => {
    const validTimes = finalRounds.filter(r => !r.isEarly && r.reactionTime !== null).map(r => r.reactionTime as number);
    const avgTime = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : null;
    const stats: GameStats = {
      rounds: finalRounds,
      averageTime: avgTime,
      bestTime: validTimes.length > 0 ? Math.min(...validTimes) : null,
      worstTime: validTimes.length > 0 ? Math.max(...validTimes) : null,
      earlyClicks: finalRounds.filter(r => r.isEarly).length,
      difficulty: difficultyRef.current,
      completedAt: new Date(),
    };
    setGameStats(stats);
    setPhase('gameover');
    onSound('gameover');
  }, [onSound]);

  const handleClick = useCallback((isTarget: boolean, areaRef: React.RefObject<HTMLDivElement | null>) => {
    const currentPhase = phaseRef.current;

    if (currentPhase === 'waiting') {
      // Clicked too early
      clearWaitingTimer();
      onSound('early');
      const earlyResult: RoundResult = {
        round: currentRoundRef.current,
        reactionTime: null,
        isEarly: true,
        targetPosition: { x: 50, y: 50 },
      };
      const newRounds = [...roundsRef.current, earlyResult];
      setRounds(newRounds);
      roundsRef.current = newRounds;
      setLastReactionTime(null);
      setPhase('early');

      const totalRoundsVal = DIFFICULTY_CONFIGS[difficultyRef.current].rounds;
      setTimeout(() => {
        if (currentRoundRef.current >= totalRoundsVal) {
          finishGame(newRounds);
        } else {
          const nextRound = currentRoundRef.current + 1;
          setCurrentRound(nextRound);
          scheduleTarget(nextRound);
        }
      }, 1200);
    } else if (currentPhase === 'target' && isTarget) {
      // Correct click on target
      const now = Date.now();
      const reactionTime = roundStartTime ? now - roundStartTime : 0;
      onSound('success');
      setLastReactionTime(reactionTime);
      const result: RoundResult = {
        round: currentRoundRef.current,
        reactionTime,
        isEarly: false,
        targetPosition: { x: 50, y: 50 },
      };
      const newRounds = [...roundsRef.current, result];
      setRounds(newRounds);
      roundsRef.current = newRounds;
      setPhase('result');

      const totalRoundsVal = DIFFICULTY_CONFIGS[difficultyRef.current].rounds;
      setTimeout(() => {
        if (currentRoundRef.current >= totalRoundsVal) {
          finishGame(newRounds);
        } else {
          const nextRound = currentRoundRef.current + 1;
          setCurrentRound(nextRound);
          scheduleTarget(nextRound);
        }
      }, 1000);
    }
    // Clicks on distractors or background during 'target' phase are ignored (they're not isTarget)
  }, [clearWaitingTimer, roundStartTime, scheduleTarget, finishGame, onSound]);

  const togglePause = useCallback(() => {
    if (phase === 'waiting') {
      setIsPaused(true);
      setPhase('paused');
      clearWaitingTimer();
    } else if (phase === 'paused') {
      setIsPaused(false);
      scheduleTarget(currentRound);
    }
  }, [phase, currentRound, clearWaitingTimer, scheduleTarget]);

  const restartGame = useCallback(() => {
    startGame(difficulty);
  }, [difficulty, startGame]);

  const goToMenu = useCallback(() => {
    clearWaitingTimer();
    setPhase('menu');
    setGameStats(null);
    setRounds([]);
    roundsRef.current = [];
    setCurrentRound(0);
    setIsPaused(false);
  }, [clearWaitingTimer]);

  const changeDifficulty = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearWaitingTimer();
  }, [clearWaitingTimer]);

  return {
    phase,
    currentRound,
    totalRounds,
    rounds,
    targetPosition,
    distractors,
    countdownValue,
    roundStartTime,
    difficulty,
    lastReactionTime,
    gameStats,
    isPaused,
    startGame,
    handleClick,
    restartGame,
    goToMenu,
    togglePause,
    changeDifficulty,
  };
};
