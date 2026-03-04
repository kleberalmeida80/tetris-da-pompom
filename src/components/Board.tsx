import React, { useRef, useEffect } from 'react';
import { COLS, ROWS, COLORS } from '../constants';

interface BoardProps {
  grid: any[][];
  activePiece: any;
  level: number;
}

const Board: React.FC<BoardProps> = ({ grid, activePiece, level }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getGhostPos = () => {
    if (!activePiece) return null;
    let ghostY = 0;
    while (true) {
      let collision = false;
      for (let y = 0; y < activePiece.tetromino.shape.length; y++) {
        for (let x = 0; x < activePiece.tetromino.shape[y].length; x++) {
          if (activePiece.tetromino.shape[y][x] !== 0) {
            const nextY = activePiece.pos.y + y + ghostY + 1;
            const nextX = activePiece.pos.x + x;
            if (nextY >= ROWS || (nextY >= 0 && grid[nextY][nextX] !== 0)) {
              collision = true;
              break;
            }
          }
        }
        if (collision) break;
      }
      if (collision) break;
      ghostY++;
    }
    return { x: activePiece.pos.x, y: activePiece.pos.y + ghostY };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = canvas.width / COLS;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * blockSize, 0);
      ctx.lineTo(i * blockSize, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * blockSize);
      ctx.lineTo(canvas.width, i * blockSize);
      ctx.stroke();
    }

    // Draw Locked Blocks
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          ctx.fillStyle = cell === 'garbage' ? COLORS.garbage : cell;
          ctx.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, (blockSize - 2) / 3);
        }
      });
    });

    // Draw Ghost Piece (Level 5+)
    if (activePiece && level >= 5) {
      const ghostPos = getGhostPos();
      if (ghostPos) {
        ctx.fillStyle = COLORS.ghost;
        activePiece.tetromino.shape.forEach((row: any, y: any) => {
          row.forEach((value: any, x: any) => {
            if (value !== 0) {
              ctx.fillRect(
                (ghostPos.x + x) * blockSize + 1,
                (ghostPos.y + y) * blockSize + 1,
                blockSize - 2,
                blockSize - 2
              );
            }
          });
        });
      }
    }

    // Draw Active Piece
    if (activePiece) {
      ctx.fillStyle = activePiece.tetromino.color;
      activePiece.tetromino.shape.forEach((row: any, y: any) => {
        row.forEach((value: any, x: any) => {
          if (value !== 0) {
            ctx.fillRect(
              (activePiece.pos.x + x) * blockSize + 1,
              (activePiece.pos.y + y) * blockSize + 1,
              blockSize - 2,
              blockSize - 2
            );
            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(
              (activePiece.pos.x + x) * blockSize + 1,
              (activePiece.pos.y + y) * blockSize + 1,
              blockSize - 2,
              (blockSize - 2) / 3
            );
            ctx.fillStyle = activePiece.tetromino.color;
          }
        });
      });
    }
  }, [grid, activePiece, level]);

  return (
    <div className="relative border-4 border-zinc-800 rounded-lg overflow-hidden shadow-2xl bg-zinc-900 aspect-[1/2] w-full max-w-[300px] mx-auto">
      <canvas
        ref={canvasRef}
        width={300}
        height={600}
        className="w-full h-full block"
      />
    </div>
  );
};

export default Board;
