import { isNull } from "lodash";
import { makeAutoObservable } from "mobx";

import { RootStore } from "../root-store";
import { CellPosition } from "/models";
import { getRelatedCells, getSideCells } from "./utils";

export class DragAndDropController {
    private rootStore: RootStore;

    public shipId: string | null = null;
    public deckIndex: number | null = null;

    public hoveredCell: CellPosition | null = null;

    public canDrop: boolean | null = null;

    constructor(store: RootStore) {
        makeAutoObservable(this);

        this.rootStore = store;
    }

    public get isOverPlayerField() {
        return !!this.hoveredCell;
    }

    public get shipSpecs() {
        return this.shipId ? this.rootStore.shipsController.getShipSpecs(this.shipId) : {};
    }

    public get currentRelatedCells(): Array<CellPosition> {
        const { direction, length } = this.shipSpecs;

        if (!isNull(direction) && length && this.hoveredCell && !isNull(this.deckIndex)) {
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
            const { checkAvailability, hoverCells } = this.rootStore.proponentField;

            this.canDrop = checkAvailability(length, this.currentRelatedCells);

            console.log(this.currentRelatedCells);

            hoverCells(true, this.canDrop, this.currentRelatedCells);
        }
    };

    private unHover = () => {
        const { hoverCells } = this.rootStore.proponentField;

        hoverCells(false, null, this.currentRelatedCells);
    };

    public setHoverCell = (hoverCell: CellPosition | null) => {
        if (this.shipId) {
            if (this.hoveredCell) this.unHover();

            this.hoveredCell = hoverCell;

            if (hoverCell) this.hover();
        }
    };

    public dropShip = () => {
        const { moveOutShip } = this.rootStore.shipsController;
        const { placeShip } = this.rootStore.proponentField;
        const { shipId, hoveredCell, canDrop, currentRelatedCells, currentSideCells } = this;

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
        const { moveInShip } = this.rootStore.shipsController;
        const { removeShip } = this.rootStore.proponentField;

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
