export enum directions {
  horizontal = "horizontal",
  vertical = "vertical",
}

export enum cellStatuses {
  hoveredFree,
  hoveredBusy,
  busy,
  side,
  collision
}

export const shipLengthsAndCounts = {
  4: 1,
  3: 2,
  2: 3,
  1: 4
};

export const fieldSize = {
  width: 10,
  height: 10
};
