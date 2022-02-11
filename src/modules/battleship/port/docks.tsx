import { observer } from "mobx-react-lite";

import { useBattleShipStore } from "../hooks";

import { Ship } from "../ship";

export const Docks = observer(() => {
  const { shipsInDocs } = useBattleShipStore();

  return (
    <div className="port__docks">
      {shipsInDocs.map(({ id, length, direction, placement }) => (
        <Ship key={id} id={id} length={length} direction={direction} placement={placement} />)
      )}
    </div>
  );
});
