import { useState, useEffect, useCallback, useRef } from 'react';
import { COLS, ROWS, TETROMINOS, INITIAL_LIVES, LINES_PER_LEVEL } from '../constants';
import { createEmptyGrid, rotate, BagRandomizer } from '../utils';

interface TetrisCallbacks {
  onRotate?: () => void;
  onLock?: () => void;
  onClear?: () => void;
  onGameOver?: () => void;
}

export const useTetris = (callbacks?: TetrisCallbacks) => {
  const [grid, setGrid] = useState(createEmptyGrid(ROWS, COLS));
  const [activePiece, setActivePiece] = useState<any>(null);
  const [nextPiece, setNextPiece] = useState<any>(null);
  const [holdPiece, setHoldPiece] = useState<any>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('START');
  
  const bagRef = useRef(new BagRandomizer());
  const dropTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const spawnPiece = useCallback(() => {
    const type = nextPiece ? nextPiece.type : bagRef.current.getNext();
    const nextType = bagRef.current.getNext();
    
    const piece = {
      pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
      tetromino: TETROMINOS[type],
      collided: false,
    };

    setNextPiece({ type: nextType, tetromino: TETROMINOS[nextType] });
    
    // Check for game over immediately
    if (checkCollision(piece, grid, { x: 0, y: 0 })) {
      handleGameOver();
      return;
    }

    setActivePiece(piece);
    setCanHold(true);
  }, [nextPiece, grid]);

  const handleGameOver = () => {
    if (lives > 1) {
      setLives(prev => prev - 1);
      resetLevel();
    } else {
      setLives(0);
      setGameState('GAMEOVER');
      callbacks?.onGameOver?.();
    }
  };

  const resetLevel = () => {
    setGrid(createEmptyGrid(ROWS, COLS));
    setActivePiece(null);
    // Add garbage if level >= 3
    if (level >= 3) {
      setGrid(prev => {
        const newGrid = [...prev];
        for (let i = 0; i < Math.min(level - 2, 5); i++) {
          const row = Array(COLS).fill('garbage');
          const hole = Math.floor(Math.random() * COLS);
          row[hole] = 0;
          newGrid.shift();
          newGrid.push(row);
        }
        return newGrid;
      });
    }
    spawnPiece();
  };

  const checkCollision = (piece: any, grid: any[][], move: { x: number, y: number }) => {
    for (let y = 0; y < piece.tetromino.shape.length; y++) {
      for (let x = 0; x < piece.tetromino.shape[y].length; x++) {
        if (piece.tetromino.shape[y][x] !== 0) {
          const nextX = piece.pos.x + x + move.x;
          const nextY = piece.pos.y + y + move.y;
          if (
            nextX < 0 || 
            nextX >= COLS || 
            nextY >= ROWS || 
            (nextY >= 0 && grid[nextY][nextX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const movePiece = (dir: { x: number, y: number }) => {
    if (!activePiece || gameState !== 'PLAYING') return;
    if (!checkCollision(activePiece, grid, dir)) {
      setActivePiece((prev: any) => ({
        ...prev,
        pos: { x: prev.pos.x + dir.x, y: prev.pos.y + dir.y }
      }));
    } else if (dir.y > 0) {
      // Collision below
      lockPiece();
    }
  };

  const rotatePiece = () => {
    if (!activePiece || gameState !== 'PLAYING') return;
    const clonedPiece = JSON.parse(JSON.stringify(activePiece));
    clonedPiece.tetromino.shape = rotate(clonedPiece.tetromino.shape);
    
    // Simple wall kick
    let offset = 0;
    while (checkCollision(clonedPiece, grid, { x: offset, y: 0 })) {
      offset += offset >= 0 ? -1 : 1;
      if (Math.abs(offset) > 2) return; // Can't rotate
    }
    
    clonedPiece.pos.x += offset;
    setActivePiece(clonedPiece);
    callbacks?.onRotate?.();
  };

  const lockPiece = () => {
    if (!activePiece) return;
    const newGrid = [...grid];
    activePiece.tetromino.shape.forEach((row: any, y: any) => {
      row.forEach((value: any, x: any) => {
        if (value !== 0) {
          const gridY = activePiece.pos.y + y;
          const gridX = activePiece.pos.x + x;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = activePiece.tetromino.color;
          }
        }
      });
    });

    // Clear lines
    let linesCleared = 0;
    const filteredGrid = newGrid.filter(row => {
      const isFull = row.every(cell => cell !== 0);
      if (isFull) linesCleared++;
      return !isFull;
    });

    while (filteredGrid.length < ROWS) {
      filteredGrid.unshift(Array(COLS).fill(0));
    }

    if (linesCleared > 0) {
      const linePoints = [0, 100, 300, 500, 800];
      setScore(prev => prev + linePoints[linesCleared] * level);
      setLines(prev => {
        const newLines = prev + linesCleared;
        if (Math.floor(newLines / LINES_PER_LEVEL) > Math.floor(prev / LINES_PER_LEVEL)) {
          setLevel(l => l + 1);
        }
        return newLines;
      });
      callbacks?.onClear?.();
    } else {
      callbacks?.onLock?.();
    }

    setGrid(filteredGrid);
    spawnPiece();
  };

  const hardDrop = () => {
    if (!activePiece || gameState !== 'PLAYING') return;
    let dropY = 0;
    while (!checkCollision(activePiece, grid, { x: 0, y: dropY + 1 })) {
      dropY++;
    }
    movePiece({ x: 0, y: dropY });
    lockPiece();
  };

  const handleHold = () => {
    if (!canHold || gameState !== 'PLAYING') return;
    const currentType = activePiece.tetromino.type;
    if (holdPiece) {
      const nextHold = {
        pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
        tetromino: TETROMINOS[holdPiece.type],
        collided: false,
      };
      setActivePiece(nextHold);
      setHoldPiece({ type: currentType, tetromino: TETROMINOS[currentType] });
    } else {
      setHoldPiece({ type: currentType, tetromino: TETROMINOS[currentType] });
      spawnPiece();
    }
    setCanHold(false);
  };

  const startGame = () => {
    setGrid(createEmptyGrid(ROWS, COLS));
    setScore(0);
    setLevel(1);
    setLines(0);
    setLives(INITIAL_LIVES);
    setHoldPiece(null);
    setGameState('PLAYING');
    spawnPiece();
  };

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const tick = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      const speed = Math.max(100, 1000 - (level - 1) * 100);
      
      if (deltaTime > speed) {
        movePiece({ x: 0, y: 1 });
        lastTimeRef.current = time;
      }
      dropTimeRef.current = requestAnimationFrame(tick);
    };

    dropTimeRef.current = requestAnimationFrame(tick);
    return () => {
      if (dropTimeRef.current) cancelAnimationFrame(dropTimeRef.current);
    };
  }, [gameState, level, activePiece, grid]);

  return {
    grid,
    activePiece,
    nextPiece,
    holdPiece,
    score,
    level,
    lines,
    lives,
    gameState,
    setGameState,
    startGame,
    movePiece,
    rotatePiece,
    hardDrop,
    handleHold
  };
};
