import { makeAutoObservable } from "mobx";

import { CellStatus, shootResults } from "/constants";

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

    public shot = (shootResult: shootResults) => {
        this.isHit = shootResult === shootResults.hit || shootResult === shootResults.kill;
        this.isShipKilled = shootResult === shootResults.kill;
    };

    public get status(): CellStatus {
        const { isHit, isShipKilled } = this;

        if (isShipKilled) return CellStatus.isShipKilled;
        if (isHit && !isShipKilled) return CellStatus.isShipKilled;
        if (isHit === false) return CellStatus.isShotMiss;

        return CellStatus.none;
    }
}
