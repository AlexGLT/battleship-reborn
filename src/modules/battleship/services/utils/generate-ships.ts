import { Ship } from "../state-elements";

import { shipLengthsAndCounts } from "../../constants";

export const generateShips = () => {
    const ships = new Map<string, Ship>();

    for (const [shipLength, shipsCount] of Array.from(Object.entries(shipLengthsAndCounts)).reverse()) {
        for (let i = 0; i < shipsCount; i++) {
            const shipId = `${shipLength}-deck-${i}`;

            ships.set(shipId, new Ship(shipId, +shipLength));
        }
    }

    return ships;
};
