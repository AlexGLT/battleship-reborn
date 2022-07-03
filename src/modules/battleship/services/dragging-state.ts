import { makeAutoObservable } from "mobx";

import { BattleShipStore } from "./store";
import { CellPosition } from "../typedefs";
import { getRelatedCells, getSideCells } from "./utils";

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
        return this.shipId ? this.shipStore.getShipSpecs(this.shipId) : {};
    }

    public get currentRelatedCells(): Array<CellPosition> {
        const { direction, length } = this.shipSpecs;

        if (direction && length && this.hoveredCell && this.deckIndex !== null) {
            return getRelatedCells(this.hoveredCell.x, this.hoveredCell.y, length, direction, this.deckIndex);
        }

        return [];
    }

    public get currentSideCells(): Array<CellPosition> {
        const relatedCells = this.currentRelatedCells;

        return relatedCells.length ? getSideCells(relatedCells) : [];
    }

    private hover = () => {
        const { length } = this.shipSpecs;

        if (length) {
            const { checkAvailability, hoverCells } = this.shipStore.playerFieldState;

            this.canDrop = checkAvailability(length, this.currentRelatedCells);

            hoverCells(true, this.currentRelatedCells);
        }
    };

    private unHover = () => {
        const { hoverCells } = this.shipStore.playerFieldState;

        hoverCells(false, this.currentRelatedCells);
    };

    public setHoverCell = (hoverCell: CellPosition | null) => {
        if (this.hoveredCell) this.unHover();

        this.hoveredCell = hoverCell;

        if (hoverCell) this.hover();
    };

    public dropShip = () => {
        const { shipId, hoveredCell, canDrop, currentRelatedCells, currentSideCells } = this;
        const { moveOutShip, playerFieldState: { placeShip } } = this.shipStore;

        let success = false;

        if (currentRelatedCells.length && hoveredCell) {
            if (canDrop && shipId) {
                placeShip(shipId, currentRelatedCells, currentSideCells);
                moveOutShip();

                success = true;
            }

            this.setHoverCell(null);
        }

        this.stopDragging();

        return { success };
    };

    public raiseShip = (clickedCellX: number, clickedCellY: number) => {
        const { moveInShip, playerFieldState: { removeShip } } = this.shipStore;

        const shipId = removeShip(clickedCellX, clickedCellY);

        if (shipId) {
            moveInShip(shipId);
        }
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
