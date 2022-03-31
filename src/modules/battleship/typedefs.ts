import { allShipIds } from "./constants";

export type shipId = typeof allShipIds[number];

export type position = {
  x: number | null,
  y: number | null
}
