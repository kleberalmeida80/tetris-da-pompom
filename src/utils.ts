import { TETROMINOS, TetrominoType } from './constants';

export const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS) as TetrominoType[];
  return TETROMINOS[keys[Math.floor(Math.random() * keys.length)]];
};

// 7-Bag Randomizer
export class BagRandomizer {
  private bag: TetrominoType[] = [];

  getNext(): TetrominoType {
    if (this.bag.length === 0) {
      this.bag = (Object.keys(TETROMINOS) as TetrominoType[]).sort(() => Math.random() - 0.5);
    }
    return this.bag.pop()!;
  }
}

export const createEmptyGrid = (rows: number, cols: number) =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

export const rotate = (matrix: number[][]) => {
  const rotated = matrix[0].map((_, index) => matrix.map((col) => col[index]).reverse());
  return rotated;
};
