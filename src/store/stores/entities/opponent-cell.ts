import { makeAutoObservable } from "mobx";

import { CellStatus, ShootResult } from "/constants";

export class OpponentCell {
    public isHit: boolean | null = null;
    public isShipKilled: boolean | null = null;
    // public isDraggedOver: boolean = false;
    // public canDrop: boolean | null = null;

    // public dragOver = (isHovered: boolean) => {
    //     this.isDraggedOver = isHovered;
    // };

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    public shot = (shootResult: ShootResult) => {
        this.isHit = shootResult === ShootResult.hit || shootResult === ShootResult.kill;
        this.isShipKilled = shootResult === ShootResult.kill;
    };

    public get status(): CellStatus {
        const { isHit, isShipKilled } = this;

        if (isShipKilled) return CellStatus.isShipKilled;
        if (isHit && !isShipKilled) return CellStatus.isShotHit;
        if (isHit === false) return CellStatus.isShotMiss;

        return CellStatus.none;
    }
}
