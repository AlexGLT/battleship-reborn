import { makeAutoObservable } from "mobx";

import { shipId } from "../typedefs";

import { directions } from "../constants";

export class Ship {
  public id: shipId;
  public length: number;
  public direction: directions;

  constructor(id: shipId, length: number, direction = directions.horizontal) {
    this.id = id;
    this.length = length;
    this.direction = direction;

    makeAutoObservable(this);
  }

  public toggleDirection = () => {
    this.direction = this.direction === directions.horizontal ? directions.vertical : directions.horizontal;
  };
}
