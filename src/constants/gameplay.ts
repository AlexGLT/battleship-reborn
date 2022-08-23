export const fieldSize = {
    width: 10,
    height: 10,
} as const;

export const shipLengthsAndCounts = {
    4: 1,
    3: 2,
    2: 3,
    1: 4,
} as const;

export enum ShootResult {
    hit = "hit",
    miss = "miss",
    kill = "kill",
}
