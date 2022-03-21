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

export const allShipIds = [
  "4-deck-0",
  "3-deck-0",
  "3-deck-1",
  "2-deck-0",
  "2-deck-1",
  "2-deck-2",
  "1-deck-0",
  "1-deck-1",
  "1-deck-2",
  "1-deck-3"
] as const;
