import { makeAutoObservable } from "mobx";

import { cellStatuses } from "../constants";

export class Cell {
  public shipId: string | null = null;
  public isShot: boolean = false;
  public isBusy: boolean = false;
  public isHovered: boolean = false;

  public sideToCells: Set<string> = new Set<string>();

  public canDrop: boolean | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public setHover = (isHovered: boolean, canDrop: boolean | null) => {
    this.isHovered = isHovered;
    this.canDrop = canDrop;
  };

  public get status() {
    if (this.isHovered && (this.isBusy || this.sideToCells.size)) return cellStatuses.collision;
    else if (this.isHovered && !this.canDrop) return cellStatuses.hoveredBusy;
    else if (this.isBusy) return cellStatuses.busy;
    else if (this.sideToCells.size) return cellStatuses.side;
    else if (this.isHovered && this.canDrop) return cellStatuses.hoveredFree;

    return undefined;
  }

  public bindShip = (shipId: string) => {
    this.shipId = shipId;
    this.isBusy = true;
    this.canDrop = null;
  };

  public unbindShip = () => {
    this.shipId = null;
    this.isBusy = false;
  };
}
