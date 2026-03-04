import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCcw, ArrowDownToLine, Box } from 'lucide-react';

interface ControlsProps {
  onMove: (dir: { x: number, y: number }) => void;
}

const Controls: React.FC<ControlsProps> = ({ onMove }) => {
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const lastMoveRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    const threshold = 30;
    const now = Date.now();

    if (now - lastMoveRef.current > 100) {
      if (Math.abs(dx) > threshold) {
        onMove({ x: dx > 0 ? 1 : -1, y: 0 });
        touchStartRef.current.x = touch.clientX;
        lastMoveRef.current = now;
      } else if (dy > threshold) {
        onMove({ x: 0, y: 1 });
        touchStartRef.current.y = touch.clientY;
        lastMoveRef.current = now;
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div 
      className="mt-4 sm:mt-6 grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-[320px] mx-auto select-none px-2 pb-6"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-center">
        <button 
          onClick={() => onMove({ x: -1, y: 0 })}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center active:from-zinc-800 active:to-zinc-950 active:scale-90 transition-all shadow-[0_4px_0_0_#18181b,0_8px_15px_rgba(0,0,0,0.4)] border-t border-zinc-500/30"
        >
          <ChevronLeft className="text-zinc-200 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onMove({ x: 0, y: 1 })}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center active:from-zinc-800 active:to-zinc-950 active:scale-90 transition-all shadow-[0_4px_0_0_#18181b,0_8px_15px_rgba(0,0,0,0.4)] border-t border-zinc-500/30"
        >
          <ChevronDown className="text-zinc-200 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onMove({ x: 1, y: 0 })}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center active:from-zinc-800 active:to-zinc-950 active:scale-90 transition-all shadow-[0_4px_0_0_#18181b,0_8px_15px_rgba(0,0,0,0.4)] border-t border-zinc-500/30"
        >
          <ChevronRight className="text-zinc-200 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
