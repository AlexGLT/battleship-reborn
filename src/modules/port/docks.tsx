import { observer } from "mobx-react-lite";

import { useRootStore } from "/store";

import { Ship } from "./ship";

export const Docks = observer(() => {
    const { shipsController: { shipsInDocksCount } } = useRootStore();

    return (
        <div className="port__docks">
            {Object.entries(shipsInDocksCount).reverse().map(([shipLength, remainingShipsCount]) => (
                <div key={shipLength} className="port__dock-zone">
                    <Ship length={+shipLength} />
                    <div className="port__counter-container">
                        <h1>{`x${remainingShipsCount}`}</h1>
                    </div>
                </div>
            ))}
        </div>
    );
});
