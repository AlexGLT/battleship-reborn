import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";
import { DraggingState } from "./dragging-state";
import { Cell } from "./cell";
import { Ship } from "./ship";

import { allShipIds } from "../constants";

import { generateBattleField, generateShips } from "./utils";

export class BattleShipStore {
  public ships: Map<shipId, Ship> = generateShips();
  public shipsInDocksIds: Array<shipId> = allShipIds.slice(0);
  public playerGameField: Cell[][] = generateBattleField();

  public draggingState: DraggingState;

  constructor() {
    makeAutoObservable(this);

    this.draggingState = new DraggingState(this);
  }

  public dropShip = () => {
    const cells = this.draggingState.hoveredCells;

    if (cells.length) {
      const shipId = this.draggingState.shipId;

      if (shipId) {
        cells.forEach(([rowIndex, columnIndex]) => {
          const cell = this.playerGameField[rowIndex][columnIndex];

          cell.setHover(false, false);
          cell.bindShip(shipId);
        });

        this.shipsInDocksIds = this.shipsInDocksIds.slice(1);
      }
    }
  };

  public unDropShip = (row: number, column: number) => {
    const { shipId } = this.playerGameField[row][column];

    for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
        if (this.playerGameField[rowIndex][columnIndex].shipId === shipId) {
          this.playerGameField[rowIndex][columnIndex].unbindShip();
        }
      }
    }

    this.shipsInDocksIds.push(shipId!);
  };

  public get shipInPier() {
    return this.shipsInDocksIds.length ? this.ships.get(this.shipsInDocksIds[0])! : null;
  }

  public get shipsInDocks() {
    return this.shipsInDocksIds.slice(1).map((shipId) => this.ships.get(shipId) as Ship);
  }

  public toggleDirectionShipInPier = () => {
    const shipInPier = this.shipInPier;

    if (shipInPier) shipInPier.toggleDirection();
  };
}
