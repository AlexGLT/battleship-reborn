import { makeAutoObservable } from "mobx";

import { CellPosition } from "../typedefs";
import { DraggingState } from "./dragging-state";
import { Cell } from "./cell";
import { Ship } from "./ship";

import { fieldSize, shipLengthsAndCounts } from "../constants";

import { generateBattleField, generateShips } from "./utils";

export class BattleShipStore {
  public ships: Map<string, Ship>;
  public shipsInDocksIds: Array<string>;
  public playerGameField: Cell[][] = generateBattleField();

  public draggingState: DraggingState;

  constructor() {
    makeAutoObservable(this);

    this.draggingState = new DraggingState(this);

    this.ships = generateShips();
    this.shipsInDocksIds = Array.from(this.ships.keys());
  }

  private getSideCells = (cells: Array<CellPosition>) => {
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

    return Array.from(sideCellsIndexes.values()).map((cellIndex) => CellPosition.index2Position(cellIndex));
  };

  public dropShip = () => {
    let success = false;

    const cells = this.draggingState.relevantRelatedCells;

    if (cells.length && this.draggingState.hoveredCell) {
      const { x: hoveredCellX, y: hoveredCellY } = this.draggingState.hoveredCell;

      if (this.draggingState.canDrop) {
        const shipId = this.draggingState.shipId;

        if (shipId) {
          cells.forEach(({ x: cellX, y: cellY }) => {
            const cell = this.playerGameField[cellX][cellY];

            cell.setHover(false, false);
            cell.bindShip(shipId);
          });

          this.getSideCells(cells).forEach(({ x: sideCellX, y: sideCellY }) => {
            this.playerGameField[sideCellX][sideCellY].sideToCells.add(shipId);
          });

          this.shipsInDocksIds = this.shipsInDocksIds.slice(1);
        }

        success = true;
      }

      this.draggingState.unHover(hoveredCellX, hoveredCellY);
    }

    this.draggingState.stopDragging();

    return { success };
  };

  public unDropShip = (clickedCellX: number, clickedCellY: number) => {
    const { shipId } = this.playerGameField[clickedCellX][clickedCellY];

    if (shipId) {
      for (let cellX = 0; cellX < 10; cellX++) {
        for (let cellY = 0; cellY < 10; cellY++) {
          const cell = this.playerGameField[cellX][cellY];

          cell.sideToCells.delete(shipId);

          if (cell.shipId === shipId) cell.unbindShip();
        }
      }

      this.shipsInDocksIds.push(shipId);
    }
  };

  public get shipInPier() {
    return this.shipsInDocksIds.length ? this.ships.get(this.shipsInDocksIds[0])! : null;
  }

  public get shipsInDocksCount() {
    const unPlacedShipsCount = Object
      .keys(shipLengthsAndCounts)
      .reduce<{ [shipLength: number]: number }>(
        (acc, shipLength) => ({ ...acc, [shipLength]: 0 }), {}
      );

    this.shipsInDocksIds.forEach((shipId) => {
      const shipLength = this.ships.get(shipId)?.length;

      if (shipLength) ++unPlacedShipsCount[shipLength];
    });

    return unPlacedShipsCount;
  }

  public toggleDirectionShipInPier = () => {
    const shipInPier = this.shipInPier;

    if (shipInPier) shipInPier.toggleDirection();
  };
}
