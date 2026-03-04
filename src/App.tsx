import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Heart, Trophy, Layers, Hash, Music, Settings as SettingsIcon, X, Box, ArrowDownToLine } from 'lucide-react';
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
    <div className="h-[100dvh] bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-between p-1 sm:p-4 overflow-hidden touch-none relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Stats & Pause */}
      <div className="w-full max-w-[400px] flex items-center gap-1.5 sm:gap-3 sm:mb-4 shrink-0 z-10">
        <div className="flex-1 glass-panel p-1.5 sm:p-3 rounded-2xl flex items-center gap-1.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
            <Trophy className="text-yellow-500 w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[7px] sm:text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold leading-none mb-1 font-tech">Pontos</p>
            <p className="text-xs sm:text-lg font-tech font-bold leading-none tracking-tight">{score.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-panel p-1.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center min-w-[55px] sm:min-w-[80px]">
          <p className="text-[7px] sm:text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold leading-none mb-1 font-tech">Nível</p>
          <p className="text-xs sm:text-lg font-tech font-bold leading-none text-indigo-400">{level}</p>
        </div>

        <div className="flex-1 glass-panel p-1.5 sm:p-3 rounded-2xl flex items-center gap-1.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
            <Heart className="text-red-500 w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-[7px] sm:text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold leading-none mb-1 font-tech">Vidas</p>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${i < lives ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-zinc-800'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {gameState === 'PLAYING' && (
          <button 
            onClick={handlePause}
            className="p-2.5 sm:p-4 rounded-2xl glass-panel text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
          >
            <Pause size={18} />
          </button>
        )}
      </div>

      {/* Main Game Area */}
      <div className="relative flex gap-1 sm:gap-4 items-center justify-center flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Side: Hold & Action */}
        <div className="flex flex-col gap-3 sm:gap-6 items-center shrink-0 py-1 z-10">
          <div className="glass-panel p-1.5 sm:p-2.5 rounded-2xl w-14 sm:w-24">
            <p className="text-[6px] sm:text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1.5 text-center font-tech">Hold</p>
            <div className="aspect-square glass-panel-dark rounded-xl flex items-center justify-center overflow-hidden">
              {holdPiece && (
                <div className="scale-[0.35] sm:scale-60 origin-center">
                  <div className="grid grid-cols-4 gap-1">
                    {holdPiece.tetromino.shape.flat().map((v: number, i: number) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${v ? 'shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'opacity-0'}`} style={{ backgroundColor: holdPiece.tetromino.color }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {gameState === 'PLAYING' && (
            <button 
              onClick={handleHold}
              className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center active:scale-90 transition-all shadow-[0_6px_0_0_#18181b,0_12px_20px_rgba(0,0,0,0.5)] border-t border-zinc-500/30 hover:brightness-110"
            >
              <Box className="text-zinc-300 w-5 h-5 sm:w-7 sm:h-7 drop-shadow-md" />
            </button>
          )}
        </div>

        {/* Center: Board */}
        <div className="flex-1 h-full max-w-[260px] sm:max-w-[340px] flex items-center justify-center z-10">
          <Board grid={grid} activePiece={activePiece} level={level} />
        </div>

        {/* Right Side: Next & Actions */}
        <div className="flex flex-col gap-3 sm:gap-6 items-center shrink-0 py-1 z-10">
          <div className="glass-panel p-1.5 sm:p-2.5 rounded-2xl w-14 sm:w-24">
            <p className="text-[6px] sm:text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1.5 text-center font-tech">Next</p>
            <div className="aspect-square glass-panel-dark rounded-xl flex items-center justify-center overflow-hidden">
              {nextPiece && (
                <div className="scale-[0.35] sm:scale-60 origin-center">
                   <div className="grid grid-cols-4 gap-1">
                    {nextPiece.tetromino.shape.flat().map((v: number, i: number) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${v ? 'shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'opacity-0'}`} style={{ backgroundColor: nextPiece.tetromino.color }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {gameState === 'PLAYING' && (
            <div className="flex flex-col gap-3 sm:gap-6">
              <button 
                onClick={rotatePiece}
                className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 flex items-center justify-center active:scale-90 transition-all shadow-[0_6px_0_0_#312e81,0_12px_20px_rgba(79,70,229,0.4)] border-t border-indigo-400/50 hover:brightness-110 neon-glow-indigo"
              >
                <RotateCcw className="text-white w-5 h-5 sm:w-7 sm:h-7 drop-shadow-md" />
              </button>
              <button 
                onClick={hardDrop}
                className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-700 flex items-center justify-center active:scale-90 transition-all shadow-[0_6px_0_0_#064e3b,0_12px_20px_rgba(16,185,129,0.4)] border-t border-emerald-400/50 hover:brightness-110 neon-glow-emerald"
              >
                <ArrowDownToLine className="text-white w-5 h-5 sm:w-7 sm:h-7 drop-shadow-md" />
              </button>
            </div>
          )}
        </div>

        {/* Overlay Screens */}
        <AnimatePresence>
          {gameState === 'START' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center rounded-2xl overflow-hidden"
            >
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/20 blur-[150px] rounded-full" />
              <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/20 blur-[150px] rounded-full" />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="z-10"
              >
                <h1 className="text-5xl sm:text-7xl font-display font-black italic tracking-tighter text-white mb-2 leading-none">
                  TETRIS DA <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">POMPOM</span>
                </h1>
                <p className="text-zinc-500 text-sm sm:text-lg mb-12 font-tech tracking-[0.3em] uppercase">Muito mais diversão</p>
                
                <div className="space-y-4 w-full max-w-[240px] mx-auto">
                  <button 
                    onClick={handleStartGame}
                    className="w-full py-5 bg-white text-black rounded-2xl font-display font-black text-xl flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all active:scale-95 hover:scale-105"
                  >
                    <Play fill="currentColor" size={24} /> JOGAR
                  </button>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="w-full py-4 glass-panel text-white rounded-2xl font-display font-bold flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-white/10"
                  >
                    <SettingsIcon size={20} /> CONFIGURAÇÕES
                  </button>
                  <div className="pt-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-tech mb-1">Recorde Atual</p>
                    <p className="text-2xl font-tech font-bold text-indigo-400">{highScore.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-[60] bg-zinc-950/98 flex flex-col p-6 rounded-2xl overflow-hidden"
            >
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full" />
              
              <div className="flex items-center justify-between mb-10 z-10">
                <h2 className="text-2xl font-display font-black tracking-tighter flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <SettingsIcon size={20} className="text-indigo-400" />
                  </div>
                  CONFIGURAÇÕES
                </h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-8 z-10">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-tech font-bold mb-4 tracking-[0.3em] flex items-center gap-2">
                    <Music size={14} /> Música de Fundo
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {MUSIC_TRACKS.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => setCurrentTrackId(track.id)}
                        className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                          currentTrackId === track.id 
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-display font-bold text-lg">{track.name}</span>
                        {currentTrackId === track.id ? (
                          <div className="w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)]" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-zinc-800 group-hover:bg-zinc-700" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="mt-auto w-full py-5 bg-white text-black rounded-2xl font-display font-black text-xl active:scale-95 transition-all shadow-xl"
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
              className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 rounded-2xl"
            >
              <h2 className="text-4xl font-display font-black mb-8 tracking-tighter">PAUSADO</h2>
              <div className="space-y-4 w-full max-w-[200px]">
                <button 
                  onClick={handleResume}
                  className="w-full py-4 bg-white text-black rounded-2xl font-display font-black text-lg active:scale-95 transition-all shadow-xl"
                >
                  CONTINUAR
                </button>
                <button 
                  onClick={handleStartGame}
                  className="w-full py-3 glass-panel text-white rounded-xl font-display font-bold active:scale-95 transition-all"
                >
                  REINICIAR
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'GAMEOVER' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-50 bg-red-950/95 flex flex-col items-center justify-center p-6 text-center rounded-2xl overflow-hidden"
            >
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-red-500/20 blur-[150px] rounded-full" />
              
              <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.5)] rotate-12 z-10">
                <RotateCcw className="text-white w-10 h-10" />
              </div>
              
              <h2 className="text-5xl font-display font-black mb-2 tracking-tighter z-10">FIM DE JOGO</h2>
              <p className="text-red-300/60 font-tech uppercase tracking-[0.3em] text-xs mb-8 z-10">Tente novamente</p>
              
              <div className="glass-panel-dark p-6 rounded-3xl w-full max-w-[240px] mb-8 z-10 border-red-500/20">
                <p className="text-[10px] text-red-300/40 uppercase tracking-[0.2em] font-tech mb-2">Pontuação Final</p>
                <p className="text-4xl font-tech font-bold text-white tracking-tighter">{score.toLocaleString()}</p>
              </div>
              
              <button 
                onClick={handleStartGame}
                className="w-full max-w-[200px] py-5 bg-white text-black rounded-2xl font-display font-black text-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all z-10"
              >
                RECOMEÇAR
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Section */}
      <div className="w-full shrink-0">
        {gameState === 'PLAYING' && (
          <Controls 
            onMove={movePiece} 
          />
        )}
      </div>
    </div>
  );
}
