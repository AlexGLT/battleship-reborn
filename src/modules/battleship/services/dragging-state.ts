import { makeAutoObservable } from "mobx";

import { BattleShipStore } from "./store";
import { shipId } from "../typedefs";

import { directions } from "../constants";

import range from "lodash-es/range";
import { index2Cell, cell2Index } from "./utils";

export class DraggingState {
  private shipStore: BattleShipStore;

  public shipId: shipId | null = null;
  public deckIndex: number | null = null;

  public hoveredCell: [(number | null), (number | null)] = [null, null];

  public canDrop: boolean | null = null;

  public supervisedCells: Map<number, [number, number]> = new Map<number, [number, number]>();

  constructor(store: BattleShipStore) {
    makeAutoObservable(this);

    this.shipStore = store;
  }

  private get shipSpecs() {
    const ship = this.shipId ? this.shipStore.ships.get(this.shipId) : null;

    return ship ? { direction: ship.direction, length: ship.length } : {};
  }

  public getRelatedCells = ([row, column]: [number, number]): Array<[number, number]> => {
    const { length, direction } = this.shipSpecs;

    if (direction && length) {
      if (this.deckIndex !== null && row !== null && column !== null) {
        const isHorizontal = direction === directions.horizontal;
        const firstDeckPlace = (isHorizontal ? column : row) - this.deckIndex;

        return range(Math.max(firstDeckPlace, 0), Math.min(firstDeckPlace + length, 10))
          .map((index) => isHorizontal ? [row, index] : [index, column]);
      }
    }

    return [];
  };

  public get relevantRelatedCells(): Array<[number, number]> {
    const [hoverRow, hoverColumn] = this.hoveredCell;

    if (hoverRow === null || hoverColumn === null) {
      return [];
    }

    return Array.from(this.supervisedCells.entries())
      .filter(([, [localHoverRow, localHoverColumn]]) => {
        return cell2Index(localHoverRow, localHoverColumn) === cell2Index(hoverRow, hoverColumn);
      })
      .map(([cellIndex]) => index2Cell(cellIndex));
  }

  public hover = (hoveredCell: [number, number]) => {
    const { length } = this.shipSpecs;

    if (length) {
      this.hoveredCell = hoveredCell;

      const relatedCells = this.getRelatedCells(hoveredCell);

      const isCollision = relatedCells.reduce((isCollision, [row, column]) => {
        const cell = this.shipStore.playerGameField[row][column];

        return isCollision || cell.isBusy || !!cell.sideToCells.size;
      }, false);

      this.canDrop = relatedCells.length === length && !isCollision;

      relatedCells.forEach(([row, column]) => {
        this.supervisedCells.set(cell2Index(row, column), hoveredCell);

        this.shipStore.playerGameField[row][column].setHover(true, this.canDrop);
      });
    }
  };

  public unHover = (hoveredCell: [number, number]) => {
    this.getRelatedCells(hoveredCell).forEach(([row, column]) => {
      const [localHoverRow, localHoverColumn] = this.supervisedCells.get(cell2Index(row, column)) || [];

      if (localHoverRow !== undefined) {
        if (localHoverRow === hoveredCell[0] && localHoverColumn === hoveredCell[1]) {
          this.supervisedCells.delete(cell2Index(row, column));

          this.shipStore.playerGameField[row][column].setHover(false, null);
        }
      }
    });

    if (this.hoveredCell[0] === hoveredCell[0] && this.hoveredCell[1] === hoveredCell[1]) {
      this.hoveredCell = [null, null];
    }
  };

  public startDragging = (shipId: shipId | null, deckIndex: number) => {
    if (shipId) {
      this.shipId = shipId;
      this.deckIndex = deckIndex;
    }
  };

  public stopDragging = () => {
    this.shipId = null;
    this.deckIndex = null;
    this.hoveredCell = [null, null];
  };
}
