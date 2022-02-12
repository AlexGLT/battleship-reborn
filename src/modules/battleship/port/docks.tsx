import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Ship } from "../ship";

export const Docks = observer(() => {
  const { shipsInDocks } = useBattleShipStore();

  return (
    <div className="port__docks">
      {shipsInDocks.map(({ id, length, direction, placement }) => (
        <Ship key={id} id={id} length={length} direction={direction} placement={placement} />)
      )}
    </div>
  );
});
