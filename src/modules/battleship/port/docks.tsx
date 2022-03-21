import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Ship } from "../components";

export const Docks = observer(() => {
  const { shipsInDocks } = useBattleShipStore();

  return (
    <div className="port__docks">
      {[...shipsInDocks].reverse().map((count, index) => (
        <div key={index} className="port__dock-zone">
          <Ship length={4 - index} />
          <div className="port__counter-container">
            <h1>{`x${count}`}</h1>
          </div>
        </div>
      ))}
    </div>
  );
});
