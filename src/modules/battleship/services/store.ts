import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";
import { DraggingState } from "./dragging-state";
import { Cell } from "./cell";
import { Ship } from "./ship";

import { allShipIds } from "../constants";

import { cell2Index, generateBattleField, generateShips, index2Cell } from "./utils";

export class BattleShipStore {
  public ships: Map<shipId, Ship> = generateShips();
  public shipsInDocksIds: Array<shipId> = allShipIds.slice(0);
  public playerGameField: Cell[][] = generateBattleField();

  public draggingState: DraggingState;

  constructor() {
    makeAutoObservable(this);

    this.draggingState = new DraggingState(this);
  }

  private getSideCells = (cells: Array<[number, number]>) => {
    const sideCellsIndexes = new Set<number>();

    cells.forEach(([row, column]) => {
      for (let i = -1; i <= 1; i++) {
        const sideCellRow = row + i;

        if (sideCellRow < 0) continue;
        if (sideCellRow > 9) break;

        for (let j = -1; j <= 1; j++) {
          const sideColumnRow = column + j;

          if (sideColumnRow < 0) continue;
          if (sideColumnRow > 9) break;

          sideCellsIndexes.add(cell2Index(sideCellRow, sideColumnRow));
        }
      }
    });

    cells.forEach(([row, column]) => sideCellsIndexes.delete(cell2Index(row, column)));

    return Array.from(sideCellsIndexes.values()).map((cellIndex) => index2Cell(cellIndex));
  };

  public dropShip = (hoveredRow: number, hoveredColumn: number) => {
    const cells = this.draggingState.relevantRelatedCells;

    if (cells.length) {
      const shipId = this.draggingState.shipId;

      if (shipId) {
        cells.forEach(([rowIndex, columnIndex]) => {
          const cell = this.playerGameField[rowIndex][columnIndex];

          cell.setHover(false, false);
          cell.bindShip(shipId);
        });

        this.getSideCells(cells).forEach(([row, column]) => {
          this.playerGameField[row][column].sideToCells.add(shipId);
        });

        this.shipsInDocksIds = this.shipsInDocksIds.slice(1);
      }

      this.draggingState.unHover([hoveredRow, hoveredColumn]);
    }
  };

  public unDropShip = (row: number, column: number) => {
    const { shipId } = this.playerGameField[row][column];

    if (shipId) {
      for (let rowIndex = 0; rowIndex < 10; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 10; columnIndex++) {
          const cell = this.playerGameField[rowIndex][columnIndex];

          cell.sideToCells.delete(shipId);

          if (cell.shipId === shipId) cell.unbindShip();
        }
      }

      this.shipsInDocksIds.push(shipId!);
    }
  };

  public get shipInPier() {
    return this.shipsInDocksIds.length ? this.ships.get(this.shipsInDocksIds[0])! : null;
  }

  public get shipsInDocks() {
    const unPlacedShipsCount = [0, 0, 0, 0];

    this.shipsInDocksIds.forEach((shipId) => {
      ++unPlacedShipsCount[(this.ships.get(shipId) as Ship).length - 1];
    });

    return unPlacedShipsCount;
  }

  public toggleDirectionShipInPier = () => {
    const shipInPier = this.shipInPier;

    if (shipInPier) shipInPier.toggleDirection();
  };
}
