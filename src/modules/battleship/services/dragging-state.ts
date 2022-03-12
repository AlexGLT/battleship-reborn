import { makeAutoObservable } from "mobx";

import range from "lodash-es/range";

import { BattleShipStore } from "./store";
import { shipId } from "../typedefs";

import { directions } from "../constants";

export class DraggingState {
  private shipStore: BattleShipStore;

  public shipId: shipId | null = null;
  public deckIndex: number | null = null;

  public hoverRow: number | null = null;
  public hoverColumn: number | null = null;

  private get shipSpecs() {
    const ship = this.shipId ? this.shipStore.ships.get(this.shipId) : null;

    return ship ? { direction: ship.direction, length: ship.length } : {};
  }

  private get firstDeckPlace() {
    const { length, direction } = this.shipSpecs;

    if (direction && length) {
      if (this.deckIndex !== null && this.hoverRow !== null && this.hoverColumn !== null) {
        const ship = this.shipId ? this.shipStore.ships.get(this.shipId) : null;

        if (ship) {
          const { direction } = ship;

          const isHorizontal = direction === directions.horizontal;

          const mainAxis = isHorizontal ? this.hoverColumn : this.hoverRow;

          return mainAxis - this.deckIndex;
        }
      }
    }

    return null;
  }

  public get hoveredCells(): number[][] {
    const { length, direction } = this.shipSpecs;
    const firstDeckPlace = this.firstDeckPlace;

    if (direction && length && firstDeckPlace !== null) {
      const isHorizontal = direction === directions.horizontal;

      return range(Math.max(firstDeckPlace, 0), Math.min(firstDeckPlace + length, 10)).map((index) => {
        return isHorizontal ? [this.hoverRow as number, index] : [index, this.hoverColumn as number];
      });
    }

    return [];
  }

  public get canDrop() {
    const { length } = this.shipSpecs;
    const firstDeckPlace = this.firstDeckPlace;

    if (length && firstDeckPlace !== null) {
      return firstDeckPlace >= 0 && firstDeckPlace + length - 1 < 10;
    }

    return null;
  }

  startDragging = (shipId: shipId | null, deckIndex: number) => {
    this.shipId = shipId;
    this.deckIndex = deckIndex;
  };

  hoverCell = (row: number | null, column: number | null) => {
    this.hoveredCells.forEach(([rowIndex, columnIndex]) => {
      this.shipStore.playerGameField[rowIndex][columnIndex].setHover(false, null);
    });

    this.hoverRow = row;
    this.hoverColumn = column;

    this.hoveredCells.forEach(([rowIndex, columnIndex]) => {
      this.shipStore.playerGameField[rowIndex][columnIndex].setHover(true, this.canDrop);
    });
  };

  unHoverCell = (row: number | null, column: number | null) => {
    if (this.hoverColumn === column && this.hoverRow === row) {
      this.hoveredCells.forEach(([rowIndex, columnIndex]) => {
        this.shipStore.playerGameField[rowIndex][columnIndex].setHover(false, null);
      });
    }
  };

  stopDragging = () => {
    this.shipId = null;
    this.deckIndex = null;
    this.hoverRow = null;
    this.hoverColumn = null;
  };

  constructor(store: BattleShipStore) {
    makeAutoObservable(this);

    this.shipStore = store;
  }
}
