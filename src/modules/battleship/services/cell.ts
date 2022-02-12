import { makeAutoObservable } from "mobx";
import { shipsId } from "../constants";

export class Cell {
  public index: number;
  public shipId: typeof shipsId[number] | null = null;
  public isShot: boolean = false;
  public isBusy: boolean = false;

  public isHovered: boolean = false;
  public canDrop: boolean | null = null;

  constructor(index: number) {
    this.index = index;

    makeAutoObservable(this);
  }

  setIsHovered = (isHovered: boolean, canDrop: boolean) => {
    this.isHovered = isHovered;
    this.canDrop = canDrop;
  };
}
