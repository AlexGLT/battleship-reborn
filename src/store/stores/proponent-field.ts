import { makeAutoObservable } from "mobx";

import { RootStore } from "../root-store";

import { CellPosition } from "/models";
import { ProponentCell } from "./entities";

import { generateBattleField, getRelatedCells, getSideCells } from "./utils";

export class ProponentField {
    private rootStore: RootStore;

    public playerField: ProponentCell[][] = generateBattleField() as ProponentCell[][];

    constructor(store: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });

        this.rootStore = store;
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

    public hoverCells = (hover: boolean, canDrop: boolean | null, relatedCells: Array<CellPosition>) => {
        relatedCells.forEach(({ x, y }) => {
            this.playerField[x][y].setIsHovered(hover, canDrop);
        });
    };

    public getShipCoords = (shipId: string) => {
        return this.playerField
            .flat()
            .map((cell, index) => ({
                index,
                shipId: cell.shipId,
            }))
            .filter((cell) => cell.shipId === shipId)
            .map(({ index }) => CellPosition.index2position(index))
            .sort(([firstX], [secondX]) => firstX - secondX);
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
            const { direction, length } = this.rootStore.shipsController.getShipSpecs(shipId);

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

    public setShot = (cellX: number, cellY: number) => {
        this.playerField[cellX][cellY].setShot();
    };
}
