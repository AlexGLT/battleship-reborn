import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";

export class Cell {
  public index: number;
  public shipId: shipId | null = null;
  public isShot: boolean = false;
  public isBusy: boolean = false;
  public isHovered: boolean = false;

  public canDrop: boolean | null = null;

  constructor(index: number) {
    makeAutoObservable(this);

    this.index = index;
  }

  setHover = (isHovered: boolean, canDrop: boolean | null) => {
    this.isHovered = isHovered;
    this.canDrop = canDrop;
  };

  bindShip = (shipId: shipId) => {
    this.shipId = shipId;
    this.isBusy = true;
  };

  unbindShip = () => {
    this.shipId = null;
    this.isBusy = false;
  };
}
