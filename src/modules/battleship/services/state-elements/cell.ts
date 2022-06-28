import { makeAutoObservable } from "mobx";

import { CellState } from "../../typedefs";

export class Cell {
    public shipId: string | null = null;
    public deckIndex: number | null = null;

    public isShot: boolean = false;
    public isBusy: boolean = false;
    public isHovered: boolean = false;

    public adjoinedShipsIds: Set<string> = new Set<string>();

    constructor() {
        makeAutoObservable(this);
    }

    public setHover = (isHovered: boolean) => {
        this.isHovered = isHovered;
    };

    public get status(): CellState {
        return {
            isHovered: this.isHovered,
            isBusy: this.isBusy,
            isAdjoined: !!this.adjoinedShipsIds.size
        };
    }

    public setAdjoinedShip(shipId: string, set: boolean) {
        set ? this.adjoinedShipsIds.add(shipId) : this.adjoinedShipsIds.delete(shipId);
    }

    public bindShip = (shipId: string, deckIndex: number) => {
        this.shipId = shipId;
        this.deckIndex = deckIndex;
        this.isBusy = true;
    };

    public unbindShip = () => {
        this.shipId = null;
        this.deckIndex = null;
        this.isBusy = false;
    };
}
