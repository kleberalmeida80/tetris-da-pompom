import { useRef } from 'react';
import { SFX_URLS } from '../constants';

export const useSoundEffects = () => {
  const sounds = useRef<Record<string, HTMLAudioElement>>({});

  const playSound = (key: keyof typeof SFX_URLS) => {
    if (!sounds.current[key]) {
      sounds.current[key] = new Audio(SFX_URLS[key]);
      sounds.current[key].volume = 0.5;
    }
    
    const audio = sounds.current[key];
    audio.currentTime = 0;
    audio.play().catch(e => console.log("SFX play blocked", e));
  };

  return {
    playRotate: () => playSound('rotate'),
    playLock: () => playSound('lock'),
    playClear: () => playSound('clear'),
    playGameOver: () => playSound('gameOver'),
  };
};
