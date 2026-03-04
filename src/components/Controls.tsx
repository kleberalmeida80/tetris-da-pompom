import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCcw, ArrowDownToLine, Box } from 'lucide-react';

interface ControlsProps {
  onMove: (dir: { x: number, y: number }) => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onMove, onRotate, onHardDrop, onHold }) => {
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
      className="mt-6 grid grid-cols-3 gap-4 w-full max-w-[350px] mx-auto select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Row */}
      <div className="flex justify-center">
        <button 
          onClick={onHold}
          className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center active:bg-zinc-700 active:scale-95 transition-all shadow-lg border border-zinc-700"
        >
          <Box className="text-zinc-400" />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={onRotate}
          className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center active:bg-indigo-500 active:scale-95 transition-all shadow-lg border border-indigo-500"
        >
          <RotateCcw className="text-white" />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={onHardDrop}
          className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center active:bg-emerald-500 active:scale-95 transition-all shadow-lg border border-emerald-500"
        >
          <ArrowDownToLine className="text-white" />
        </button>
      </div>

      {/* Bottom Row - D-Pad Style */}
      <div className="flex justify-center">
        <button 
          onClick={() => onMove({ x: -1, y: 0 })}
          className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center active:bg-zinc-700 active:scale-95 transition-all shadow-lg border border-zinc-700"
        >
          <ChevronLeft className="text-zinc-300" />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onMove({ x: 0, y: 1 })}
          className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center active:bg-zinc-700 active:scale-95 transition-all shadow-lg border border-zinc-700"
        >
          <ChevronDown className="text-zinc-300" />
        </button>
      </div>
      <div className="flex justify-center">
        <button 
          onClick={() => onMove({ x: 1, y: 0 })}
          className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center active:bg-zinc-700 active:scale-95 transition-all shadow-lg border border-zinc-700"
        >
          <ChevronRight className="text-zinc-300" />
        </button>
      </div>
    </div>
  );
};

export default Controls;
