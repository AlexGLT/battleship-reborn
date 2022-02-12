export enum directions {
  horizontal = "horizontal",
  vertical = "vertical",
}

export enum locations {
  pier = "pier",
  docks = "docks",
  battlefield = "battlefield"
}

export enum eventStages {
  enter = "enter",
  exit = "exit"
}

export const shipsId = [
  "four-deck-0",
  "three-deck-0",
  "three-deck-1",
  "double-deck-0",
  "double-deck-1",
  "double-deck-2",
  "one-deck-0",
  "one-deck-1",
  "one-deck-2",
  "one-deck-3"
] as const;
