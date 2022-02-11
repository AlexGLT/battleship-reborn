import { flexDirections, locations } from "./constants";
import { makeAutoObservable } from "mobx";

export interface ShipInterface {
  id: string,
  length: number,
  direction: flexDirections,
  placement: locations
}

export class Ship implements ShipInterface {
  public id: string;
  public length: number;
  public direction: flexDirections;
  public placement: locations;

  constructor(id: string, length: number, direction = flexDirections.horizontal, placement = locations.docks) {
    this.id = id;
    this.length = length;
    this.direction = direction;
    this.placement = placement;

    makeAutoObservable(this);
  }

  public toggleDirection = () => {
    this.direction = this.direction === flexDirections.horizontal ? flexDirections.vertical : flexDirections.horizontal;
  };
}
