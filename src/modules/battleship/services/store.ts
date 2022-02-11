import { makeAutoObservable } from "mobx";

import { Ship } from "../typedefs";
import { locations } from "../constants";

const generateShips = () => {
  const shipDecksCount = [4, 3, 2, 1];

  const ships = [];

  for (const deckCount of shipDecksCount) {
    const shipWithThisDeckCount = [];

    for (let i = 0; i <= 4 - deckCount; i++) {
      shipWithThisDeckCount.push(new Ship(`${deckCount}deck-${i}`, deckCount));
    }

    ships.push(shipWithThisDeckCount);
  }

  const flatShipArray = ships.flat();

  flatShipArray[0].placement = locations.pier;

  return flatShipArray;
};

interface draggingContext {
  shipId: string | null,
  deckIndex: number | null,
  canDrop: boolean | null,
}

export class BattleShipStore {
  public shipsInDocks: Ship[] = generateShips();

  public draggingContext: draggingContext = {
    shipId: null,
    deckIndex: null,
    canDrop: null
  };

  constructor() {
    makeAutoObservable(this);
  }

  public startShipDragging = (shipId: string | null, deckIndex: number | null) => {
    this.draggingContext.shipId = shipId;
    this.draggingContext.deckIndex = deckIndex;
  };

  public stopShipDragging = () => {
    this.draggingContext.shipId = null;
    this.draggingContext.deckIndex = null;
  };

  public toggleDirectionShipInPier = () => {
    this.shipsInDocks[0].toggleDirection();
  };

  public get shipInPier() {
    return this.shipsInDocks[0];
  }

  public get shipsInDocs() {
    return this.shipsInDocks.slice(1);
  }
}
