import { makeAutoObservable } from "mobx";

import { CellPosition } from "../typedefs";
import { BattleShipStore } from "./store";
import { Cell } from "./cell";

import { directions, fieldSize } from "../constants";

import range from "lodash-es/range";
import { generateBattleField } from "./utils";

const getRelatedCells = (
  x: number,
  y: number,
  length: number,
  direction: directions,
  deckIndex: number): Array<CellPosition> => {
  const isHorizontal = direction === directions.horizontal;
  const firstDeckPlace = (isHorizontal ? y : x) - deckIndex;

  return range(Math.max(firstDeckPlace, 0), Math.min(firstDeckPlace + length, 10))
    .map((axis) => isHorizontal ? new CellPosition(x, axis) : new CellPosition(axis, y));
};

const getSideCells = (cells: Array<CellPosition>) => {
  const sideCellsIndexes = new Set<number>();

  cells.forEach(({ x, y }) => {
    for (let i = -1; i <= 1; i++) {
      const sideCellX = x + i;

      if (sideCellX < 0) continue;
      if (sideCellX > fieldSize.width - 1) break;

      for (let j = -1; j <= 1; j++) {
        const sideColumnY = y + j;

        if (sideColumnY < 0) continue;
        if (sideColumnY > fieldSize.height - 1) break;

        sideCellsIndexes.add(CellPosition.position2Index(sideCellX, sideColumnY));
      }
    }
  });

  cells.forEach(({ x, y }) => sideCellsIndexes.delete(CellPosition.position2Index(x, y)));

  return Array.from(sideCellsIndexes.values()).map((cellIndex) => new CellPosition(cellIndex));
};

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

  public unPlaceShip = (clickedCellX: number, clickedCellY: number) => {
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
