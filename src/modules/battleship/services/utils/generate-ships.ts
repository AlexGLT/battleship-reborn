import { locations, shipsId } from "../../constants";
import { Ship } from "../ship";

export const generateShips = () => {
  const shipDecksCount = [4, 3, 2, 1];

  const ships = [];

  let i: number = 0;

  for (const deckCount of shipDecksCount) {
    const shipWithThisDeckCount = [];

    for (let j = 0; j <= 4 - deckCount; j++) {
      shipWithThisDeckCount.push(new Ship(shipsId[i], deckCount));

      i++;
    }

    ships.push(shipWithThisDeckCount);
  }

  const flatShipArray = ships.flat();

  flatShipArray[0].placement = locations.pier;

  return flatShipArray;
};
