import { shipId } from "../../typedefs";
import { Ship } from "../ship";

import { allShipIds } from "../../constants";

export const generateShips = () => {
  const ships = new Map<shipId, Ship>();

  let i: number = 0;

  for (const shipId of allShipIds) {
    ships.set(allShipIds[i], new Ship(allShipIds[i], Number(shipId.split("-")[0])));

    i++;
  }


  return ships;
};
