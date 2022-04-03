import { makeAutoObservable } from "mobx";

import { CellPosition } from "../typedefs";
import { BattleShipStore } from "./store";
import { Cell } from "./state-elements";

import { generateBattleField, getRelatedCells, getSideCells } from "./utils";

export class PlayerFieldState {
  private battleShipStore: BattleShipStore;

  public playerField: Cell[][] = generateBattleField();

  constructor(store: BattleShipStore) {
    makeAutoObservable(this);

    this.battleShipStore = store;
  }

  public get relevantRelatedCells(): Array<CellPosition> {
    const { shipSpecs: { length, direction }, deckIndex, hoveredCell } = this.battleShipStore.draggingState;

    if (direction && length && hoveredCell && deckIndex !== null) {
      return getRelatedCells(hoveredCell.x, hoveredCell.y, length, direction, deckIndex);
    }

    return [];
  }

  public get relevantSideCells(): Array<CellPosition> {
    const relatedCells = this.relevantRelatedCells;

    return relatedCells.length ? getSideCells(relatedCells) : [];
  }

  public getCellState = (cellX: number, cellY: number) => this.playerField[cellX][cellY];

  public checkCollision = (relatedCells: Array<CellPosition>) => {
    return relatedCells.reduce((isCollision, { x: relatedCellX, y: relatedCellY }) => {
      const cell = this.playerField[relatedCellX][relatedCellY];

      return isCollision || cell.isBusy || !!cell.adjoinedShipsIds.size;
    }, false);
  };

  public hoverCells = (relatedCells: Array<CellPosition>, hover: boolean, canDrop: boolean | null) => {
    relatedCells.forEach(({ x, y }) => {
      this.playerField[x][y].setHover(hover, canDrop);
    });
  };

  public placeShip = (shipId: string) => {
    const relatedCells = this.relevantRelatedCells;
    relatedCells.forEach(({ x: relatedCellX, y: relatedCellY }) => {
      return this.playerField[relatedCellX][relatedCellY].bindShip(shipId);
    });

    const sideCells = this.relevantSideCells;
    sideCells.forEach(({ x: sideCellX, y: sideCellY }) => {
      return this.playerField[sideCellX][sideCellY].setAdjoinedShip(shipId, true);
    });
  };

  public removeShip = (clickedCellX: number, clickedCellY: number) => {
    const { shipId } = this.playerField[clickedCellX][clickedCellY];

    if (shipId) {
      for (let cellX = 0; cellX < 10; cellX++) {
        for (let cellY = 0; cellY < 10; cellY++) {
          const cell = this.playerField[cellX][cellY];

          cell.adjoinedShipsIds.delete(shipId);

          if (cell.shipId === shipId) cell.unbindShip();
        }
      }
    }

    return shipId;
  };
}
