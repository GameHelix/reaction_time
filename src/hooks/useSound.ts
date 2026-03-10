'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SETTINGS_KEY } from '@/constants/game';

type SoundType = 'countdown' | 'target' | 'success' | 'early' | 'gameover' | 'click' | 'hover';

interface SoundSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
}

// Synthesized sounds using Web Audio API
const createAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
};

const playTone = (
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3,
  delay: number = 0
) => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  oscillator.start(ctx.currentTime + delay);
  oscillator.stop(ctx.currentTime + delay + duration);
};

const SOUND_CONFIGS: Record<SoundType, (ctx: AudioContext, volume: number) => void> = {
  countdown: (ctx, vol) => {
    playTone(ctx, 440, 0.15, 'sine', vol * 0.4);
  },
  target: (ctx, vol) => {
    playTone(ctx, 880, 0.05, 'square', vol * 0.2);
    playTone(ctx, 1100, 0.08, 'sine', vol * 0.3, 0.05);
  },
  success: (ctx, vol) => {
    playTone(ctx, 523, 0.1, 'sine', vol * 0.4);
    playTone(ctx, 659, 0.1, 'sine', vol * 0.4, 0.1);
    playTone(ctx, 784, 0.2, 'sine', vol * 0.4, 0.2);
  },
  early: (ctx, vol) => {
    playTone(ctx, 200, 0.3, 'sawtooth', vol * 0.3);
    playTone(ctx, 150, 0.3, 'sawtooth', vol * 0.3, 0.1);
  },
  gameover: (ctx, vol) => {
    [523, 659, 784, 1046].forEach((freq, i) => {
      playTone(ctx, freq, 0.15, 'sine', vol * 0.35, i * 0.15);
    });
  },
  click: (ctx, vol) => {
    playTone(ctx, 600, 0.05, 'square', vol * 0.1);
  },
  hover: (ctx, vol) => {
    playTone(ctx, 800, 0.03, 'sine', vol * 0.05);
  },
};

export const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [settings, setSettings] = useState<SoundSettings>({
    soundEnabled: true,
    musicEnabled: false,
    volume: 0.7,
  });

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: SoundSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch {}
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((sound: string) => {
    if (!settings.soundEnabled) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;
    try {
      const soundType = sound as SoundType;
      SOUND_CONFIGS[soundType]?.(ctx, settings.volume);
    } catch {}
  }, [settings.soundEnabled, settings.volume, ensureAudioContext]);

  const toggleSound = useCallback(() => {
    saveSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  }, [settings, saveSettings]);

  const toggleMusic = useCallback(() => {
    saveSettings({ ...settings, musicEnabled: !settings.musicEnabled });
  }, [settings, saveSettings]);

  const setVolume = useCallback((volume: number) => {
    saveSettings({ ...settings, volume });
  }, [settings, saveSettings]);

  return {
    playSound,
    soundEnabled: settings.soundEnabled,
    musicEnabled: settings.musicEnabled,
    volume: settings.volume,
    toggleSound,
    toggleMusic,
    setVolume,
  };
};
