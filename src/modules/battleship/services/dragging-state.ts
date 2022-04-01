import { makeAutoObservable } from "mobx";

import { BattleShipStore } from "./store";
import { CellPosition } from "../typedefs";

import { directions } from "../constants";

import range from "lodash-es/range";

export class DraggingState {
  private shipStore: BattleShipStore;

  public shipId: string | null = null;
  public deckIndex: number | null = null;

  public hoveredCell: CellPosition | null = null;

  public canDrop: boolean | null = null;

  // [relatedCell, hoveredCell]
  public supervisedCells: Map<number, number> = new Map<number, number>();

  constructor(store: BattleShipStore) {
    makeAutoObservable(this);

    this.shipStore = store;
  }

  private get shipSpecs() {
    const ship = this.shipId ? this.shipStore.ships.get(this.shipId) : null;

    return ship ? { direction: ship.direction, length: ship.length } : {};
  }

  public getRelatedCells = (x: number, y: number): Array<CellPosition> => {
    const { length, direction } = this.shipSpecs;

    if (direction && length && this.deckIndex !== null) {
      const isHorizontal = direction === directions.horizontal;
      const firstDeckPlace = (isHorizontal ? y : x) - this.deckIndex;

      return range(Math.max(firstDeckPlace, 0), Math.min(firstDeckPlace + length, 10))
        .map((axis) => isHorizontal ? new CellPosition(x, axis) : new CellPosition(axis, y));
    }

    return [];
  };

  public get relevantRelatedCells(): Array<CellPosition> {
    if (!this.hoveredCell) return [];

    return Array.from(this.supervisedCells.entries())
      .filter(([, relatedCellPositionIndex]) => {
        return relatedCellPositionIndex === this.hoveredCell?.index;
      })
      .map(([cellIndex]) => {
        const { x, y } = CellPosition.index2Position(cellIndex);

        return new CellPosition(x, y);
      });
  }

  public setHoverCell = (hoverCell: CellPosition | null) => {
    this.hoveredCell = hoverCell;
  };

  public hover = (hoveredCellX: number, hoveredCellY: number) => {
    const { length } = this.shipSpecs;

    if (length) {
      const hoveredCell = new CellPosition(hoveredCellX, hoveredCellY);

      const relatedCells = this.getRelatedCells(hoveredCellX, hoveredCellY);

      const isCollision = relatedCells.reduce((isCollision, { x: relatedCellX, y: relatedCellY }) => {
        const cell = this.shipStore.playerGameField[relatedCellX][relatedCellY];

        return isCollision || cell.isBusy || !!cell.sideToCells.size;
      }, false);

      this.canDrop = relatedCells.length === length && !isCollision;

      relatedCells.forEach((relatedCell) => {
        this.supervisedCells.set(relatedCell.index, hoveredCell.index);

        this.shipStore.playerGameField[relatedCell.x][relatedCell.y].setHover(true, this.canDrop);
      });

      this.setHoverCell(hoveredCell);
    }
  };

  public unHover = (unHoveredCellX: number, unHoveredCellY: number) => {
    this.getRelatedCells(unHoveredCellX, unHoveredCellY).forEach((relatedCell) => {
      const relatedHoveredCellIndex = this.supervisedCells.get(relatedCell.index);

      if (CellPosition.position2Index(unHoveredCellX, unHoveredCellY) === relatedHoveredCellIndex) {
        this.supervisedCells.delete(relatedCell.index);

        this.shipStore.playerGameField[relatedCell.x][relatedCell.y].setHover(false, null);
      }
    });
  };

  public get isOverPlayerField() {
    return !!this.hoveredCell;
  }

  public startDragging = (shipId: string, deckIndex: number) => {
    this.shipId = shipId;
    this.deckIndex = deckIndex;
  };

  public stopDragging = () => {
    this.shipId = null;
    this.deckIndex = null;
    this.hoveredCell = null;
    this.canDrop = null;
  };
}
