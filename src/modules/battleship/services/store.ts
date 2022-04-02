import { makeAutoObservable } from "mobx";

import { DraggingState } from "./dragging-state";
import { Ship } from "./ship";

import { shipLengthsAndCounts } from "../constants";

import { generateShips } from "./utils";
import { PlayerFieldState } from "./player-field-state";

export class BattleShipStore {
  public playerGameFieldState: PlayerFieldState;
  public draggingState: DraggingState;

  public ships: Map<string, Ship>;
  public shipsInDocksIds: Array<string>;

  constructor() {
    makeAutoObservable(this);

    this.playerGameFieldState = new PlayerFieldState(this);
    this.draggingState = new DraggingState(this);

    this.ships = generateShips();
    this.shipsInDocksIds = Array.from(this.ships.keys());
  }

  public dropShip = () => {
    let success = false;

    const cells = this.playerGameFieldState.relevantRelatedCells;

    if (cells.length && this.draggingState.hoveredCell) {
      if (this.draggingState.canDrop) {
        const shipId = this.draggingState.shipId;

        if (shipId) {
          this.playerGameFieldState.placeShip(shipId);

          this.shipsInDocksIds = this.shipsInDocksIds.slice(1);
        }

        success = true;
      }

      this.draggingState.setHoverCell(null);
    }

    this.draggingState.stopDragging();

    return { success };
  };

  public unDropShip = (clickedCellX: number, clickedCellY: number) => {
    const shipId = this.playerGameFieldState.unPlaceShip(clickedCellX, clickedCellY);

    if (shipId) {
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
