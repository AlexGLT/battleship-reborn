import { makeAutoObservable } from "mobx";

import { PlayerFieldState } from "./player-field-state";
import { DraggingState } from "./dragging-state";
import { Ship } from "./state-elements";

import { fieldSize, shipLengthsAndCounts } from "../constants";

import { generateShips } from "./utils";

export class BattleShipStore {
  public playerFieldState: PlayerFieldState;
  public draggingState: DraggingState;

  public ships: Map<string, Ship>;
  public shipsInDocksIds: Array<string>;

  constructor() {
    makeAutoObservable(this);

    this.playerFieldState = new PlayerFieldState(this);
    this.draggingState = new DraggingState(this);

    this.ships = generateShips();
    this.shipsInDocksIds = Array.from(this.ships.keys());
  }

  public getShipSpecs = (shipId: string) => {
    const ship = this.ships.get(shipId);

    return ship ? { direction: ship.direction, length: ship.length } : {};
  };

  public dropShip = () => {
    let success = false;

    const cells = this.playerFieldState.relevantRelatedCells;

    if (cells.length && this.draggingState.hoveredCell) {
      if (this.draggingState.canDrop) {
        const shipId = this.draggingState.shipId;

        if (shipId) {
          this.playerFieldState.placeShip(shipId);

          this.shipsInDocksIds.splice(0, 1);
        }

        success = true;
      }

      this.draggingState.setHoverCell(null);
    }

    this.draggingState.stopDragging();

    return { success };
  };

  public raiseShip = (clickedCellX: number, clickedCellY: number) => {
    const shipId = this.playerFieldState.removeShip(clickedCellX, clickedCellY);

    if (shipId) {
      this.shipsInDocksIds.push(shipId);
    }
  };

  public get shipInPier() {
    return this.shipsInDocksIds.length ? this.ships.get(this.shipsInDocksIds[0])! : null;
  }

  public clearBattleField = () => {
    const { height, width } = fieldSize;

    for (let cellX = 0; cellX < height; cellX++) {
      for (let cellY = 0; cellY < width; cellY++) {
        this.raiseShip(cellX, cellY);
      }
    }
  };

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
