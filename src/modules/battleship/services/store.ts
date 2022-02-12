import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";
import { Cell } from "./cell";
import { Ship } from "./ship";

import { allShipIds, directions, eventStages } from "../constants";

import { generateBattleField, generateShips } from "./utils";

interface draggingContext {
  shipId: shipId | null,
  deckIndex: number | null,
  canDrop: boolean | null,
}

export class BattleShipStore {
  public ships: Map<shipId, Ship> = generateShips();
  public shipInPierId: shipId | null = allShipIds[0];
  public shipsInDocksIds: Array<shipId> = allShipIds.slice(1);
  public playerGameField: Cell[][] = generateBattleField();

  public draggingContext: draggingContext = {
    shipId: null,
    deckIndex: null,
    canDrop: null
  };

  constructor() {
    makeAutoObservable(this);
  }

  public startShipDragging = (shipId: shipId | null, deckIndex: number | null) => {
    this.draggingContext.shipId = shipId;
    this.draggingContext.deckIndex = deckIndex;
  };

  public stopShipDragging = () => {
    this.draggingContext.shipId = null;
    this.draggingContext.deckIndex = null;
  };

  public hoverPlayerGameField = (row: number, column: number, stage: eventStages) => {
    const ship = this.draggingContext.shipId ? this.ships.get(this.draggingContext.shipId) : null;

    if (ship) {
      const { length, direction } = ship;

      const isHorizontal = direction === directions.horizontal;

      const mainAxis = isHorizontal ? column : row;

      const firstDeckPlace = mainAxis - Number(this.draggingContext.deckIndex);
      const lastDeckPlace = firstDeckPlace + length - 1;

      const canDrop = firstDeckPlace >= 0 && lastDeckPlace < 10;

      for (let mainAxisIndex = firstDeckPlace; mainAxisIndex < Math.min(firstDeckPlace + length, 10); mainAxisIndex++) {
        const rowIndex = isHorizontal ? row : mainAxisIndex;
        const columnIndex = isHorizontal ? mainAxisIndex : column;

        this.playerGameField[rowIndex][columnIndex].handleHover([row, column], stage, canDrop);
      }

      this.draggingContext.canDrop = canDrop;
    }
  };

  public get shipInPier() {
    if (this.shipInPierId) return this.ships.get(this.shipInPierId) as Ship;

    return null;
  }

  public get shipsInDocks() {
    return this.shipsInDocksIds.map((shipId) => this.ships.get(shipId) as Ship);
  }

  public toggleDirectionShipInPier = () => {
    const shipInPier = this.shipInPier;

    if (shipInPier) shipInPier.toggleDirection();
  };
}
