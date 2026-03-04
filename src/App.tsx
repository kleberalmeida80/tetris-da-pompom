import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Heart, Trophy, Layers, Hash, Music, Settings as SettingsIcon, X } from 'lucide-react';
import { useTetris } from './hooks/useTetris';
import { useMusic } from './hooks/useMusic';
import { useSoundEffects } from './hooks/useSoundEffects';
import { MUSIC_TRACKS } from './constants';
import Board from './components/Board';
import Controls from './components/Controls';

export default function App() {
  const { playRotate, playLock, playClear, playGameOver } = useSoundEffects();

  const {
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
  } = useTetris({
    onRotate: playRotate,
    onLock: playLock,
    onClear: playClear,
    onGameOver: playGameOver,
  });

  const { currentTrackId, setCurrentTrackId, playMusic, stopMusic } = useMusic();
  const [showSettings, setShowSettings] = useState(false);

  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('tetris-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleStartGame = () => {
    startGame();
    playMusic();
  };

  const handleResume = () => {
    setGameState('PLAYING');
    playMusic();
  };

  const handlePause = () => {
    setGameState('PAUSED');
    stopMusic();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-center p-4 overflow-hidden touch-none">
      {/* Header Stats */}
      <div className="w-full max-w-[350px] grid grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
          <Trophy className="text-yellow-500 w-5 h-5" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Pontos</p>
            <p className="text-lg font-mono leading-none">{score.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
          <Heart className="text-red-500 w-5 h-5" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Vidas</p>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i < lives ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative flex gap-4 items-start">
        {/* Left Side: Hold */}
        <div className="hidden sm:flex flex-col gap-4">
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 w-24">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Segurar</p>
            <div className="aspect-square bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center">
              {holdPiece && (
                <div className="scale-75 origin-center">
                  {/* Simple preview logic */}
                  <div className="grid grid-cols-4 gap-1">
                    {holdPiece.tetromino.shape.flat().map((v: number, i: number) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${v ? '' : 'opacity-0'}`} style={{ backgroundColor: holdPiece.tetromino.color }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center: Board */}
        <Board grid={grid} activePiece={activePiece} level={level} />

        {/* Right Side: Next & Stats */}
        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 w-24">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-2">Próximo</p>
            <div className="aspect-square bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center">
              {nextPiece && (
                <div className="scale-75 origin-center">
                   <div className="grid grid-cols-4 gap-1">
                    {nextPiece.tetromino.shape.flat().map((v: number, i: number) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${v ? '' : 'opacity-0'}`} style={{ backgroundColor: nextPiece.tetromino.color }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 w-24">
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Nível</p>
              <p className="text-xl font-mono">{level}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Linhas</p>
              <p className="text-xl font-mono">{lines}</p>
            </div>
          </div>
        </div>

        {/* Overlay Screens */}
        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-lg"
            >
              <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">TETRIS DA <span className="text-indigo-500">POMPOM</span></h1>
              <p className="text-zinc-500 text-sm mb-8">Muito mais diversão</p>
              
              <div className="space-y-4 w-full max-w-[200px]">
                <button 
                  onClick={handleStartGame}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all active:scale-95"
                >
                  <Play fill="currentColor" /> JOGAR AGORA
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <SettingsIcon size={18} /> CONFIGURAÇÕES
                </button>
                <div className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Recorde: {highScore}</div>
              </div>
            </motion.div>
          )}

          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-[60] bg-zinc-950 flex flex-col p-6 rounded-lg"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <SettingsIcon size={20} className="text-indigo-500" /> CONFIGURAÇÕES
                </h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-3 flex items-center gap-2">
                    <Music size={14} /> Música de Fundo
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {MUSIC_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setCurrentTrackId(track.id)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                          currentTrackId === track.id 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="font-medium">{track.name}</span>
                        {currentTrackId === track.id && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="mt-auto w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold active:scale-95 transition-all"
              >
                SALVAR E VOLTAR
              </button>
            </motion.div>
          )}

          {gameState === 'PAUSED' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-6">PAUSADO</h2>
              <button 
                onClick={handleResume}
                className="w-full max-w-[180px] py-3 bg-zinc-100 text-zinc-950 rounded-xl font-bold mb-3 active:scale-95 transition-all"
              >
                CONTINUAR
              </button>
              <button 
                onClick={handleStartGame}
                className="w-full max-w-[180px] py-3 bg-zinc-800 text-white rounded-xl font-bold active:scale-95 transition-all"
              >
                REINICIAR
              </button>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center rounded-lg"
            >
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                <RotateCcw className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black mb-2">FIM DE JOGO</h2>
              <div className="bg-black/30 p-4 rounded-2xl w-full max-w-[200px] mb-6">
                <p className="text-xs text-zinc-400 uppercase">Pontuação Final</p>
                <p className="text-2xl font-mono font-bold text-white">{score.toLocaleString()}</p>
              </div>
              <button 
                onClick={handleStartGame}
                className="w-full max-w-[180px] py-4 bg-white text-black rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
              >
                TENTAR NOVAMENTE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Section */}
      <div className="w-full flex flex-col items-center">
        {gameState === 'PLAYING' && (
          <Controls 
            onMove={movePiece} 
            onRotate={rotatePiece} 
            onHardDrop={hardDrop}
            onHold={handleHold}
          />
        )}
        
        {/* Pause Button */}
        {gameState === 'PLAYING' && (
          <button 
            onClick={handlePause}
            className="mt-8 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 active:text-white transition-colors"
          >
            <Pause size={20} />
          </button>
        )}
      </div>

      {/* Mobile Footer Hints */}
      <div className="mt-auto pt-4 text-[10px] text-zinc-600 flex gap-4 uppercase tracking-widest">
        <span className="flex items-center gap-1"><Layers size={10} /> Nível {level}</span>
        <span className="flex items-center gap-1"><Hash size={10} /> {lines} Linhas</span>
      </div>
    </div>
  );
}
