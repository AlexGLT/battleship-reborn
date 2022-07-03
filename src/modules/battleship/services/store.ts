import { makeAutoObservable } from "mobx";

import { PlayerFieldState } from "./player-field-state";
import { DraggingState } from "./dragging-state";
import { Ship } from "./state-elements";
import { CellPosition } from "../typedefs";

import { directions, fieldSize, shipLengthsAndCounts } from "../constants";

import { generateShips, getRelatedCells, getSideCells } from "./utils";

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

    public getShipSpecs = (shipId: string) => {
        const ship = this.ships.get(shipId);

        return ship ? { direction: ship.direction, length: ship.length } : {};
    };

    public moveInShip = (shipId: string) => {
        this.shipsInDocksIds.push(shipId);
    };

    public moveOutShip = () => {
        this.shipsInDocksIds.splice(0, 1);
    };

    public toggleDirectionShipInPier = () => {
        const shipInPier = this.shipInPier;

        if (shipInPier) shipInPier.toggleDirection();
    };

    public clearBattleField = () => {
        const { height, width } = fieldSize;

        for (let cellX = 0; cellX < height; cellX++) {
            for (let cellY = 0; cellY < width; cellY++) {
                const shipId = this.playerFieldState.removeShip(cellX, cellY);

                if (shipId) {
                    this.moveInShip(shipId);
                }
            }
        }
    };

    public randomShips = () => {
        this.clearBattleField();

        const cells = Array(100)
            .fill(0)
            .map((_, index) => ({ index, available: true }));

        for (const { id, toggleDirection, length, direction } of this.ships.values()) {
            let shipDirection = direction;

            if (Math.round(Math.random())) {
                toggleDirection();
                shipDirection = shipDirection === directions.horizontal ? directions.vertical : directions.horizontal;
            }

            const suitableCells = cells
                .filter(({ available }) => available)
                .filter((cell) => {
                    const [x, y] = CellPosition.index2position(cell.index);

                    return this.playerFieldState.checkAvailability(
                        length,
                        getRelatedCells(x, y, length, shipDirection)
                    );
                });


            const randomValue = Math.floor(Math.random() * suitableCells.length);
            const [x, y] = CellPosition.index2position(
                suitableCells[randomValue].index
            );

            const relatedCells = getRelatedCells(x, y, length, shipDirection);
            relatedCells.forEach((cell) => {
                cells[cell.index].available = false;
            });

            const sideCells = getSideCells(relatedCells);
            sideCells.forEach((cell) => {
                cells[cell.index].available = false;
            });

            this.playerFieldState.placeShip(id, relatedCells, sideCells);
            this.moveOutShip();
        }
    };
}
