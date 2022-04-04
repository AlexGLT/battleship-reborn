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

  public get isOverPlayerField() {
    return !!this.hoveredCell;
  }

  public get shipSpecs() {
    const ship = this.shipId ? this.shipStore.ships.get(this.shipId) : null;

    return ship ? { direction: ship.direction, length: ship.length } : {};
  }

  private hover = () => {
    const { length } = this.shipSpecs;

    if (length) {
      const { relevantRelatedCells, checkCollision, hoverCells } = this.shipStore.playerFieldState;

      const isCollision = checkCollision(relevantRelatedCells);
      const canDrop = relevantRelatedCells.length === length && !isCollision;

      hoverCells(relevantRelatedCells, true, canDrop);

      this.canDrop = canDrop;
    }
  };

  private unHover = () => {
    const { relevantRelatedCells, hoverCells } = this.shipStore.playerFieldState;

    hoverCells(relevantRelatedCells, false, null);
  };

  public setHoverCell = (hoverCell: CellPosition | null) => {
    if (this.hoveredCell) this.unHover();

    this.hoveredCell = hoverCell;

    if (hoverCell) this.hover();
  };

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
