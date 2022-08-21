import { makeAutoObservable } from "mobx";

import { CellStatus } from "/constants";

export class ProponentCell {
    public shipId: string | null = null;
    public deckIndex: number | null = null;

    public isShot: boolean = false;
    public isBusy: boolean = false;
    public isHovered: boolean = false;
    public canDrop: boolean | null = null;

    public adjoinedShipsIds: Set<string> = new Set<string>();

    constructor() {
        makeAutoObservable(this);
    }

    public setIsHovered = (isHovered: boolean, canDrop: boolean | null) => {
        this.isHovered = isHovered;
        this.canDrop = canDrop;
    };

    public get status(): CellStatus {
        const { shipId, adjoinedShipsIds, isHovered, isBusy, canDrop, isShot } = this;

        const containsShip = !!shipId;
        const isAdjoined = adjoinedShipsIds.size;

        if (isShot && containsShip) return CellStatus.isShotHit;
        if (isShot && !containsShip) return CellStatus.isShotMiss;
        if (isHovered && (isBusy || isAdjoined)) return CellStatus.isCollided;
        if (isHovered && !canDrop) return CellStatus.cantDrop;
        if (isBusy) return CellStatus.isBusy;
        if (isAdjoined) return CellStatus.isAdjoined;
        if (isHovered && canDrop) return CellStatus.canDrop;

        return CellStatus.none;
    }

    public setAdjoinedShip(shipId: string, set: boolean) {
        set ? this.adjoinedShipsIds.add(shipId) : this.adjoinedShipsIds.delete(shipId);
    }

    public setShot = () => {
        this.isShot = true;
    };

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
