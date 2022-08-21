import { useRootStore } from "/store";

import { Docks } from "./docks";
import { Pier } from "./pier";

import "./port.scss";

export const Port = () => {
    const { shipsController: { randomShips } } = useRootStore();

    return (
        <div className="port">
            <Docks />
            <Pier />
            <button onClick={randomShips}>random</button>
        </div>
    );
};
