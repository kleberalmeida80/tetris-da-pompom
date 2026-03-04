export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
}

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0f0',
    type: 'I',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#f0f000',
    type: 'O',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#a000f0',
    type: 'T',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00f000',
    type: 'S',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f00000',
    type: 'Z',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000f0',
    type: 'J',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#f0a000',
    type: 'L',
  },
};

export const COLS = 10;
export const ROWS = 20;
export const INITIAL_LIVES = 3;
export const LINES_PER_LEVEL = 10;

export const COLORS = {
  background: '#0a0a0a',
  grid: '#1a1a1a',
  ghost: 'rgba(255, 255, 255, 0.15)',
  garbage: '#4a4a4a',
};

export const MUSIC_TRACKS = [
  { id: 'none', name: 'Sem Música', url: '' },
  { id: 'retro', name: 'Retro 8-bit', url: 'https://cdn.pixabay.com/audio/2024/02/08/audio_8484674764.mp3' },
  { id: 'electronic', name: 'Eletrônica', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a7345a.mp3' },
  { id: 'chill', name: 'Chill Mix', url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31743c589f.mp3' },
];

export const SFX_URLS = {
  rotate: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  lock: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  clear: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  gameOver: 'https://assets.mixkit.co/active_storage/sfx/2535/2535-preview.mp3',
};
