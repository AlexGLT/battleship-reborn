export const cell2Index = (row: number, column: number): number => row * 10 + column;

export const index2Cell = (index: number): [number, number] => [Math.trunc(index / 10), index % 10];
