import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";

import { cellStatuses } from "../constants";

export class Cell {
  public index: number;
  public shipId: shipId | null = null;
  public isShot: boolean = false;
  public isBusy: boolean = false;
  public isHovered: boolean = false;

  public sideToCells: Set<shipId> = new Set<shipId>();

  public canDrop: boolean | null = null;

  constructor(index: number) {
    makeAutoObservable(this);

    this.index = index;
  }


  public setHover = (isHovered: boolean, canDrop: boolean | null) => {
    this.isHovered = isHovered;
    this.canDrop = canDrop;
  };

  public get status() {
    if (this.isHovered && this.isBusy) return cellStatuses.collision;
    else if (this.isHovered && !this.canDrop) return cellStatuses.hoveredBusy;
    else if (this.isBusy) return cellStatuses.busy;
    else if (this.sideToCells.size) return cellStatuses.side;
    else if (this.isHovered && this.canDrop) return cellStatuses.hoveredFree;

    return undefined;
  }

  public bindShip = (shipId: shipId) => {
    this.shipId = shipId;
    this.isBusy = true;
    this.canDrop = null;
  };

  unbindShip = () => {
    this.shipId = null;
    this.isBusy = false;
  };
}
