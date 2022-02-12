import { makeAutoObservable } from "mobx";

import { directions, locations, shipsId } from "../constants";

export class Ship {
  public id: typeof shipsId[number];
  public length: number;
  public direction: directions;
  public placement: locations;

  constructor(id: typeof shipsId[number], length: number, direction = directions.horizontal, placement = locations.docks) {
    this.id = id;
    this.length = length;
    this.direction = direction;
    this.placement = placement;

    makeAutoObservable(this);
  }

  public toggleDirection = () => {
    this.direction = this.direction === directions.horizontal ? directions.vertical : directions.horizontal;
  };
}
