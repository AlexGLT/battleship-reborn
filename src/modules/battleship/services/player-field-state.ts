import { makeAutoObservable } from "mobx";

import { CellPosition } from "../typedefs";
import { BattleShipStore } from "./store";
import { Cell } from "./state-elements";

import { generateBattleField, getRelatedCells, getSideCells } from "./utils";

export class PlayerFieldState {
    private battleShipStore: BattleShipStore;

    public playerField: Cell[][] = generateBattleField();

    constructor(store: BattleShipStore) {
        makeAutoObservable(this);

        this.battleShipStore = store;
    }

    public getCellState = (cellX: number, cellY: number) => this.playerField[cellX][cellY];

    public checkCollision = (relatedCells: Array<CellPosition>) => {
        return relatedCells.reduce((isCollision, { x: relatedCellX, y: relatedCellY }) => {
            const { isBusy, adjoinedShipsIds } = this.playerField[relatedCellX][relatedCellY];

            return isCollision || isBusy || !!adjoinedShipsIds.size;
        }, false);
    };

    public checkAvailability = (length: number, relatedCells: Array<CellPosition>) => {
        return relatedCells.length === length && !this.checkCollision(relatedCells);
    };

    public hoverCells = (hover: boolean, relatedCells: Array<CellPosition>) => {
        relatedCells.forEach(({ x, y }) => {
            this.playerField[x][y].setHover(hover);
        });
    };

    public placeShip = (shipId: string, relatedCells: Array<CellPosition>, sideCells: Array<CellPosition>) => {
        relatedCells.forEach(({ x: relatedCellX, y: relatedCellY }, index) => {
            return this.playerField[relatedCellX][relatedCellY].bindShip(shipId, index);
        });

        sideCells.forEach(({ x: sideCellX, y: sideCellY }) => {
            return this.playerField[sideCellX][sideCellY].setAdjoinedShip(shipId, true);
        });
    };

    public removeShip = (clickedCellX: number, clickedCellY: number) => {
        const { shipId, deckIndex } = this.playerField[clickedCellX][clickedCellY];

        if (shipId) {
            const { direction, length } = this.battleShipStore.getShipSpecs(shipId);

            const relatedCells = getRelatedCells(clickedCellX, clickedCellY, length!, direction!, deckIndex!);
            relatedCells.forEach(({ x: cellX, y: cellY }) => {
                this.playerField[cellX][cellY].unbindShip();
            });

            const sideCells = getSideCells(relatedCells);
            sideCells.forEach(({ x: cellX, y: cellY }) => {
                this.playerField[cellX][cellY].setAdjoinedShip(shipId, false);
            });
        }

        return shipId;
    };
}
