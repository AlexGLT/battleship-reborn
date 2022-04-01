import { allShipIds } from "./constants";

export type shipId = typeof allShipIds[number];

export class Position {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class CellPosition extends Position {
  public get index() {
    return this.x * 10 + this.y;
  }

  public static position2Index = (x: number, y: number) => x * 10 + y;

  public static index2Position = (index: number) => ({
    x: Math.trunc(index / 10),
    y: index % 10
  });
}
