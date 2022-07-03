import { Docks } from "./docks";
import { Pier } from "./pier";

import "./port.scss";
import { useBattleShipStore } from "../hooks";

export const Port = () => {
    const { randomShips } = useBattleShipStore();

    return (
        <div className="port">
            <Docks />
            <Pier />
            <button onClick={randomShips}>random</button>
        </div>
    );
};
