import { makeAutoObservable } from "mobx";

import { BattleShipStore } from "./store";
import { CellPosition } from "../typedefs";

export class DraggingState {
  private shipStore: BattleShipStore;

  public shipId: string | null = null;
  public deckIndex: number | null = null;

  public hoveredCell: CellPosition | null = null;

  public canDrop: boolean | null = null;

  constructor(store: BattleShipStore) {
    makeAutoObservable(this);

    this.shipStore = store;
  }

  public get shipSpecs() {
    const ship = this.shipId ? this.shipStore.ships.get(this.shipId) : null;

    return ship ? { direction: ship.direction, length: ship.length } : {};
  }

  public hover = () => {
    const { length } = this.shipSpecs;

    if (length) {
      const relatedCells = this.shipStore.playerGameFieldState.relevantRelatedCells;

      const isCollision = this.shipStore.playerGameFieldState.checkCollision(relatedCells);

      this.canDrop = relatedCells.length === length && !isCollision;

      this.shipStore.playerGameFieldState.hoverCells(relatedCells, true, this.canDrop);
    }
  };

  public unHover = () => {
    this.shipStore.playerGameFieldState.hoverCells(this.shipStore.playerGameFieldState.relevantRelatedCells, false, null);
  };

  public setHoverCell = (hoverCell: CellPosition | null) => {
    if (this.hoveredCell) this.unHover();

    this.hoveredCell = hoverCell;

    if (hoverCell) this.hover();
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
