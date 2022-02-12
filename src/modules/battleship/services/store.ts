import { makeAutoObservable } from "mobx";

import { Cell } from "./cell";
import { Ship } from "./ship";
import { generateBattleField, generateShips } from "./utils";
import { directions, eventStages, locations, shipsId } from "../constants";

interface draggingContext {
  shipId: typeof shipsId[number] | null,
  deckIndex: number | null,
  canDrop: boolean | null,
}

export class BattleShipStore {
  public ships: Ship[] = generateShips();
  public playerGameField: Cell[][] = generateBattleField();

  public draggingContext: draggingContext = {
    shipId: null,
    deckIndex: null,
    canDrop: null
  };

  constructor() {
    makeAutoObservable(this);
  }

  public startShipDragging = (shipId: typeof shipsId[number] | null, deckIndex: number | null) => {
    this.draggingContext.shipId = shipId;
    this.draggingContext.deckIndex = deckIndex;
  };

  public stopShipDragging = () => {
    this.draggingContext.shipId = null;
    this.draggingContext.deckIndex = null;
  };

  public hoverPlayerGameField = (row: number, column: number, stage: eventStages) => {
    const ship = this.ships.find(({ id }) => id === this.draggingContext.shipId);

    if (ship) {
      const { length, direction } = ship;

      const isHorizontal = direction === directions.horizontal;
      const isHovered = stage === eventStages.enter;

      const mainAxis = isHorizontal ? column : row;

      const firstDeckPlace = mainAxis - Number(this.draggingContext.deckIndex);
      const lastDeckPlace = firstDeckPlace + length - 1;

      const canDrop = firstDeckPlace >= 0 && lastDeckPlace < 10;

      for (let mainAxisIndex = firstDeckPlace; mainAxisIndex < Math.min(firstDeckPlace + length, 10); mainAxisIndex++) {
        const rowIndex = isHorizontal ? row : mainAxisIndex;
        const columnIndex = isHorizontal ? mainAxisIndex : column;

        this.playerGameField[rowIndex][columnIndex].setIsHovered(isHovered, canDrop);
      }
    }
  };

  public get shipInPier() {
    return this.ships.find(({ placement }) => placement === locations.pier) as Ship;
  }

  public get shipsInDocks() {
    return this.ships.filter((ship) => ship.placement === locations.docks);
  }

  public toggleDirectionShipInPier = () => {
    this.shipInPier.toggleDirection();
  };

  public getCell = (row: number, column: number) => {
    return this.playerGameField[row][column];
  };
}
