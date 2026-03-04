import { useState, useEffect, useRef } from 'react';
import { MUSIC_TRACKS } from '../constants';

export const useMusic = () => {
  const [currentTrackId, setCurrentTrackId] = useState(() => {
    return localStorage.getItem('tetris-music-track') || 'none';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const track = MUSIC_TRACKS.find(t => t.id === currentTrackId);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (track && track.url) {
      audioRef.current = new Audio(track.url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
      
      // We need a user interaction to play, so we handle it in the App
    }

    localStorage.setItem('tetris-music-track', currentTrackId);
  }, [currentTrackId]);

  const playMusic = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return {
    currentTrackId,
    setCurrentTrackId,
    playMusic,
    stopMusic
  };
};
