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

    public get relevantRelatedCells(): Array<CellPosition> {
        const { shipSpecs: { length, direction }, deckIndex, hoveredCell } = this.battleShipStore.draggingState;

        if (direction && length && hoveredCell && deckIndex !== null) {
            return getRelatedCells(hoveredCell.x, hoveredCell.y, length, direction, deckIndex);
        }

        return [];
    }

    public get relevantSideCells(): Array<CellPosition> {
        const relatedCells = this.relevantRelatedCells;

        return relatedCells.length ? getSideCells(relatedCells) : [];
    }

    public getCellState = (cellX: number, cellY: number) => this.playerField[cellX][cellY];

    public checkCollision = (relatedCells: Array<CellPosition>) => {
        return relatedCells.reduce((isCollision, { x: relatedCellX, y: relatedCellY }) => {
            const cell = this.playerField[relatedCellX][relatedCellY];

            return isCollision || cell.isBusy || !!cell.adjoinedShipsIds.size;
        }, false);
    };

    public hoverCells = (relatedCells: Array<CellPosition>, hover: boolean) => {
        relatedCells.forEach(({ x, y }) => {
            this.playerField[x][y].setHover(hover);
        });
    };

    public placeShip = (shipId: string) => {
        const relatedCells = this.relevantRelatedCells;
        relatedCells.forEach(({ x: relatedCellX, y: relatedCellY }, index) => {
            return this.playerField[relatedCellX][relatedCellY].bindShip(shipId, index);
        });

        const sideCells = this.relevantSideCells;
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
                this.playerField[cellX][cellY].adjoinedShipsIds.delete(shipId);
            });
        }

        return shipId;
    };
}
